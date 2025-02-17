# Real-Time Collaborative Text Editor

A real-time collaborative text editor built using the MERN stack (MongoDB, Express, React, Node.js) with **Socket.io** for real-time communication.

## Features

✅ **Real-Time Collaboration**: Multiple users can edit the same document simultaneously.  
✅ **Automatic Document Saving**: Changes are saved to MongoDB every few seconds.  
✅ **Unique Document URLs**: Each document has a unique ID and is accessible via its link.  
✅ **Rich Text Editing**: Implemented with Quill.js for a smooth editing experience.  
✅ **WebSockets for Fast Communication**: Uses **Socket.io** for instant content updates.  

---

## Tech Stack

- **Frontend**: React.js, Quill.js, Axios, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io

---

## Demo Video

Watch the demo video here: [Project Demo](https://drive.google.com/drive/folders/1GBH9WUMymjXnC1ZdU0j4oX1cqJpWpN-O?usp=sharing)

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **MongoDB** (local )

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/realtime-editor.git
cd realtime-editor
```

### 2️⃣ Install Dependencies
#### Install Backend Dependencies
```bash
cd backend
npm install
```
#### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
### 3️⃣ Run the Application
#### Start Backend Server
```bash
cd backend
npm run dev
```
#### Start Frontend React App
```bash
cd frontend
npm start
```

---

## Usage
1. Open the app at **http://localhost:3000**.
2. A new document will be created automatically, or you can open an existing one using its unique URL.
3. Start typing and see updates in real time!

---

