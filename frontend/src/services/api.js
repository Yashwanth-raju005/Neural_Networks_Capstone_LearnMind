import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => api.post("/login", data);
export const registerUser = (data) => api.post("/register", data);
export const getProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);
export const getDashboard = () => api.get("/dashboard");
export const getAnalytics = () => api.get("/analytics");
export const generatePath = (data) => api.post("/predict", data);
export const getLearningPath = () => api.get("/learning-path");
export const getLearningTasks = () => api.get("/learning-tasks");
export const toggleLearningTask = (taskId, completed) =>
  api.put("/learning-tasks", { task_id: taskId, completed });
export const updateProgress = (data) => api.put("/progress", data);
export const getQuizzes = () => api.get("/quizzes");
export const getQuiz = (id) => api.get(`/quizzes/${id}`);
export const submitQuiz = (data) => api.post("/quiz-attempts", data);
export const getQuizAttempts = () => api.get("/quiz-attempts");
export const getAssistantMessages = () => api.get("/assistant");
export const sendAssistantMessage = (message, topic) => api.post("/assistant", { message, topic });
export const clearAssistantMessages = () => api.delete("/assistant");
export const escalateAssistantQuestion = (data) => api.post("/assistant/escalate", data);
export const trainModel = () => api.post("/train-model");
export const getAdminUsers = () => api.get("/admin/users");
export const getAdminAnalytics = () => api.get("/admin/analytics");
export const getAdminStudent = (id) => api.get(`/admin/students/${id}`);
export const getMessages = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (userId, message) =>
  api.post(`/messages/${userId}`, { message });
export const getAdminContacts = () => api.get("/contact/admins");
export const deleteUser = (id) =>
  api.delete("/user", { data: { user_id: id } });

export default api;
