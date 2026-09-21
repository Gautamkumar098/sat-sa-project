import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cseRoutes from "./routes/cseRoutes.js";
import findingRoutes from "./routes/findingRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "SAT-SA API" }),
);
app.use("/api/cses", cseRoutes);
app.use("/api/findings", findingRoutes);
app.use("/api/analysis", analysisRoutes);
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sat_sa")
  .then(() =>
    app.listen(port, () => console.log(`SAT-SA API running on ${port}`)),
  )
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    app.listen(port, () =>
      console.log(`SAT-SA API running without DB on ${port}`),
    );
  });
