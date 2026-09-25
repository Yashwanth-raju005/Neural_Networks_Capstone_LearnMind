import os
import json
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required

from models.db import (
    init_db,
    create_user,
    get_user_by_email,
    get_user_by_username,
    get_user_by_id,
    verify_password,
    save_profile,
    get_profile,
    save_learning_path,
    get_learning_path,
    save_progress,
    get_progress,
    save_prediction,
    save_learning_tasks,
    get_learning_tasks,
    toggle_learning_task,
    get_leaderboard,
    list_users,
    list_student_overviews,
    get_student_detail,
    get_admin_users,
    get_messages,
    save_message,
    get_quiz_attempts,
    save_quiz_attempt,
    save_assistant_message,
    get_assistant_messages,
    clear_assistant_messages,
    save_escalation,
        get_escalations,
    get_student_analytics,
    delete_user,
    ensure_admin,
    is_admin,
    update_user_email,
)
from services.ml_service import predict_learning_profile, train_and_save_model
from services.learning_content import get_quiz_catalog, get_quiz, answer_assistant, build_topic_checklist

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'learnmind-secret-key-change-me-2026')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
CORS(app)
jwt = JWTManager(app)


def get_current_user():
    return get_user_by_id(int(get_jwt_identity()))


def admin_required(view):
    @wraps(view)
    @jwt_required()
    def wrapped(*args, **kwargs):
        user = get_current_user()
        if not user or (user['role'] != 'admin' and not is_admin(user['id'])):
            return jsonify({'error': 'Admin access required'}), 403
        return view(*args, **kwargs)
    return wrapped


def student_required(view):
    @wraps(view)
    @jwt_required()
    def wrapped(*args, **kwargs):
        user = get_current_user()
        if not user or user['role'] != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return view(*args, **kwargs)
    return wrapped


def ensure_progressive_tasks(user_id):
    tasks = get_learning_tasks(user_id)
    profile = get_profile(user_id) or {}
    expanded = build_topic_checklist(profile.get('interest'), profile.get('career_goal'), profile.get('resource_focus') or 'Both')
    existing_has_links = any(
        task.get('video_url') or task.get('documentation_url') or task.get('practice_url')
        for task in tasks
    )
    expanded_has_links = any(task.get('resources') for task in expanded)
    first_task = tasks[0] if tasks else {}
    existing_signature = {
        first_task.get(field)
        for field in ('video_url', 'documentation_url', 'practice_url', 'additional_url')
        if first_task.get(field)
    }
    expanded_signature = set((expanded[0].get('resources') or {}).values()) if expanded else set()
    requires_upgrade = (
        len(tasks) < 10
        or any(not task.get('task_id', '').startswith('topic-') for task in tasks)
        or (expanded_has_links and not existing_has_links)
        or (expanded_has_links and existing_signature != expanded_signature)
    )
    if not requires_upgrade:
        return tasks
    completed_count = sum(1 for task in tasks if task.get('completed'))
    for task in expanded[:completed_count]:
        task['completed'] = 1
    save_learning_tasks(user_id, expanded)
    return get_learning_tasks(user_id)


@app.before_request
def init_app_state():
    if not hasattr(app, 'initialized'):
        init_db()
        if not get_user_by_username('admin'):
            create_user('admin', 'admin@learnmind.ai', 'Admin123!', role='admin')
            ensure_admin('admin')
        app.initialized = True


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password', '')
    role = (data.get('role') or 'student').strip().lower()

    if not username or not email or not password:
        return jsonify({'error': 'Username, email and password are required'}), 400
    if role not in ('student', 'admin'):
        return jsonify({'error': 'Role must be student or admin'}), 400
    if get_user_by_username(username):
        return jsonify({'error': 'Username already exists'}), 400
    if get_user_by_email(email):
        return jsonify({'error': 'Email already exists'}), 400

    user_id = create_user(username, email, password, role)
    if role == 'admin':
        ensure_admin(username)

    token = create_access_token(identity=str(user_id))
    return jsonify({'message': 'User created', 'token': token, 'user': {'id': user_id, 'username': username, 'email': email, 'role': role}})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password', '')
    user = get_user_by_username(username)
    if not user or not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid username or password'}), 401

    token = create_access_token(identity=str(user['id']))
    return jsonify({'message': 'Logged in', 'token': token, 'user': {'id': user['id'], 'username': user['username'], 'email': user['email'], 'role': user['role']}})


@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user = get_current_user()
    user_id = user['id']
    profile_data = get_profile(user['id']) or {}
    progress_data = get_progress(user['id']) or {}
    return jsonify({'user': {'id': user['id'], 'username': user['username'], 'email': user['email'], 'role': user['role']}, 'profile': profile_data, 'progress': progress_data})


@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user = get_current_user()
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or user['email']).strip().lower()
    existing_email = get_user_by_email(email)
    if existing_email and existing_email['id'] != user['id']:
        return jsonify({'error': 'Email already exists'}), 400
    if email != user['email']:
        update_user_email(user['id'], email)
    allowed = ('full_name', 'college', 'phone', 'course', 'branch', 'graduation_year', 'profile_picture', 'resource_focus')
    profile_data = {field: data.get(field) for field in allowed if field in data}
    if 'graduation_year' in profile_data and profile_data['graduation_year'] not in (None, ''):
        try:
            profile_data['graduation_year'] = int(profile_data['graduation_year'])
        except (TypeError, ValueError):
            return jsonify({'error': 'Graduation year must be a number'}), 400
    save_profile(user['id'], profile_data)
    return jsonify({'message': 'Profile updated', 'profile': get_profile(user['id']) or {}})


@app.route('/predict', methods=['POST'])
@student_required
def predict():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    payload = {
        'interest': (data.get('interest') or '').strip(),
        'current_skill': (data.get('current_skill') or '').strip(),
        'career_goal': (data.get('career_goal') or '').strip(),
        'learning_style': (data.get('learning_style') or '').strip(),
        'available_hours': int(data.get('available_hours', 10) or 10),
        'previous_score': int(data.get('previous_score', 75) or 75),
        'completed_subjects': int(data.get('completed_subjects', 2) or 2),
        'current_knowledge': int(data.get('current_knowledge', 3) or 3),
        'resource_focus': (data.get('resource_focus') or 'Both').strip().title(),
    }
    if not payload['interest'] or not payload['career_goal']:
        return jsonify({'error': 'Learning interest and career goal are required'}), 400
    try:
        prediction = predict_learning_profile(payload)
    except Exception:
        app.logger.exception('Roadmap generation failed for user %s', user_id)
        return jsonify({'error': 'We could not generate your learning path right now. Please try again.'}), 503
    try:
        save_profile(user_id, payload)
        save_prediction(user_id, payload, prediction, prediction['confidence'])
        save_learning_tasks(user_id, prediction.get('task_checklist', []))
        save_learning_path(user_id, {
            'title': f"{payload['interest']} Learning Journey",
            'difficulty': prediction['difficulty'],
            'estimated_time': f"{max(3, int(prediction['daily_hours'] * 7))} weeks",
            'confidence': prediction['confidence'],
            'roadmap': prediction['roadmap'],
            'study_plan': prediction['study_plan'],
            'daily_tasks': prediction['daily_tasks'],
            'weekly_tasks': prediction['weekly_tasks'],
            'resources': prediction['resources'],
        })
    except Exception:
        app.logger.exception('Roadmap persistence failed for user %s', user_id)
        return jsonify({'error': 'Your learning path was generated but could not be saved. Please try again.'}), 503
    return jsonify({'prediction': prediction})


@app.route('/learning-path', methods=['GET'])
@student_required
def learning_path():
    user_id = int(get_jwt_identity())
    path = get_learning_path(user_id)
    if not path:
        return jsonify({'message': 'No learning path generated yet'}), 404
    tasks = ensure_progressive_tasks(user_id)
    return jsonify({'learning_path': {**path, 'tasks': tasks}})


@app.route('/learning-tasks', methods=['GET', 'PUT'])
@student_required
def learning_tasks():
    user_id = int(get_jwt_identity())
    if request.method == 'GET':
        return jsonify({'tasks': get_learning_tasks(user_id)})

    data = request.get_json(silent=True) or {}
    task_id = data.get('task_id')
    completed = bool(data.get('completed'))
    if not task_id:
        return jsonify({'error': 'task_id is required'}), 400
    result = toggle_learning_task(user_id, task_id, completed)
    return jsonify({'message': 'Task status updated', **result})


@app.route('/leaderboard', methods=['GET'])
@jwt_required()
def leaderboard():
    return jsonify({'leaderboard': get_leaderboard()})


@app.route('/train-model', methods=['POST'])
@admin_required
def train_model():
    result = train_and_save_model()
    return jsonify({'message': 'Model retrained successfully', 'result': result})


@app.route('/analytics', methods=['GET'])
@student_required
def analytics():
    user_id = int(get_jwt_identity())
    return jsonify(get_student_analytics(user_id))


@app.route('/dashboard', methods=['GET'])
@student_required
def dashboard():
    user_id = int(get_jwt_identity())
    user = get_user_by_id(user_id)
    profile = get_profile(user_id) or {}
    progress = get_progress(user_id) or {}
    path = get_learning_path(user_id)
    tasks = ensure_progressive_tasks(user_id) if path else get_learning_tasks(user_id)
    leaderboard = get_leaderboard()
    current_rank = next((index + 1 for index, entry in enumerate(leaderboard) if entry['username'] == user['username']), None)
    return jsonify({
        'welcome': f"Welcome back, {user['username']}",
        'profile': profile,
        'progress': progress,
        'learning_path': {**(path or {}), 'tasks': tasks},
        'leaderboard': leaderboard,
        'current_rank': current_rank,
        'total_students': len(leaderboard),
        'quiz_attempts': get_quiz_attempts(user_id),
        'completed_topics': [task['title'] for task in tasks if task['completed']],
        'pending_topics': [task['title'] for task in tasks if not task['completed']],
        'recommendations': [
            'Focus on project-based learning this week',
            'Increase daily consistency to reach your goal faster',
            'Use the AI-generated study plan for the next 7 days',
        ],
    })


@app.route('/progress', methods=['PUT'])
@student_required
def progress_update():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    save_progress(user_id, data)
    return jsonify({'message': 'Progress updated'})


@app.route('/quizzes', methods=['GET'])
@student_required
def quizzes():
    user_id = int(get_jwt_identity())
    profile = get_profile(user_id) or {}
    domain = request.args.get('domain') or profile.get('interest') or 'Artificial Intelligence'
    return jsonify({'quizzes': get_quiz_catalog(domain), 'domain': domain})


@app.route('/quizzes/<quiz_id>', methods=['GET'])
@student_required
def quiz_detail(quiz_id):
    user_id = int(get_jwt_identity())
    profile = get_profile(user_id) or {}
    quiz = get_quiz(profile.get('interest') or 'Artificial Intelligence', quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    return jsonify({'quiz': {**quiz, 'questions': [{key: value for key, value in question.items() if key not in ('answer', 'explanation')} for question in quiz['questions']]}})


@app.route('/quiz-attempts', methods=['GET', 'POST'])
@student_required
def quiz_attempts():
    user_id = int(get_jwt_identity())
    if request.method == 'GET':
        return jsonify({'attempts': get_quiz_attempts(user_id)})
    data = request.get_json(silent=True) or {}
    profile = get_profile(user_id) or {}
    quiz = get_quiz(profile.get('interest') or 'Artificial Intelligence', data.get('quiz_id'))
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    submitted = data.get('answers') or {}
    if not isinstance(submitted, dict):
        return jsonify({'error': 'Answers must be an object'}), 400
    answers = []
    score = 0
    for question in quiz['questions']:
        selected = submitted.get(question['id'])
        try:
            selected = int(selected) if selected is not None else None
        except (TypeError, ValueError):
            selected = None
        correct = selected == question['answer']
        score += int(correct)
        answers.append({'question_id': question['id'], 'selected': selected, 'correct_answer': question['answer'], 'correct': correct, 'explanation': question['explanation']})
    attempt = save_quiz_attempt(user_id, quiz['id'], quiz['domain'], score, len(quiz['questions']), answers)
    return jsonify({'attempt': attempt, 'score': score, 'total': len(quiz['questions']), 'feedback': 'Excellent work.' if score >= 4 else 'Review the missed topics and try again.'}), 201


@app.route('/assistant', methods=['GET', 'POST'])
@student_required
def assistant():
    user_id = int(get_jwt_identity())
    if request.method == 'GET':
        return jsonify({'messages': get_assistant_messages(user_id)})
    data = request.get_json(silent=True) or {}
    question = (data.get('message') or '').strip()
    if not question:
        return jsonify({'error': 'Message cannot be empty'}), 400
    if len(question) > 2000:
        return jsonify({'error': 'Message is too long'}), 400
    profile = get_profile(user_id) or {}
    progress = get_progress(user_id) or {}
    path = get_learning_path(user_id) or {}
    path['tasks'] = get_learning_tasks(user_id)
    history = get_assistant_messages(user_id)
    topic = (data.get('topic') or '').strip()
    save_assistant_message(user_id, 'user', question)
    response = answer_assistant(question, profile.get('interest'), path, progress, history, topic)
    assistant_message = save_assistant_message(user_id, 'assistant', response)
    return jsonify({'message': assistant_message}), 201


@app.route('/assistant', methods=['DELETE'])
@student_required
def clear_assistant():
    clear_assistant_messages(int(get_jwt_identity()))
    return jsonify({'message': 'Assistant conversation cleared'})


@app.route('/assistant/escalate', methods=['POST'])
@student_required
def assistant_escalate():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    question = (data.get('question') or '').strip()
    response = (data.get('assistant_response') or '').strip()
    if not question or not response:
        return jsonify({'error': 'Question and assistant response are required'}), 400
    return jsonify({'escalation': save_escalation(user_id, question, response)}), 201


@app.route('/admin/users', methods=['GET'])
@admin_required
def admin_users():
    return jsonify({'users': list_student_overviews()})


@app.route('/admin/students/<int:student_id>', methods=['GET'])
@admin_required
def admin_student_detail(student_id):
    student = get_student_detail(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    student['analytics'] = get_student_analytics(student_id)
    return jsonify({'student': student})


@app.route('/admin/analytics', methods=['GET'])
@admin_required
def admin_analytics():
    students = list_student_overviews()
    return jsonify({
        'total_students': len(students),
        'active_students': sum(1 for student in students if student.get('learning_path_title')),
        'average_progress': round(sum(student.get('overall_progress') or 0 for student in students) / len(students), 1) if students else 0,
        'open_escalations': len(get_escalations()),
        'students': students,
    })


@app.route('/messages/<int:other_user_id>', methods=['GET', 'POST'])
@jwt_required()
def messages(other_user_id):
    user = get_current_user()
    other_user = get_user_by_id(other_user_id)
    if not other_user:
        return jsonify({'error': 'User not found'}), 404
    valid_pair = (
        user['role'] == 'admin' and other_user['role'] == 'student'
    ) or (
        user['role'] == 'student' and other_user['role'] == 'admin'
    )
    if not valid_pair:
        return jsonify({'error': 'Messages are only available between admins and students'}), 403
    if request.method == 'GET':
        return jsonify({'messages': get_messages(user['id'], other_user_id)})

    data = request.get_json(silent=True) or {}
    body = (data.get('message') or '').strip()
    if not body:
        return jsonify({'error': 'Message cannot be empty'}), 400
    if len(body) > 2000:
        return jsonify({'error': 'Message is too long'}), 400
    return jsonify({'message': save_message(user['id'], other_user_id, body)}), 201


@app.route('/contact/admins', methods=['GET'])
@jwt_required()
def contact_admins():
    user = get_current_user()
    if user['role'] != 'student':
        return jsonify({'admins': []})
    admins = []
    for admin in get_admin_users():
        admin_user = get_user_by_id(admin['id'])
        admins.append({'id': admin_user['id'], 'username': admin_user['username']})
    return jsonify({'admins': admins})


@app.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user_route():
    user_id = int(get_jwt_identity())
    user = get_user_by_id(user_id)
    data = request.get_json(silent=True) or {}
    target_user_id = data.get('user_id') or user_id
    if user['role'] != 'admin' and not is_admin(user_id) and target_user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    delete_user(target_user_id)
    return jsonify({'message': 'User removed'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
