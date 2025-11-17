import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import mangaRoutes from "./routes/mangaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import pool from "./config/database.js";
import { initializeSocket, setSocketInstance } from "./config/socket.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/manga", mangaRoutes);
app.use("/api/auth", authRoutes);

// Initialize Socket.IO
const io = initializeSocket(httpServer);
setSocketInstance(io);
console.log('✅ Socket.IO initialized');

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Socket.IO is ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
