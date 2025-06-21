# AI Requirement Management System

ระบบจัดการข้อกำหนด AI ที่ใช้ FastAPI, React, MongoDB และ OpenAI API

## 🏗️ โครงสร้างโปรเจค

```
AI-Requirement/
├── backend/                 # FastAPI Backend
│   ├── main.py             # Entry point
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   ├── config.py          # Configuration settings
│   ├── auth.py            # JWT Authentication
│   ├── mongo/             # MongoDB connection
│   ├── routes/            # API routes
│   └── services/          # Business logic
├── frontend-ai/           # React Frontend
│   ├── package.json       # Node.js dependencies
│   ├── src/              # Source code
│   └── public/           # Static files
├── nginx/                # Nginx configuration
│   ├── nginx.conf        # Main config
│   └── conf.d/           # Server blocks
├── docker-compose.yml    # Docker services
└── README.md            # This file
```

## 🚀 วิธีการรัน

### วิธีที่ 1: รันด้วย Docker (แนะนำ)

#### Prerequisites
- Docker
- Docker Compose

#### ขั้นตอนการรัน

1. **Clone โปรเจค**
```bash
git clone <repository-url>
cd AI-Requirement
```

2. **สร้างไฟล์ .env สำหรับ backend**
```bash
cd backend
cp .env.example .env
# แก้ไขค่าใน .env ตามต้องการ
```

3. **รันด้วย Docker Compose**
```bash
# รันทั้งหมด
docker-compose up -d

# หรือรันพร้อมดู logs
docker-compose up
```

4. **เข้าถึงแอปพลิเคชัน**
- **Frontend**: http://localhost
- **API Docs**: http://localhost/docs
- **Health Check**: http://localhost/health

#### คำสั่ง Docker ที่มีประโยชน์

---

### วิธีที่ 2: รันแบบปกติ (Development)

#### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- npm หรือ yarn

#### Backend Setup

1. **สร้าง Virtual Environment**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

2. **ติดตั้ง Dependencies**
```bash
pip install -r requirements.txt
```

3. **ตั้งค่า Environment Variables**
```bash
cp .env.example .env
# แก้ไขค่าใน .env
```

4. **รัน Backend**
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup

1. **ติดตั้ง Dependencies**
```bash
cd frontend-ai
npm install
# หรือ
yarn install
```

2. **รัน Frontend**
```bash
npm start
# หรือ
yarn start
```

#### MongoDB Setup

1. **ติดตั้ง MongoDB**
```bash
# macOS (Homebrew)
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# หรือใช้ Docker
docker run -d -p 27017:27017 --name mongo mongo:6.0
```

2. **รัน MongoDB**
```bash
# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

---

## 🔧 การตั้งค่า

### Environment Variables (backend/.env)

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=myapp

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Environment
ENVIRONMENT=development

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
```

### Frontend Configuration

แก้ไขไฟล์ `frontend-ai/src/config.js` หรือ environment variables:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - ลงทะเบียน
- `POST /api/v1/auth/login` - เข้าสู่ระบบ
- `POST /api/v1/auth/refresh` - รีเฟรช token

### AI Services
- `POST /api/v1/ai/chat` - ส่งข้อความไปยัง AI
- `GET /api/v1/ai/historyConversation` - ประวัติการสนทนา
- `POST /api/v1/ai/upload` - อัปโหลดไฟล์ PDF

### User Management
- `GET /api/v1/users/me` - ข้อมูลผู้ใช้ปัจจุบัน
- `PUT /api/v1/users/me` - อัปเดตข้อมูลผู้ใช้

### Health Check
- `GET /health` - สถานะระบบ
- `GET /docs` - API Documentation (Swagger)

---
**Happy Coding! 🎉**
