# SAT-SA Complete Full-Stack Project

SAT-SA (Supervisory Analytics Tool for SOC Assessment) full-stack starter based on the supplied technical specification.

# SAT-SA

Supervisory Analytics Tool for SOC Assessment.

## Live Demo

[View Live Project](https://sat-sa-project.vercel.app)

## Features

- Supervisory analytics
- Execution gap detection
- Negative space detection
- Anomaly and NLP analysis
- Python-based analysis pipeline
- React + Node.js + MongoDB architecture



## Stack
- Frontend: React + Vite + React Router + Recharts
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Analytics: Python 3.10+ bridge with a local SAT-SA engine

## Run
### Backend
cd backend
npm install
copy .env.example .env
npm run dev

### Frontend
cd frontend
npm install
npm run dev

### Python engine
python python-engine/run_pipeline.py python-engine/sample_data

The Node API can also execute the Python pipeline through POST /api/analysis/run.

This project is designed for local/offline development. External cloud services are not required for the demo.


# SAT-SA
### Supervisory Analytics Tool for SOC Assessment

<p align="center">
  <img src="assets/sat-sa-overview.png" alt="SAT-SA Project Overview" width="100%">
</p>

