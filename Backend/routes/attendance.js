import express from "express";
import { getAttendanceData } from "../services/selenium.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const data = await getAttendanceData(username);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch attendance" });
  }
});

export default router;
