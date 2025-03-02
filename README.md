# 🏥 Medical Appointment System API

This is a **Node.js & Express** REST API for managing medical appointments, user authentication, and chatbot interactions.

---

## 🚀 Features

- **User Authentication** (Register/Login using JWT)
- **Manage Appointments** (Schedule, View, Cancel)
- **AI Chatbot Integration** (Send messages & Get chat history)
- **MongoDB Database** for data storage

---

## 📌 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **AI Chatbot**: OpenAI API

---

## ⚙️ Installation & Setup

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/Firas-amaria/FullStack-finalProject
```

### 2️⃣ **Install Dependencies**

```bash
npm install
```

### 3️⃣ **Create `.env` File**

Create a `.env` file inside the `backend/` folder with the following:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/medical_appointment_system
JWT_SECRET=<your-secret-key>
DEEPSEEK_API_KEY=<your-openai-key>
```

note: the key for the api is needed for the chat ai to work properly

### 4️⃣ **Start the Server**

```bash
FullStack-finalProject> npm run start

```

---

## 💂🏻‍♂️ API Endpoints

### 🿢 **User Authentication (`/api/users`)**

| Method | Endpoint          | Description                | Authentication |
| ------ | ----------------- | -------------------------- | -------------- |
| `POST` | `/users/register` | Register a new user        | ❌ No          |
| `POST` | `/users/login`    | Login user & get JWT token | ❌ No          |
| `GET`  | `/users/me`       | Get logged-in user profile | ✅ Yes         |

---

### 🿢 **Appointments (`/api/appointments`)**

| Method | Endpoint                   | Description                   | Authentication |
| ------ | -------------------------- | ----------------------------- | -------------- |
| `POST` | `/appointments/schedule`   | Schedule a new appointment    | ✅ Yes         |
| `GET`  | `/appointments`            | Get all appointments for user | ✅ Yes         |
| `PUT`  | `/appointments/cancel/:id` | Cancel an appointment         | ✅ Yes         |

---

### 🿢 **Chatbot (`/api/chatbot`)**

| Method | Endpoint           | Description                      | Authentication |
| ------ | ------------------ | -------------------------------- | -------------- |
| `POST` | `/chatbot/send`    | Send a message to the AI chatbot | ✅ Yes         |
| `GET`  | `/chatbot/history` | Get user's chat history          | ✅ Yes         |

---

## 🔧 **Project Structure**

```
medical-appointment-system/
│─ backend/
│   │─ src/
│   │   │─ config/              # Configuration files
│   │   │   ─ config.js        # Environment & Database setup
│   │   │
│   │   │─ middleware/          # Authentication
│   │   │   ─ AuthMiddleware.js
│   │   │
│   │   │─ models/              # Database models
│   │   │   ─ User.js
│   │   │   ─ Appointment.js
│   │   │   ─ ChatLog.js
│   │   │
│   │   │─ routes/              # API endpoints
│   │   │   ─ UserRoutes.js
│   │   │   ─ AppointmentRoutes.js
│   │   │   ─ ChatbotRoutes.js
│   │   │   ─ DoctorRoutes.js
│   │   │   ─ adminRoutes.js
│   │   │─ .env
│   │   ─ app.js            # Express app & server setup
│                        # Environment variables
│─ package.json                 # NPM dependencies
│─ README.md                    # Project documentation
```
