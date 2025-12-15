# Real-Time Chat App

A simple **real-time chat application** built with React, Tailwind, Node.js, and Socket.IO. Users can join channels, send messages, and see real-time updates for members and messages.

---

## Getting Started

### Client

1. Open a terminal and navigate to the client folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

---

### Server

1. Open a second terminal and navigate to the server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

---

### Usage

1. Open the client URL in your browser `http://localhost:5173`
2. Open another browser or incognito window to test real-time communication.
3. Users can join channels, send messages, and see other members and messages appear instantly.

---

## Future Fixes & Updates

- **Sockets for channel list updates**: Real-time changes to channels are shown for all users.
- **Proper remove member UI handling**: Avoid warnings when removing a member and ensure consistent styling.
- **Avatar updates**: Keep user avatars in sync across channels and messages.
- **Member profile info**: Display each member’s profile info including posts and activity.

---

## Folder Structure

```
client/       # React frontend
server/       # Node.js + Socket.IO backend
```
