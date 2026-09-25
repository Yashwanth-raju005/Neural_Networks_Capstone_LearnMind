import json
import os
import pickle
import random
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
import keras
from keras import layers
from keras import models
from services.learning_content import build_topic_checklist

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / 'dataset' / 'synthetic_students.csv'
MODEL_DIR = BASE_DIR / 'saved_model'
MODEL_PATH = MODEL_DIR / 'learnmind_model.keras'
METADATA_PATH = MODEL_DIR / 'metadata.pkl'

FEATURE_COLUMNS = [
    'interest',
    'current_skill',
    'career_goal',
    'learning_style',
    'available_hours',
    'previous_score',
    'completed_subjects',
    'current_knowledge',
]


def generate_synthetic_dataset(rows=10000):
    interests = ['AI', 'Cybersecurity', 'Web Development', 'Data Science', 'Cloud', 'Robotics', 'Game Development', 'Product Design', 'Mobile Apps', 'Blockchain']
    skills = ['Beginner', 'Intermediate', 'Advanced']
    learning_styles = ['Visual', 'Auditory', 'Reading', 'Hands-On']
    careers = ['Data Scientist', 'Frontend Engineer', 'Backend Engineer', 'AI Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 'Product Manager']
    sequence_choices = ['Foundations', 'Project-Driven', 'Specialization', 'Capstone', 'Mentored Practice']
    resource_choices = ['Books', 'YouTube', 'Documentation', 'Projects', 'Practice Problems']
    difficulty_choices = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    speed_choices = ['Slow', 'Steady', 'Fast', 'Very Fast']

    records = []
    for _ in range(rows):
        interest = random.choice(interests)
        current_skill = random.choice(skills)
        learning_style = random.choice(learning_styles)
        career_goal = random.choice(careers)
        available_hours = random.randint(5, 25)
        previous_score = random.randint(45, 98)
        completed_subjects = random.randint(0, 12)
        current_knowledge = random.randint(1, 5)

        if current_skill == 'Beginner':
            difficulty = 'Beginner'
            speed = 'Steady'
        elif current_skill == 'Intermediate':
            difficulty = 'Intermediate'
            speed = 'Fast'
        else:
            difficulty = 'Advanced'
            speed = 'Very Fast'

        if career_goal == 'AI Engineer':
            sequence = 'Specialization'
            resource = 'Projects'
        elif career_goal == 'Frontend Engineer':
            sequence = 'Project-Driven'
            resource = 'YouTube'
        elif career_goal == 'Cybersecurity Analyst':
            sequence = 'Capstone'
            resource = 'Documentation'
        elif career_goal == 'Data Scientist':
            sequence = 'Foundations'
            resource = 'Practice Problems'
        else:
            sequence = 'Mentored Practice'
            resource = 'Books'

        if previous_score > 80 and current_knowledge > 3:
            difficulty = 'Intermediate' if difficulty == 'Beginner' else difficulty
        if available_hours > 15 and learning_style == 'Hands-On':
            speed = 'Fast'

        hours_target = round(min(6.0, max(1.0, 1.2 + available_hours / 10 + (previous_score - 70) / 100)), 1)

        records.append({
            'interest': interest,
            'current_skill': current_skill,
            'career_goal': career_goal,
            'learning_style': learning_style,
            'available_hours': available_hours,
            'previous_score': previous_score,
            'completed_subjects': completed_subjects,
            'current_knowledge': current_knowledge,
            'sequence': sequence,
            'difficulty': difficulty,
            'resource': resource,
            'learning_speed': speed,
            'daily_hours': hours_target,
        })

    df = pd.DataFrame(records)
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATASET_PATH, index=False)
    return df


def ensure_dataset_exists():
    if not DATASET_PATH.exists():
        generate_synthetic_dataset()


def build_model():
    ensure_dataset_exists()
    df = pd.read_csv(DATASET_PATH)
    X = pd.get_dummies(df[FEATURE_COLUMNS], drop_first=False)
    X = X.astype(float)

    label_mappings = {}
    y_sequences = df['sequence']
    y_difficulty = df['difficulty']
    y_resources = df['resource']
    y_speed = df['learning_speed']
    y_hours = df['daily_hours'].astype(float)

    sequence_encoder = {value: idx for idx, value in enumerate(sorted(pd.unique(y_sequences)))}
    difficulty_encoder = {value: idx for idx, value in enumerate(sorted(pd.unique(y_difficulty)))}
    resource_encoder = {value: idx for idx, value in enumerate(sorted(pd.unique(y_resources)))}
    speed_encoder = {value: idx for idx, value in enumerate(sorted(pd.unique(y_speed)))}

    label_mappings['sequence'] = sequence_encoder
    label_mappings['difficulty'] = difficulty_encoder
    label_mappings['resource'] = resource_encoder
    label_mappings['learning_speed'] = speed_encoder

    y_seq = y_sequences.map(sequence_encoder).astype(int)
    y_diff = y_difficulty.map(difficulty_encoder).astype(int)
    y_res = y_resources.map(resource_encoder).astype(int)
    y_speed = y_speed.map(speed_encoder).astype(int)

    X_train, X_test, y_seq_train, y_seq_test, y_diff_train, y_diff_test, y_res_train, y_res_test, y_speed_train, y_speed_test, y_hours_train, y_hours_test = train_test_split(
        X,
        y_seq,
        y_diff,
        y_res,
        y_speed,
        y_hours,
        test_size=0.2,
        random_state=42,
    )

    input_layer = layers.Input(shape=(X_train.shape[1],))
    x = layers.Dense(128, activation='relu')(input_layer)
    x = layers.Dropout(0.2)(x)
    x = layers.Dense(64, activation='relu')(x)
    x = layers.Dense(32, activation='relu')(x)

    seq_output = layers.Dense(len(sequence_encoder), activation='softmax', name='sequence_output')(x)
    diff_output = layers.Dense(len(difficulty_encoder), activation='softmax', name='difficulty_output')(x)
    resource_output = layers.Dense(len(resource_encoder), activation='softmax', name='resource_output')(x)
    speed_output = layers.Dense(len(speed_encoder), activation='softmax', name='learning_speed_output')(x)
    hours_output = layers.Dense(1, activation='linear', name='hours_output')(x)

    model = models.Model(inputs=input_layer, outputs=[seq_output, diff_output, resource_output, speed_output, hours_output])
    model.compile(
        optimizer='adam',
        loss=[
            'sparse_categorical_crossentropy',
            'sparse_categorical_crossentropy',
            'sparse_categorical_crossentropy',
            'sparse_categorical_crossentropy',
            'mse',
        ],
        metrics=[['accuracy'], ['accuracy'], ['accuracy'], ['accuracy'], ['mae']],
    )

    history = model.fit(
        X_train,
        [y_seq_train, y_diff_train, y_res_train, y_speed_train, y_hours_train],
        validation_split=0.2,
        epochs=12,
        batch_size=64,
        verbose=0,
        callbacks=[tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)],
    )

    test_predictions = model.predict(X_test, verbose=0)
    seq_pred = np.argmax(test_predictions[0], axis=1)
    diff_pred = np.argmax(test_predictions[1], axis=1)
    res_pred = np.argmax(test_predictions[2], axis=1)
    speed_pred = np.argmax(test_predictions[3], axis=1)

    accuracy = round(float((accuracy_score(y_seq_test, seq_pred) + accuracy_score(y_diff_test, diff_pred) + accuracy_score(y_res_test, res_pred) + accuracy_score(y_speed_test, speed_pred)) / 4), 4)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model.save(MODEL_PATH)
    with METADATA_PATH.open('wb') as handle:
        pickle.dump({'feature_columns': list(X.columns), 'label_mappings': label_mappings, 'history': history.history}, handle)

    return {
        'accuracy': accuracy,
        'history': history.history,
    }


def load_model_artifacts():
    if not MODEL_PATH.exists() or not METADATA_PATH.exists():
        return None, None

    with METADATA_PATH.open('rb') as handle:
        metadata = pickle.load(handle)

    try:
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        return model, metadata
    except Exception:
        try:
            if MODEL_PATH.exists():
                MODEL_PATH.unlink()
            if METADATA_PATH.exists():
                METADATA_PATH.unlink()
        except OSError:
            pass
        train_and_save_model()
        return load_model_artifacts()


def _build_resource_library_map():
    return {
        'Artificial Intelligence': {
            'documentation': 'https://ai.google/',
            'video': 'https://www.youtube.com/@DeepLearningAI',
        },
        'Machine Learning': {
            'documentation': 'https://scikit-learn.org/stable/documentation.html',
            'video': 'https://www.youtube.com/@statquest',
        },
        'Python': {
            'documentation': 'https://docs.python.org/3/',
            'video': 'https://www.youtube.com/@coreyms',
        },
        'Web Development': {
            'documentation': 'https://developer.mozilla.org/en-US/',
            'video': 'https://www.youtube.com/@TraversyMedia',
        },
        'Data Science': {
            'documentation': 'https://www.kaggle.com/learn',
            'video': 'https://www.youtube.com/@kaggle',
        },
        'Frontend Development': {
            'documentation': 'https://react.dev/learn',
            'video': 'https://www.youtube.com/@freecodecamp',
        },
        'Backend Development': {
            'documentation': 'https://flask.palletsprojects.com/',
            'video': 'https://www.youtube.com/@TraversyMedia',
        },
        'Full Stack Development': {
            'documentation': 'https://fullstackopen.com/',
            'video': 'https://www.youtube.com/@javascriptmastery',
        },
        'Cybersecurity': {
            'documentation': 'https://owasp.org/',
            'video': 'https://www.youtube.com/@_johnhammond',
        },
        'Cloud Computing': {
            'documentation': 'https://explore.skillbuilder.aws/',
            'video': 'https://www.youtube.com/@AWSTrainingandCertification',
        },
        'DevOps': {
            'documentation': 'https://docs.docker.com/',
            'video': 'https://www.youtube.com/@TechWorldwithNana',
        },
        'UI/UX Design': {
            'documentation': 'https://www.nngroup.com/',
            'video': 'https://www.youtube.com/@FluxAcademy',
        },
        'Product Management': {
            'documentation': 'https://www.atlassian.com/agile',
            'video': 'https://www.youtube.com/@ProductSchool',
        },
        'Digital Marketing': {
            'documentation': 'https://academy.hubspot.com/',
            'video': 'https://www.youtube.com/@Ahrefs',
        },
        'Finance': {
            'documentation': 'https://www.investopedia.com/',
            'video': 'https://www.youtube.com/@WallStreetPrep',
        },
        'Business Analytics': {
            'documentation': 'https://www.tableau.com/learn',
            'video': 'https://www.youtube.com/@alextheanalyst',
        },
        'Blockchain': {
            'documentation': 'https://ethereum.org/en/developers/docs/',
            'video': 'https://www.youtube.com/@PatrickAlphaC',
        },
        'Game Development': {
            'documentation': 'https://learn.unity.com/',
            'video': 'https://www.youtube.com/@Brackeys',
        },
        'Robotics': {
            'documentation': 'https://wiki.ros.org/',
            'video': 'https://www.youtube.com/@TheConstructAI',
        },
        'Natural Language Processing': {
            'documentation': 'https://huggingface.co/docs',
            'video': 'https://www.youtube.com/@huggingface',
        },
        'Computer Vision': {
            'documentation': 'https://docs.opencv.org/',
            'video': 'https://www.youtube.com/@OpenCV',
        },
        'Database Systems': {
            'documentation': 'https://www.postgresql.org/docs/',
            'video': 'https://www.youtube.com/@dataschool',
        },
        'Statistics': {
            'documentation': 'https://www.khanacademy.org/math/statistics-probability',
            'video': 'https://www.youtube.com/@statquest',
        },
        'Mobile Development': {
            'documentation': 'https://docs.flutter.dev/',
            'video': 'https://www.youtube.com/@FlutterTeacher',
        },
        'Data Engineering': {
            'documentation': 'https://airflow.apache.org/docs/',
            'video': 'https://www.youtube.com/@ByteByteGo',
        },
        'Prompt Engineering': {
            'documentation': 'https://platform.openai.com/docs/guides/prompt-engineering',
            'video': 'https://www.youtube.com/results?search_query=prompt+engineering+tutorial',
        },
        'Research & Writing': {
            'documentation': 'https://scholar.google.com/',
            'video': 'https://www.youtube.com/results?search_query=research+methods+tutorial',
        },
        'Testing & QA': {
            'documentation': 'https://www.selenium.dev/documentation/',
            'video': 'https://www.youtube.com/@AutomationStepbyStep',
        },
    }


def _resolve_domain_resource(interest, career_goal):
    resource_map = _build_resource_library_map()
    normalized_interest = str(interest or '').strip().lower()
    normalized_career = str(career_goal or '').strip().lower()

    direct_keys = [
        interest,
        career_goal,
        'Artificial Intelligence' if 'ai' in normalized_interest or 'ai engineer' in normalized_career else None,
        'Machine Learning' if 'machine learning' in normalized_interest or 'machine learning engineer' in normalized_career else None,
        'UI/UX Design' if 'ui/ux' in normalized_interest or 'ux' in normalized_interest or 'ui' in normalized_interest or 'ui/ux designer' in normalized_career else None,
        'Data Science' if 'data science' in normalized_interest or 'data scientist' in normalized_career else None,
        'Python' if 'python' in normalized_interest or 'python developer' in normalized_career else None,
        'Web Development' if 'web development' in normalized_interest or 'frontend' in normalized_interest or 'frontend developer' in normalized_career or 'backend developer' in normalized_career else None,
        'Frontend Development' if 'frontend' in normalized_interest or 'frontend developer' in normalized_career else None,
        'Backend Development' if 'backend' in normalized_interest or 'backend developer' in normalized_career else None,
        'Full Stack Development' if 'full stack' in normalized_interest or 'full stack developer' in normalized_career else None,
        'Cybersecurity' if 'cybersecurity' in normalized_interest or 'cybersecurity analyst' in normalized_career else None,
        'Cloud Computing' if 'cloud' in normalized_interest or 'cloud engineer' in normalized_career else None,
        'DevOps' if 'devops' in normalized_interest else None,
        'Product Management' if 'product manager' in normalized_career or 'product management' in normalized_interest else None,
        'Digital Marketing' if 'marketing' in normalized_interest or 'digital marketer' in normalized_career else None,
        'Finance' if 'finance' in normalized_interest or 'financial analyst' in normalized_career else None,
        'Business Analytics' if 'business analytics' in normalized_interest or 'business analyst' in normalized_career else None,
        'Blockchain' if 'blockchain' in normalized_interest else None,
        'Game Development' if 'game' in normalized_interest else None,
        'Robotics' if 'robotics' in normalized_interest else None,
        'Natural Language Processing' if 'natural language' in normalized_interest or 'nlp' in normalized_interest else None,
        'Computer Vision' if 'computer vision' in normalized_interest or 'vision' in normalized_interest else None,
        'Database Systems' if 'database' in normalized_interest else None,
        'Statistics' if 'statistics' in normalized_interest else None,
        'Mobile Development' if 'mobile' in normalized_interest else None,
        'Data Engineering' if 'data engineering' in normalized_interest else None,
        'Prompt Engineering' if 'prompt' in normalized_interest else None,
        'Research & Writing' if 'research' in normalized_interest or 'writing' in normalized_interest else None,
        'Testing & QA' if 'testing' in normalized_interest or 'qa' in normalized_interest else None,
    ]

    for key in direct_keys:
        if key in resource_map:
            return resource_map[key]

    return resource_map['Artificial Intelligence']


def _build_unique_task_checklist(interest, career_goal, selected_resource, resource_focus='Both'):
    return build_topic_checklist(interest, career_goal, resource_focus)


def predict_learning_profile(features):
    model, metadata = load_model_artifacts()
    if model is None:
        train_and_save_model()
        model, metadata = load_model_artifacts()

    df = pd.DataFrame([features])
    df = pd.get_dummies(df, columns=FEATURE_COLUMNS, drop_first=False)
    feature_columns = metadata['feature_columns']
    df = df.reindex(columns=feature_columns, fill_value=0.0)
    predictions = model.predict(df, verbose=0)

    label_mappings = metadata['label_mappings']
    inverse_map = {name: {idx: value for value, idx in mapping.items()} for name, mapping in label_mappings.items()}

    sequence = inverse_map['sequence'][int(np.argmax(predictions[0][0]))]
    difficulty = inverse_map['difficulty'][int(np.argmax(predictions[1][0]))]
    resource = inverse_map['resource'][int(np.argmax(predictions[2][0]))]
    learning_speed = inverse_map['learning_speed'][int(np.argmax(predictions[3][0]))]
    daily_hours = round(float(predictions[4][0][0]), 1)

    confidence = round(float((np.max(predictions[0][0]) + np.max(predictions[1][0]) + np.max(predictions[2][0]) + np.max(predictions[3][0])) / 4), 3)

    interest = (features.get('interest') or 'your topic').strip() or 'your topic'
    current_skill = (features.get('current_skill') or 'beginner').strip() or 'beginner'
    career_goal = (features.get('career_goal') or 'career growth').strip() or 'career growth'
    learning_style = (features.get('learning_style') or 'guided practice').strip() or 'guided practice'
    available_hours = max(1, int(features.get('available_hours', 10) or 10))
    current_knowledge = max(1, int(features.get('current_knowledge', 3) or 3))
    timeline_weeks = max(4, min(24, int(available_hours * 2 + current_knowledge * 3)))

    roadmap = [
        f'Stage 1 — Foundation: start from zero and learn the core concepts of {interest}, terminology, and beginner workflows.',
        f'Stage 2 — Practice: use a {learning_style.lower()} routine, solve targeted exercises, and reinforce your {current_skill.lower()} skills every day.',
        f'Stage 3 — Portfolio: apply what you learn by building one project aligned to {career_goal} and documenting your progress.',
        f'Stage 4 — Depth: move from guided practice into advanced drills, mini-challenges, and real-world problem solving.',
        f'Stage 5 — Expert Execution: fine-tune your system, review weak areas, and prepare a polished portfolio that proves you can work independently.',
    ]
    study_plan = [
        f'Week 1-2: build strong fundamentals in {interest} and create a personal concept map.',
        f'Week 3-4: complete small assignments and test your understanding with short recap quizzes.',
        f'Week 5-6: work on a mini-project tied to {career_goal} and review every mistake you make.',
        f'Week 7-{timeline_weeks}: sharpen the final skill stack, build the portfolio, and publish one complete artifact.',
    ]
    daily_tasks = [
        f'Complete {max(30, daily_hours * 60)} minutes of focused learning in {interest}.',
        'Review the last concept and write down 3 takeaways in plain language.',
        'Solve one practice question or coding challenge before stopping.',
        'Spend 15 minutes updating your personal notes or project checklist.',
    ]
    weekly_tasks = [
        'Finish one milestone module or concept bundle.',
        'Review performance, weak topics, and mistakes from the week.',
        'Submit one mini-project artifact or notebook summary.',
        'Measure progress against your chosen career goal and reset your next milestone.',
    ]
    resources = {
        'books': [f'{interest} Foundations Guide', 'Hands-On Learning Companion'],
        'youtube': [f'{interest} Essentials Playlist', 'Practical Project Walkthrough'],
        'documentation': [f'{interest} Official Docs', 'Structured Learning Notes'],
        'projects': [f'Build a portfolio project for {career_goal}', 'Create a capstone challenge and publish it'],
        'practice': ['Weekly challenge set', 'Concept recap quiz generator'],
    }

    selected_resource = _resolve_domain_resource(interest, career_goal)
    task_checklist = _build_unique_task_checklist(interest, career_goal, selected_resource, features.get('resource_focus', 'Both'))

    return {
        'sequence': sequence,
        'difficulty': difficulty,
        'resource': resource,
        'learning_speed': learning_speed,
        'daily_hours': daily_hours,
        'confidence': confidence,
        'roadmap': roadmap,
        'study_plan': study_plan,
        'daily_tasks': daily_tasks,
        'weekly_tasks': weekly_tasks,
        'resources': resources,
        'task_checklist': task_checklist,
    }


def train_and_save_model():
    return build_model()
