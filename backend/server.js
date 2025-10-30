import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import expensesRoutes from "./routes/expenses.js";
import debtLendRoutes from "./routes/debtlendRoutes.js";

dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded ✅" : "Missing ❌");

const app = express();
const PORT = process.env.PORT || 5000;

// Needed to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/debtlend", debtLendRoutes);

// ✅ Serve frontend (React build) for production
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// ✅ Catch-all for React Router routes (e.g. /home, /history)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Local development only (Render/Vercel will handle start)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
