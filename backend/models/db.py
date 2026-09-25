import json
import os
import sqlite3
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'learnmind.db')


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS student_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            full_name TEXT,
            college TEXT,
            phone TEXT,
            course TEXT,
            branch TEXT,
            graduation_year INTEGER,
            profile_picture TEXT,
            interest TEXT,
            current_skill TEXT,
            career_goal TEXT,
            learning_style TEXT,
            available_hours INTEGER,
            previous_score INTEGER,
            completed_subjects INTEGER,
            current_knowledge INTEGER,
            resource_focus TEXT,
            updated_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS learning_paths (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            estimated_time TEXT NOT NULL,
            confidence REAL NOT NULL,
            roadmap TEXT NOT NULL,
            study_plan TEXT NOT NULL,
            daily_tasks TEXT NOT NULL,
            weekly_tasks TEXT NOT NULL,
            resources TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS learning_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            task_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_url TEXT NOT NULL,
            video_url TEXT,
            documentation_url TEXT,
            practice_url TEXT,
            additional_url TEXT,
            points INTEGER NOT NULL DEFAULT 5,
            completed INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            completed_courses INTEGER DEFAULT 0,
            current_streak INTEGER DEFAULT 0,
            weekly_hours REAL DEFAULT 0,
            overall_progress REAL DEFAULT 0,
            xp_points INTEGER DEFAULT 0,
            tasks_completed INTEGER DEFAULT 0,
            updated_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            xp_points INTEGER DEFAULT 0,
            tasks_completed INTEGER DEFAULT 0,
            updated_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS model_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            input_data TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            user_id INTEGER UNIQUE NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            quiz_id TEXT NOT NULL,
            domain TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            answers TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS assistant_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS support_escalations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            assistant_response TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'open',
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    migrate_schema()


def migrate_schema():
    conn = get_connection()
    profile_columns = [row['name'] for row in conn.execute('PRAGMA table_info(student_profiles)').fetchall()]
    for column, definition in {
        'full_name': 'TEXT',
        'college': 'TEXT',
        'phone': 'TEXT',
        'course': 'TEXT',
        'branch': 'TEXT',
        'graduation_year': 'INTEGER',
        'profile_picture': 'TEXT',
        'resource_focus': 'TEXT',
    }.items():
        if column not in profile_columns:
            conn.execute(f'ALTER TABLE student_profiles ADD COLUMN {column} {definition}')
    progress_columns = [row['name'] for row in conn.execute('PRAGMA table_info(progress)').fetchall()]
    task_columns = [row['name'] for row in conn.execute('PRAGMA table_info(learning_tasks)').fetchall()]
    for column in ('video_url', 'documentation_url', 'practice_url', 'additional_url'):
        if column not in task_columns:
            conn.execute(f'ALTER TABLE learning_tasks ADD COLUMN {column} TEXT')
    if 'xp_points' not in progress_columns:
        conn.execute('ALTER TABLE progress ADD COLUMN xp_points INTEGER DEFAULT 0')
    if 'tasks_completed' not in progress_columns:
        conn.execute('ALTER TABLE progress ADD COLUMN tasks_completed INTEGER DEFAULT 0')
    conn.commit()
    conn.close()


def create_user(username, email, password, role='student'):
    conn = get_connection()
    password_hash = generate_password_hash(password)
    current_time = datetime.utcnow().isoformat()
    cursor = conn.execute(
        'INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
        (username, email, password_hash, role, current_time),
    )
    user_id = cursor.lastrowid
    conn.execute('INSERT INTO progress (user_id, updated_at) VALUES (?, ?)', (user_id, current_time))
    conn.execute('INSERT OR IGNORE INTO leaderboard (user_id, xp_points, tasks_completed, updated_at) VALUES (?, ?, ?, ?)', (user_id, 0, 0, current_time))
    conn.commit()
    conn.close()
    return user_id


def get_user_by_username(username):
    conn = get_connection()
    row = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    return row


def get_user_by_email(email):
    conn = get_connection()
    row = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    return row


def get_user_by_id(user_id):
    conn = get_connection()
    row = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return row


def update_user_email(user_id, email):
    conn = get_connection()
    conn.execute('UPDATE users SET email = ? WHERE id = ?', (email, user_id))
    conn.commit()
    conn.close()


def verify_password(password, password_hash):
    return check_password_hash(password_hash, password)


def save_profile(user_id, data):
    conn = get_connection()
    updated_at = datetime.utcnow().isoformat()
    conn.execute('''
        INSERT INTO student_profiles (user_id, full_name, college, phone, course, branch, graduation_year, profile_picture, interest, current_skill, career_goal, learning_style, available_hours, previous_score, completed_subjects, current_knowledge, resource_focus, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            full_name=COALESCE(excluded.full_name, student_profiles.full_name),
            college=COALESCE(excluded.college, student_profiles.college),
            phone=COALESCE(excluded.phone, student_profiles.phone),
            course=COALESCE(excluded.course, student_profiles.course),
            branch=COALESCE(excluded.branch, student_profiles.branch),
            graduation_year=COALESCE(excluded.graduation_year, student_profiles.graduation_year),
            profile_picture=COALESCE(excluded.profile_picture, student_profiles.profile_picture),
            interest=COALESCE(excluded.interest, student_profiles.interest),
            current_skill=COALESCE(excluded.current_skill, student_profiles.current_skill),
            career_goal=COALESCE(excluded.career_goal, student_profiles.career_goal),
            learning_style=COALESCE(excluded.learning_style, student_profiles.learning_style),
            available_hours=COALESCE(excluded.available_hours, student_profiles.available_hours),
            previous_score=COALESCE(excluded.previous_score, student_profiles.previous_score),
            completed_subjects=COALESCE(excluded.completed_subjects, student_profiles.completed_subjects),
            current_knowledge=COALESCE(excluded.current_knowledge, student_profiles.current_knowledge),
            resource_focus=COALESCE(excluded.resource_focus, student_profiles.resource_focus),
            updated_at=excluded.updated_at
    ''', (
        user_id,
        data.get('full_name'),
        data.get('college'),
        data.get('phone'),
        data.get('course'),
        data.get('branch'),
        data.get('graduation_year'),
        data.get('profile_picture'),
        data.get('interest'),
        data.get('current_skill'),
        data.get('career_goal'),
        data.get('learning_style'),
        data.get('available_hours'),
        data.get('previous_score'),
        data.get('completed_subjects'),
        data.get('current_knowledge'),
        data.get('resource_focus'),
        updated_at,
    ))
    conn.commit()
    conn.close()


def get_profile(user_id):
    conn = get_connection()
    row = conn.execute('SELECT * FROM student_profiles WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def save_learning_path(user_id, payload):
    conn = get_connection()
    conn.execute('''
        INSERT INTO learning_paths (user_id, title, difficulty, estimated_time, confidence, roadmap, study_plan, daily_tasks, weekly_tasks, resources, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        payload['title'],
        payload['difficulty'],
        payload['estimated_time'],
        payload['confidence'],
        json.dumps(payload['roadmap']),
        json.dumps(payload['study_plan']),
        json.dumps(payload['daily_tasks']),
        json.dumps(payload['weekly_tasks']),
        json.dumps(payload['resources']),
        datetime.utcnow().isoformat(),
    ))
    conn.commit()
    conn.close()


def get_learning_path(user_id):
    conn = get_connection()
    row = conn.execute('SELECT * FROM learning_paths WHERE user_id = ? ORDER BY id DESC LIMIT 1', (user_id,)).fetchone()
    conn.close()
    if not row:
        return None
    return {
        'id': row['id'],
        'title': row['title'],
        'difficulty': row['difficulty'],
        'estimated_time': row['estimated_time'],
        'confidence': row['confidence'],
        'roadmap': json.loads(row['roadmap']),
        'study_plan': json.loads(row['study_plan']),
        'daily_tasks': json.loads(row['daily_tasks']),
        'weekly_tasks': json.loads(row['weekly_tasks']),
        'resources': json.loads(row['resources']),
        'created_at': row['created_at'],
    }


def save_progress(user_id, payload):
    conn = get_connection()
    updated_at = datetime.utcnow().isoformat()
    xp_points = payload.get('xp_points', 0)
    tasks_completed = payload.get('tasks_completed', 0)
    conn.execute('''
        INSERT INTO progress (user_id, completed_courses, current_streak, weekly_hours, overall_progress, xp_points, tasks_completed, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            completed_courses=excluded.completed_courses,
            current_streak=excluded.current_streak,
            weekly_hours=excluded.weekly_hours,
            overall_progress=excluded.overall_progress,
            xp_points=excluded.xp_points,
            tasks_completed=excluded.tasks_completed,
            updated_at=excluded.updated_at
    ''', (
        user_id,
        payload.get('completed_courses', 0),
        payload.get('current_streak', 0),
        payload.get('weekly_hours', 0),
        payload.get('overall_progress', 0),
        xp_points,
        tasks_completed,
        updated_at,
    ))
    conn.execute('''
        INSERT INTO leaderboard (user_id, xp_points, tasks_completed, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            xp_points=excluded.xp_points,
            tasks_completed=excluded.tasks_completed,
            updated_at=excluded.updated_at
    ''', (
        user_id,
        xp_points,
        tasks_completed,
        updated_at,
    ))
    conn.commit()
    conn.close()


def get_progress(user_id):
    conn = get_connection()
    row = conn.execute('SELECT * FROM progress WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def save_learning_tasks(user_id, tasks):
    conn = get_connection()
    conn.execute('DELETE FROM learning_tasks WHERE user_id = ?', (user_id,))
    for task in tasks:
        conn.execute('''
            INSERT INTO learning_tasks (user_id, task_id, title, description, resource_type, resource_url, video_url, documentation_url, practice_url, additional_url, points, completed, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            task.get('task_id') or task.get('title') or str(task),
            task.get('title') or 'Learning task',
            task.get('description') or 'Practice and review this concept.',
            task.get('resource_type') or 'Documentation',
            task.get('resource_url') or '',
            (task.get('resources') or {}).get('video'),
            (task.get('resources') or {}).get('documentation'),
            (task.get('resources') or {}).get('practice'),
            (task.get('resources') or {}).get('additional'),
            int(task.get('points', 5) or 5),
            int(task.get('completed', 0) or 0),
            datetime.utcnow().isoformat(),
        ))
    completed_count = conn.execute(
        'SELECT COUNT(*) AS count FROM learning_tasks WHERE user_id = ? AND completed = 1',
        (user_id,),
    ).fetchone()['count']
    total_count = conn.execute(
        'SELECT COUNT(*) AS count FROM learning_tasks WHERE user_id = ?',
        (user_id,),
    ).fetchone()['count']
    conn.execute('''
        UPDATE progress
        SET tasks_completed = ?, overall_progress = ?, updated_at = ?
        WHERE user_id = ?
    ''', (completed_count, round((completed_count / total_count) * 100, 1) if total_count else 0, datetime.utcnow().isoformat(), user_id))
    conn.commit()
    conn.close()


def get_learning_tasks(user_id):
    conn = get_connection()
    rows = conn.execute('SELECT * FROM learning_tasks WHERE user_id = ? ORDER BY id', (user_id,)).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def toggle_learning_task(user_id, task_id, completed):
    conn = get_connection()
    updated_at = datetime.utcnow().isoformat()
    conn.execute('UPDATE learning_tasks SET completed = ? WHERE user_id = ? AND task_id = ?', (int(completed), user_id, task_id))
    rows = conn.execute('SELECT id, points, completed FROM learning_tasks WHERE user_id = ?', (user_id,)).fetchall()
    xp_points = sum(int(row['points']) for row in rows if row['completed'])
    tasks_completed = sum(1 for row in rows if row['completed'])
    overall_progress = round((tasks_completed / len(rows)) * 100, 1) if rows else 0
    conn.execute('''
        INSERT INTO leaderboard (user_id, xp_points, tasks_completed, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            xp_points=excluded.xp_points,
            tasks_completed=excluded.tasks_completed,
            updated_at=excluded.updated_at
    ''', (user_id, xp_points, tasks_completed, updated_at))
    conn.execute('''
        INSERT INTO progress (user_id, xp_points, tasks_completed, overall_progress, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            xp_points=excluded.xp_points,
            tasks_completed=excluded.tasks_completed,
            overall_progress=excluded.overall_progress,
            updated_at=excluded.updated_at
    ''', (user_id, xp_points, tasks_completed, overall_progress, updated_at))
    conn.commit()
    conn.close()
    return {'xp_points': xp_points, 'tasks_completed': tasks_completed, 'overall_progress': overall_progress}


def get_leaderboard():
    conn = get_connection()
    rows = conn.execute('''
        SELECT u.username, COALESCE(sp.full_name, u.username) AS full_name,
               l.xp_points, l.tasks_completed, COALESCE(p.overall_progress, 0) AS overall_progress
        FROM leaderboard l
        JOIN users u ON u.id = l.user_id
        LEFT JOIN student_profiles sp ON sp.user_id = u.id
        LEFT JOIN progress p ON p.user_id = u.id
        WHERE u.role = 'student'
        ORDER BY l.xp_points DESC, l.tasks_completed DESC, u.username ASC
    ''').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def save_prediction(user_id, input_data, prediction, confidence):
    conn = get_connection()
    conn.execute('INSERT INTO model_predictions (user_id, input_data, prediction, confidence, created_at) VALUES (?, ?, ?, ?, ?)', (
        user_id,
        json.dumps(input_data),
        json.dumps(prediction),
        confidence,
        datetime.utcnow().isoformat(),
    ))
    conn.commit()
    conn.close()


def list_users():
    conn = get_connection()
    rows = conn.execute('SELECT id, username, email, role, created_at FROM users ORDER BY id').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def list_student_overviews():
    conn = get_connection()
    rows = conn.execute('''
        SELECT u.id, u.username, u.email, u.created_at,
               sp.full_name, sp.college, sp.course, sp.branch,
               sp.graduation_year, sp.interest,
               p.overall_progress, p.completed_courses, p.current_streak,
               p.weekly_hours, p.xp_points, p.tasks_completed,
               lp.title AS learning_path_title, lp.difficulty,
               lp.estimated_time,
               COUNT(lt.id) AS total_tasks,
               COALESCE(SUM(CASE WHEN lt.completed = 1 THEN 1 ELSE 0 END), 0) AS completed_tasks
        FROM users u
        LEFT JOIN student_profiles sp ON sp.user_id = u.id
        LEFT JOIN progress p ON p.user_id = u.id
        LEFT JOIN learning_paths lp ON lp.id = (
            SELECT latest.id FROM learning_paths latest
            WHERE latest.user_id = u.id ORDER BY latest.id DESC LIMIT 1
        )
        LEFT JOIN learning_tasks lt ON lt.user_id = u.id
        WHERE u.role = 'student'
        GROUP BY u.id, lp.id
        ORDER BY u.created_at DESC
    ''').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_student_detail(user_id):
    conn = get_connection()
    row = conn.execute('''
        SELECT u.id, u.username, u.email, u.role, u.created_at,
               sp.*, p.completed_courses, p.current_streak, p.weekly_hours,
               p.overall_progress, p.xp_points, p.tasks_completed,
               lp.id AS learning_path_id, lp.title AS learning_path_title,
               lp.difficulty, lp.estimated_time, lp.confidence,
               lp.roadmap, lp.study_plan, lp.daily_tasks, lp.weekly_tasks,
               lp.resources, lp.created_at AS learning_path_created_at
        FROM users u
        LEFT JOIN student_profiles sp ON sp.user_id = u.id
        LEFT JOIN progress p ON p.user_id = u.id
        LEFT JOIN learning_paths lp ON lp.id = (
            SELECT latest.id FROM learning_paths latest
            WHERE latest.user_id = u.id ORDER BY latest.id DESC LIMIT 1
        )
        WHERE u.id = ? AND u.role = 'student'
    ''', (user_id,)).fetchone()
    tasks = conn.execute(
        'SELECT * FROM learning_tasks WHERE user_id = ? ORDER BY id',
        (user_id,),
    ).fetchall()
    conn.close()
    if not row:
        return None
    result = dict(row)
    for field in ('roadmap', 'study_plan', 'daily_tasks', 'weekly_tasks', 'resources'):
        if result.get(field):
            result[field] = json.loads(result[field])
    result['tasks'] = [dict(task) for task in tasks]
    return result


def save_quiz_attempt(user_id, quiz_id, domain, score, total, answers):
    conn = get_connection()
    cursor = conn.execute('''
        INSERT INTO quiz_attempts (user_id, quiz_id, domain, score, total, answers, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, quiz_id, domain, score, total, json.dumps(answers), datetime.utcnow().isoformat()))
    conn.commit()
    attempt = conn.execute('SELECT * FROM quiz_attempts WHERE id = ?', (cursor.lastrowid,)).fetchone()
    conn.close()
    result = dict(attempt)
    result['answers'] = json.loads(result['answers'])
    return result


def get_quiz_attempts(user_id):
    conn = get_connection()
    rows = conn.execute('SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY id DESC', (user_id,)).fetchall()
    conn.close()
    attempts = []
    for row in rows:
        attempt = dict(row)
        attempt['answers'] = json.loads(attempt['answers'])
        attempts.append(attempt)
    return attempts


def save_assistant_message(user_id, role, body):
    conn = get_connection()
    cursor = conn.execute(
        'INSERT INTO assistant_messages (user_id, role, body, created_at) VALUES (?, ?, ?, ?)',
        (user_id, role, body, datetime.utcnow().isoformat()),
    )
    conn.commit()
    row = conn.execute('SELECT * FROM assistant_messages WHERE id = ?', (cursor.lastrowid,)).fetchone()
    conn.close()
    return dict(row)


def get_assistant_messages(user_id):
    conn = get_connection()
    rows = conn.execute('SELECT * FROM assistant_messages WHERE user_id = ? ORDER BY id', (user_id,)).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def clear_assistant_messages(user_id):
    conn = get_connection()
    conn.execute('DELETE FROM assistant_messages WHERE user_id = ?', (user_id,))
    conn.commit()
    conn.close()


def save_escalation(user_id, question, assistant_response):
    conn = get_connection()
    cursor = conn.execute('''
        INSERT INTO support_escalations (user_id, question, assistant_response, created_at)
        VALUES (?, ?, ?, ?)
    ''', (user_id, question, assistant_response, datetime.utcnow().isoformat()))
    conn.commit()
    row = conn.execute('SELECT * FROM support_escalations WHERE id = ?', (cursor.lastrowid,)).fetchone()
    conn.close()
    return dict(row)

def get_escalations(user_id=None):
    conn = get_connection()
    if user_id:
        rows = conn.execute('SELECT * FROM support_escalations WHERE user_id = ? ORDER BY id DESC', (user_id,)).fetchall()
    else:
        rows = conn.execute('SELECT * FROM support_escalations ORDER BY id DESC').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_student_analytics(user_id):
    profile = get_profile(user_id) or {}
    progress = get_progress(user_id) or {}
    path = get_learning_path(user_id)
    tasks = get_learning_tasks(user_id)
    attempts = get_quiz_attempts(user_id)
    leaderboard = get_leaderboard()
    rank = next((index + 1 for index, entry in enumerate(leaderboard) if entry['username'] == get_user_by_id(user_id)['username']), None)
    completed_topics = [task['title'] for task in tasks if task['completed']]
    pending_topics = [task['title'] for task in tasks if not task['completed']]
    quiz_score = round(sum((attempt['score'] / attempt['total']) * 100 for attempt in attempts) / len(attempts), 1) if attempts else 0
    return {
        'profile': profile,
        'progress': progress,
        'learning_path': path,
        'completed_topics': completed_topics,
        'pending_topics': pending_topics,
        'quiz_attempts': attempts,
        'quiz_average': quiz_score,
        'quiz_count': len(attempts),
        'leaderboard_rank': rank,
        'leaderboard_total': len(leaderboard),
        'assistant_messages': len(get_assistant_messages(user_id)),
        'escalations': get_escalations(user_id),
    }


def get_admin_users():
    conn = get_connection()
    rows = conn.execute("SELECT id FROM users WHERE role = 'admin' ORDER BY id").fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_messages(user_id, other_user_id):
    conn = get_connection()
    rows = conn.execute('''
        SELECT m.id, m.sender_id, m.recipient_id, m.body, m.created_at,
               sender.username AS sender_username
        FROM messages m
        JOIN users sender ON sender.id = m.sender_id
        WHERE (m.sender_id = ? AND m.recipient_id = ?)
           OR (m.sender_id = ? AND m.recipient_id = ?)
        ORDER BY m.id ASC
    ''', (user_id, other_user_id, other_user_id, user_id)).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def save_message(sender_id, recipient_id, body):
    conn = get_connection()
    cursor = conn.execute(
        'INSERT INTO messages (sender_id, recipient_id, body, created_at) VALUES (?, ?, ?, ?)',
        (sender_id, recipient_id, body, datetime.utcnow().isoformat()),
    )
    conn.commit()
    row = conn.execute('''
        SELECT m.id, m.sender_id, m.recipient_id, m.body, m.created_at,
               sender.username AS sender_username
        FROM messages m JOIN users sender ON sender.id = m.sender_id
        WHERE m.id = ?
    ''', (cursor.lastrowid,)).fetchone()
    conn.close()
    return dict(row)


def delete_user(user_id):
    conn = get_connection()
    conn.execute('DELETE FROM messages WHERE sender_id = ? OR recipient_id = ?', (user_id, user_id))
    conn.commit()
    conn.close()
    conn = get_connection()
    conn.execute('DELETE FROM model_predictions WHERE user_id = ?', (user_id,))
    conn.execute('DELETE FROM learning_paths WHERE user_id = ?', (user_id,))
    conn.execute('DELETE FROM progress WHERE user_id = ?', (user_id,))
    conn.execute('DELETE FROM student_profiles WHERE user_id = ?', (user_id,))
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()


def ensure_admin(username):
    user = get_user_by_username(username)
    if user:
        conn = get_connection()
        conn.execute('INSERT OR IGNORE INTO admins (user_id) VALUES (?)', (user['id'],))
        conn.commit()
        conn.close()


def is_admin(user_id):
    conn = get_connection()
    row = conn.execute('SELECT 1 FROM admins WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    return bool(row)
