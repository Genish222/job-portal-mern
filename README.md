# 💼 Online Job Portal — MERN Stack

> Developed as part of an **ETHNUS CONSULTANCY SERVICES PRIVATE LIMITED** assignment  
> Live Demo: 

---

## 📌 Project Overview

A full-stack job portal platform built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) that connects **Job Seekers** with **Recruiters**.

---

## 🚀 Features

### Job Seekers
- Register/Login with JWT authentication
- Browse & search job listings with filters
- Apply to jobs with a cover letter
- Track application status in real-time (Pending → Reviewed → Shortlisted → Interviewed → Offered)
- Visual application progress tracker
- Manage profile with skills, experience, education

### Recruiters
- Register company account
- Post, edit, and delete job listings
- Dashboard with job/applicant statistics
- View all applicants per job
- Update application status (Pending / Reviewed / Shortlisted / Interviewed / Offered / Rejected)
- Manage company profile

### General
- Responsive design (mobile-friendly)
- Job search with text search
- Filter by category, job type, experience level, location
- Pagination for job listings
- Job views counter

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React.js, React Router v6, Axios  |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB, Mongoose ODM             |
| Auth        | JWT (JSON Web Tokens), bcryptjs   |
| Styling     | Custom CSS with CSS Variables     |
| Notifications | React Toastify                  |
| Deployment  | Vercel (Frontend), Render/Railway (Backend) |

---

## 📂 Project Structure

```
job-portal/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (jobseeker/recruiter)
│   │   ├── Job.js           # Job listing schema
│   │   └── Application.js   # Job application schema
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Me
│   │   ├── jobs.js          # CRUD for jobs
│   │   ├── applications.js  # Apply, track, manage
│   │   └── users.js         # Profile management
│   ├── middleware/
│   │   └── auth.js          # JWT protect & role authorization
│   ├── .env.example         # Environment variables template
│   └── server.js            # Express app entry point
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js   # Global auth state
        ├── pages/
        │   ├── Home.js          # Landing page with search
        │   ├── Login.js         # Login form
        │   ├── Register.js      # Register with role toggle
        │   ├── Jobs.js          # Job listings with filters
        │   ├── JobDetail.js     # Single job + apply form
        │   ├── Dashboard.js     # Recruiter dashboard
        │   ├── PostJob.js       # Create/edit job form
        │   ├── MyApplications.js # Job seeker applications tracker
        │   ├── Profile.js       # User profile editor
        │   └── NotFound.js      # 404 page
        ├── components/
        │   ├── Navbar.js
        │   └── Footer.js
        ├── App.js               # Routes & protected routes
        └── index.css            # Global styles
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd job-portal
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm run dev   # Starts on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start     # Starts on port 3000
```

### 4. Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000
```

> For **MongoDB Atlas**, replace MONGO_URI with your Atlas connection string.

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint              | Description          | Access  |
|--------|-----------------------|----------------------|---------|
| POST   | /api/auth/register    | Register new user    | Public  |
| POST   | /api/auth/login       | Login user           | Public  |
| GET    | /api/auth/me          | Get current user     | Private |

### Jobs
| Method | Endpoint                    | Description           | Access           |
|--------|-----------------------------|-----------------------|------------------|
| GET    | /api/jobs                   | Get all jobs          | Public           |
| GET    | /api/jobs/:id               | Get single job        | Public           |
| POST   | /api/jobs                   | Post a new job        | Recruiter only   |
| PUT    | /api/jobs/:id               | Update job            | Recruiter (own)  |
| DELETE | /api/jobs/:id               | Delete job            | Recruiter (own)  |
| GET    | /api/jobs/recruiter/myjobs  | Get recruiter's jobs  | Recruiter only   |

### Applications
| Method | Endpoint                        | Description                | Access           |
|--------|---------------------------------|----------------------------|------------------|
| POST   | /api/applications/:jobId        | Apply to a job             | Job Seeker only  |
| GET    | /api/applications/my/all        | Get my applications        | Job Seeker only  |
| GET    | /api/applications/job/:jobId    | Get job's applications     | Recruiter only   |
| PUT    | /api/applications/:id/status    | Update status              | Recruiter only   |
| DELETE | /api/applications/:id           | Withdraw application       | Job Seeker only  |

### Users
| Method | Endpoint                  | Description          | Access  |
|--------|---------------------------|----------------------|---------|
| GET    | /api/users/profile        | Get profile          | Private |
| PUT    | /api/users/profile        | Update profile       | Private |
| PUT    | /api/users/change-password| Change password      | Private |

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push frontend folder to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL=<your-backend-url>`

### Backend (Render / Railway)
1. Push backend folder to GitHub
2. Create a new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`

---

## 👨‍💻 Author

Built with ❤️ as part of **Ethnus Consultancy Services Private Limited** Full-Stack Development program.

---

## 📄 License

MIT License — free to use and modify.
