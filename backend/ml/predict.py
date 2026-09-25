from services.ml_service import predict_learning_profile

if __name__ == '__main__':
    sample = {
        'interest': 'AI',
        'current_skill': 'Intermediate',
        'career_goal': 'AI Engineer',
        'learning_style': 'Hands-On',
        'available_hours': 14,
        'previous_score': 82,
        'completed_subjects': 5,
        'current_knowledge': 4,
    }
    print(predict_learning_profile(sample))
