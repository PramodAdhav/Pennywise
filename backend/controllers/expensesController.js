import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

// POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const { date, amount, category, note } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized: no token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: token missing" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT error:", err.message);
      return res.status(401).json({ message: `JWT invalid: ${err.message}` });
    }

    const userId = decoded.id;

    if (!date || !amount || !category)
      return res.status(400).json({ message: "Missing required fields" });

    const expense = await prisma.expense.create({
      data: {
        userId,
        date: new Date(date), // ensure Date object
        amount: parseFloat(amount),
        category,
        note,
      },
    });

    res.json(expense);
  } catch (err) {
    console.error("Expense creation failed:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get expenses" });
  }
};
