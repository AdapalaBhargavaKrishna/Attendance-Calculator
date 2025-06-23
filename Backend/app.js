import express from "express";
import cors from "cors";
import attendanceRoute from "./routes/attendance.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/attendance", attendanceRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
