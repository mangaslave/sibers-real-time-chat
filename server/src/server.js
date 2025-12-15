import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import routes from "./routes/index.js";
import { getAllUsers, loadUsers } from "./services/usersService.js";
import config from "./config.js";
import socketEvents from "./socket/socketEvents.js";

const app = express();

// Preload users
await loadUsers();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/", routes);

// HTTP + Socket
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

// Register socket events
socketEvents(io);

server.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT}`)
);
