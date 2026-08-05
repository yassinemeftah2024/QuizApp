# 🎯 QuizApp — Interactive QCM Platform

A **Kahoot!-inspired** interactive quiz platform for educational institutions, enabling teachers to create MCQ quizzes, organize real-time sessions, and track student performance.

## 🏗️ Architecture

| Component | Technology | Port |
|-----------|-----------|------|
| **Backend** | Spring Boot 3.4 + Java 17 | `8080` |
| **Frontend** | React 18 + Vite + TypeScript | `5173` (dev) / `3000` (docker) |
| **Database** | PostgreSQL 16 | `5432` |
| **Real-time** | WebSocket + STOMP | via backend |

## 👥 User Roles

- **Administrateur** — Manage users, classes, subjects, global statistics
- **Enseignant** — Create/manage QCMs, launch live sessions, export results
- **Étudiant** — Join quizzes, answer questions, view scores & rankings
- **Invité** — Join via PIN/QR code with a pseudonym (no account required)

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

### Run with Docker Compose
```bash
docker-compose up --build
```

## 📁 Project Structure
```
QuizApp/
├── backend/          # Backend application folder
├── frontend/         # Frontend web application folder
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔀 Branch Strategy
| Branch | Purpose |
|--------|---------|
| `main` | Production / Stable merged code |
| `dev-a` | Teammate A development branch |
| `dev-b` | Teammate B development branch |

## 👨‍💻 Team
- Team of 2 developers
