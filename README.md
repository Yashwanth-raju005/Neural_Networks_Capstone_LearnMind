# 🧠 LearnMind

> **AI-powered personalized learning platform that creates adaptive learning roadmaps based on a learner's goals, skills, and progress.**

LearnMind is a full-stack learning platform designed to make self-learning more structured and personalized. It combines a **neural network-based recommendation system**, interactive assessments, progress analytics, and an AI assistant to help learners understand **what to learn, when to learn it, and how to improve**.

---

## ✨ Key Features

### 🤖 Personalized Learning Roadmaps

* Generates customized learning paths based on the learner's profile and goals.
* Uses a trained **TensorFlow/Keras Multilayer Perceptron (MLP)** model.
* Model trained on a synthetic dataset containing **10,000 learner profiles**.
* Dynamically recommends relevant topics and learning steps.

### 📊 Learning Dashboard

* Personalized student dashboard.
* Tracks learning progress and completed topics.
* Displays assessment performance and learning analytics.
* User progress is persisted across sessions.

### 📝 Assessments

* Domain-specific quizzes and assessments.
* Tracks individual attempts and scores.
* Provides performance insights based on assessment history.
* Helps identify areas that require improvement.

### 💬 AI Learning Assistant

* Context-aware AI assistant integrated into the platform.
* Helps learners understand concepts and navigate their learning roadmap.
* Designed for interactive, learner-focused conversations.

### 👥 Role-Based Access

* Separate experiences for **Students** and **Admins**.
* Protected authentication using **JWT**.
* Role-based access control for dashboards and platform functionality.

---

## 🏗️ Tech Stack

| Layer                      | Technologies                              |
| -------------------------- | ----------------------------------------- |
| **Frontend**               | React, Vite, Tailwind CSS                 |
| **Backend**                | Python, Flask, REST API                   |
| **Authentication**         | JWT                                       |
| **Machine Learning**       | TensorFlow, Keras, Multilayer Perceptron  |
| **Database / Persistence** | User profiles, progress & assessment data |
| **UI**                     | Tailwind CSS, Responsive Dark Theme       |

---

## 🧠 Machine Learning Pipeline

LearnMind uses a neural network-based recommendation approach to generate personalized learning paths.

```text
Learner Profile
      ↓
Skill & Goal Analysis
      ↓
Feature Processing
      ↓
Neural Network (MLP)
      ↓
Learning Path Prediction
      ↓
Personalized Roadmap
      ↓
Progress & Assessment Feedback
```

The model was trained using a **synthetic dataset of 10,000 learner profiles**, allowing the system to learn relationships between learner characteristics, skills, goals, and suitable learning paths.

---

## 🖥️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      LearnMind      │
                    │   React + Vite UI   │
                    └──────────┬──────────┘
                               │
                         REST API / JWT
                               │
                    ┌──────────▼──────────┐
                    │    Flask Backend    │
                    │    REST Services    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │   Users   │   │  Assess-  │   │    AI     │
        │   & Auth  │   │   ments   │   │ Assistant │
        └───────────┘   └───────────┘   └───────────┘
                               │
                         ┌─────▼─────┐
                         │ ML Model  │
                         │ TensorFlow│
                         │   /Keras  │
                         └───────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js & npm**
* **Python 3.8+**
* **pip**

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd LearnMind
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask backend will start on the configured local port.

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at the local Vite development URL shown in your terminal.

---

## 🔐 Demo Credentials

You can use the following credentials to explore the application.

|          Role          | Username | Password |
| :--------------------: | :------- | :------- |
|     👨‍💼 **Admin**    | `admin1` | `admin1` |
| 🎓 **Student / Guest** | `guest1` | `guest1` |

> **Note:** These credentials are provided only for demonstration purposes.

---

## 📂 Project Structure

```text
LearnMind/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   ├── routes/
│   └── ...
│
├── README.md
└── ...
```

---

## 🎯 Project Objective

Traditional learning platforms often provide the same predefined content to every learner. LearnMind aims to make learning more **personalized and adaptive** by considering individual learner characteristics and progress.

The goal is to provide a platform where learners can:

* Discover what they should learn next.
* Follow a structured learning roadmap.
* Test their understanding through assessments.
* Track their progress.
* Interact with an AI learning assistant.
* Continuously improve their learning journey.

---

## 🔮 Future Improvements

* Real-time adaptation of roadmaps based on assessment performance.
* More advanced recommendation models.
* Integration with external learning resources.
* Topic-specific video and course recommendations.
* Gamification and achievement systems.
* Advanced learner analytics.
* Improved conversational AI capabilities.

---

## 👨‍💻 Author

**Yashwanth Raju S**
Computer Science & Engineering
Amrita Vishwa Vidyapeetham, Chennai

---

⭐ If you find LearnMind interesting, consider giving the repository a star!
