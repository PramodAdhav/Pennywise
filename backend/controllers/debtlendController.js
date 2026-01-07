import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

// verify JWT and get userId
function getUserIdFromToken(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    console.error("Invalid or expired token:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// POST /api/debtlend
export const addDebtLend = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req, res);
    if (!userId) return; 

    const { personOfInterest, date, amount, note, type } = req.body;

    if (!personOfInterest || !date || !amount || !type)
      return res.status(400).json({ message: "Missing required fields" });

    if (type !== "Debt" && type !== "Lend")
      return res.status(400).json({ message: "Invalid type (must be 'Debt' or 'Lend')" });

    const debtLend = await prisma.debtLend.create({
      data: {
        userId,
        personOfInterest,
        date: new Date(date),
        amount: parseFloat(amount),
        note,
        type,
        status: "uncleared",
      },
    });

    res.json(debtLend);
  } catch (err) {
    console.error("Debt/Lend creation failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/debtlend
export const getDebtLend = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req, res);
    if (!userId) return; 

    const records = await prisma.debtLend.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json(records); 
  } catch (err) {
    console.error("Fetch Debt/Lend failed:", err);
    res.status(500).json({ message: "Failed to get Debt/Lend records" });
  }
};

// DELETE /api/debtlend/:id
export const deleteDebtLend = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req, res);
    if (!userId) return;

    const id = parseInt(req.params.id);

    const record = await prisma.debtLend.findUnique({ where: { id } });
    if (!record || record.userId !== userId)
      return res.status(403).json({ message: "Unauthorized or not found" });

    await prisma.debtLend.delete({ where: { id } });

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete Debt/Lend failed:", err);
    res.status(500).json({ message: "Failed to delete record" });
  }
};

// PATCH /api/debtlend/:id/status
export const updateDebtLendStatus = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req, res);
    if (!userId) return;

    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status || !["cleared", "uncleared"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const record = await prisma.debtLend.findUnique({ where: { id } });
    if (!record || record.userId !== userId)
      return res.status(403).json({ message: "Unauthorized or not found" });

    const updated = await prisma.debtLend.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    console.error("Update Debt/Lend status failed:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
