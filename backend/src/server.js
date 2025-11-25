import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import toneRoutes from "./routes/toneRoutes.js";


import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = process.env.PORT || ENV.PORT || 3000;

// --------------------
// MIDDLEWARE (should come BEFORE routes)
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://connectify-h1y5t.sevalla.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


// --------------------
// API ROUTES (After middleware only)
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", toneRoutes);
app.use("/api/messages", messageRoutes);

// --------------------
// DEPLOYMENT (Production Only)
// --------------------
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// --------------------
// START SERVER
// --------------------
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});
