# EduUz — Personal Growth Mobile Web App

A Progressive Web App (PWA) for personal development in Uzbekistan, built by ApexBart Solutions.

## Overview

EduUz helps users build positive habits, take self-assessments, and access curated knowledge in Uzbek and English. Features a simple, accessible button-based interface.

## Key Features

- **Daily Challenges:** Customizable daily tasks with streak tracking
- **Self-Assessment:** Quick diagnostic tests with actionable insights
- **Knowledge Hub:** Curated books, articles, and translations
- **Student Articles:** Peer-to-peer content sharing and reviews
- **Bilingual:** Full Uzbek and English support
- **Admin Panel:** Content and user management

## Quick Start

Prerequisites: Node.js 18+, Python 3.11+, Docker, Docker Compose

```bash
# Clone and setup
git clone <your-repo-url>
cd <your-repo>/ops/docker
cp .env.example .env

# Start services
docker compose up --build

# Setup database
docker compose exec api alembic upgrade head
docker compose exec api python -m app.seed_demo

# Access
Web: http://localhost:3000
API: http://localhost:8000
```

Demo Account:
- Email: `zebo@apexbart.com`
- Password: `zebo123`

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, PostgreSQL, Redis
- **Infrastructure:** Docker, S3-compatible storage
- **Testing:** Jest, Pytest, GitHub Actions

## Project Structure

```txt
.
├─ apps/
│  ├─ web/     # React PWA
│  └─ api/     # FastAPI backend
├─ packages/   # Shared components
├─ ops/        # Docker & deployment
└─ i18n/       # Translations
```

## Environment Setup

Key variables needed (see `.env.example` for full list):

```env
# API
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/eduuz
REDIS_URL=redis://redis:6379/0
JWT_SECRET=<change-in-prod>
CORS_ORIGINS=http://localhost:3000

# Web
VITE_API_BASE_URL=http://localhost:8000
VITE_DEFAULT_LOCALE=uz
```

## Development Scripts

```bash
# Web (apps/web)
npm install
npm run dev

# API (apps/api)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Security & Privacy

- JWT authentication with refresh tokens
- Role-based access control
- Data encryption and secure file storage
- Regular security audits

## Roadmap

1. **Q4 2025:** Enhanced admin tools & notifications
2. **Q1 2026:** AI-powered recommendations
3. **Q2 2026:** Offline support & gamification
4. **Q3 2026:** Performance optimization & localization

## Contributing

1. Fork & create feature branch
2. Add tests for new features
3. Submit PR with clear description
4. Follow code style guidelines

## License & Contact

Proprietary © ApexBart Solutions. All rights reserved.

**ApexBart Solutions**  
[www.apexbart.com](https://www.apexbart.com)  
[hello@apexbart.com](mailto:hello@apexbart.com)
