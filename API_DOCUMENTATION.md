# LearnMind API Documentation

## Auth

- POST /register
- POST /login

## Student

- GET /profile
- PUT /profile
- POST /predict
- GET /learning-path
- GET /dashboard
- PUT /progress
- GET /contact/admins
- GET /messages/{admin_id}
- POST /messages/{admin_id}
- GET /quizzes
- GET /quizzes/{quiz_id}
- GET /quiz-attempts
- POST /quiz-attempts
- GET /assistant
- POST /assistant
- DELETE /assistant
- POST /assistant/escalate

## Admin

- POST /train-model
- GET /analytics
- GET /admin/users
- GET /admin/students/{student_id}
- GET /admin/analytics
- GET /messages/{student_id}
- POST /messages/{student_id}
- DELETE /user
