# 💻 Dev Tinder

⚠️ **Note:** This project is currently **under development**.  
Some features and code are incomplete. Active work is ongoing 🚧.  

---

## 🌟 Overview

**Dev Tinder** is a networking platform for developers to connect, chat, and collaborate based on skills and project needs.  

It focuses on building a **developer-first community**, providing features like profile management, real-time chat, and job postings.

---

## 🛠️ Tech Stack

| Layer         | Technology |
|---------------|------------|
| Frontend      | React.js |
| Backend       | Node.js, Express.js |
| Database      | MongoDB |
| Authentication| JWT |
| Realtime      | WebSocket |
| Tools         | Git, GitHub, Postman, VS Code |

---

## ✨ Planned Features

✅ User authentication (JWT)  
✅ Profile creation & skill tagging  
✅ Real-time chat with WebSocket  
✅ Job posting & admin dashboard  
⏳ Notifications & friend requests *(in progress)*  

---

## 📂 Project Structure

devTinder/<br>
├── client/ # React frontend <br>
├── server/ # Node.js backend <br>
├── package.json <br>
└── README.md

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Tejaskt/devTinder.git
cd devTinder

```
2️⃣ Install Dependencies
```bash
# For frontend
cd client
npm install

# For backend
cd ../server
npm install

```
3️⃣ Configure Environment Variables
Create a .env file in server/ with:
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4️⃣ Run the App

``` bash

# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start

```
📸 Screenshots (Coming Soon)
Login	Profile	Chat

🤝 Contributing
Contributions are welcome during the build phase!

👨‍💻 Author
Tejas Kanzariya
