# HiFi 💬
A production-grade real-time chat application built from scratch — not just another tutorial clone.
HiFi is a full-stack messaging platform with a custom dark glass UI, 22 switchable themes, and a suite of advanced chat features that go well beyond the basics.
 
 ## Live Demo

> Coming soon — deploying to Vercel + Render
 
## Screenshots
 
> Add your screenshots here
 
---
 
## Features
 
### Core
- 🔐 JWT authentication with HttpOnly cookies
- 🟢 Real-time online/offline presence via Socket.io
- 💬 Instant messaging with image support (Cloudinary)
- 📱 Fully responsive design
 
### Advanced Chat
- 😍 **Emoji Reactions** — hover any message for a quick-pick bar, or open the full 80+ emoji grid with search
- ✍️ **Typing Indicators** — animated 3-dot indicator with debounce
- ✅ **Read Receipts** — Sent / Seen status on every message
- 💬 **Reply Threading** — reply to any specific message with a preview
- 🗑️ **Message Deletion** — delete for yourself or delete for everyone (sender only)
 
### UI & Theming
- 🎨 22 switchable themes (DaisyUI) + custom HiFi dark glass theme as default
- 🌈 Gradient avatars — deterministic color per user, no two look the same
- 🔍 Sidebar search to filter contacts
- 📅 Date separators between message groups
- 🏷️ Custom HiFi brand icon — playful rounded chat bubble design
 
---
 
## Tech Stack
 
**Frontend**
- React.js + Vite
- Tailwind CSS + DaisyUI
- Zustand (state management)
- Socket.io-client
- React Router v6
- Lucide React icons
 
**Backend**
- Node.js + Express.js
- Socket.io
- MongoDB + Mongoose
- Cloudinary (image storage)
- JWT (HttpOnly cookies)
- bcryptjs
 
---
 
## Project Structure
 
```
hifi/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, ChatContainer, MessageBubble...
│   │   ├── pages/          # HomePage, LoginPage, SignUpPage, SettingsPage, ProfilePage
│   │   ├── store/          # Zustand stores (auth, chat, theme)
│   │   └── lib/            # axios instance, utils
├── backend/
│   ├── controllers/        # auth, message
│   ├── models/             # User, Message
│   ├── routes/             # auth, message routes
│   ├── middleware/         # JWT protect route
│   └── lib/                # db, socket, utils
```
 
---
 
## Getting Started
 
### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
 
### 1. Clone the repo
 
```bash
git clone https://github.com/yourusername/hifi-chat.git
cd hifi-chat
```
 
### 2. Setup backend
 
```bash
cd backend
npm install
```
 
Create .env in /backend:
 
```
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```
 
```bash
npm run dev
```
 
### 3. Setup frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
### 4. (Optional) Seed the database
 
```bash
cd backend
node src/seeds/user.seed.js
```
 
This creates 15 demo users — all with password 123456.
 
---
 
## Environment Variables
 
| Variable                | Description                        |
|-------------------------|------------------------------------|
| MONGO_URI               | MongoDB Atlas connection string    |
| JWT_SECRET              | Secret key for JWT signing         |
| CLOUDINARY_CLOUD_NAME   | Your Cloudinary cloud name         |
| CLOUDINARY_API_KEY      | Cloudinary API key                 |
| CLOUDINARY_API_SECRET   | Cloudinary API secret              |
| PORT                    | Backend port (default 5001)        |
 
---
 
## What makes this different
 
Most chat apps built from the same YouTube tutorial have identical code, identical UI,
and identical bugs (including the Socket.io newMessage emit bug that means messages
only appear after a page refresh). HiFi fixes all of that and goes further:
 
- Custom HiFi theme registered in Tailwind config — not just a DaisyUI default swap
- Full emoji reaction system with a real picker, not just a hardcoded list of 6
- Soft deletes with per-user and global (everyone) modes stored in MongoDB
- Message model extended with reactions, replyTo, seenBy, deletedFor fields
- All UI components use DaisyUI semantic tokens so every theme looks correct
 
