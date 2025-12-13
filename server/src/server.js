import express from "express";
import http from "http";
import { Server } from "socket.io";

import routes from "./routes/index.js";
import { loadUsers } from "./services/usersService.js";
import config from "./config.js";

const app = express();
app.use(express.json());

// Preload users data
await loadUsers();

// Setup routes
app.use("/", routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// TODO: add socket events later
io.on("connection", () => console.log("Socket connected"));

app.get('/', (req, res) => {
  res.send('Hello! Server is running.');
});


server.listen(config.PORT, () =>
  console.log("Server running on port", config.PORT)
);
