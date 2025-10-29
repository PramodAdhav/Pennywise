import express from "express";
import { addDebtLend, getDebtLend, updateDebtLendStatus, deleteDebtLend } from "../controllers/debtlendController.js";

const router = express.Router();

router.post("/", addDebtLend);
router.get("/", getDebtLend);
router.patch("/:id/status", updateDebtLendStatus);
router.delete("/:id", deleteDebtLend);

export default router;
