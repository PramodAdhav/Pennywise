import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import expensesRoutes from "./routes/expenses.js";
import debtLendRoutes from "./routes/debtlendRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// CORS
app.use(cors());
// Middleware

app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/debtlend", debtLendRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
// Start

export default app;