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
        date: new Date(date),
        amount: parseFloat(amount),
        category,
        note,
      },
    });

    res.json(expense);
  } catch (err) {
    console.error("Expense creation failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized: no token" });

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    return res.status(500).json({ message: "Server error while fetching expenses" });
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const expenseId = parseInt(req.params.id);

    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || expense.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await prisma.expense.delete({ where: { id: expenseId } });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};
