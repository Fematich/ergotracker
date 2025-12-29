import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "8099", 10);
const DATABASE_PATH =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), "data", "ergotracker.db");

// Ensure the database directory exists
fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });

const db = new Database(DATABASE_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS training_settings (
    device_id TEXT PRIMARY KEY,
    start_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS completed_workouts (
    device_id TEXT NOT NULL,
    workout_day INTEGER NOT NULL,
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (device_id, workout_day)
  );
`);

const app = express();
app.use(express.json());
app.use(cors());

const requireDeviceId = (req, res, next) => {
  const deviceId = req.header("x-device-id");
  if (!deviceId) {
    return res.status(400).json({ error: "Missing X-Device-Id header" });
  }
  req.deviceId = deviceId;
  next();
};

const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use(requireDeviceId);

apiRouter.get("/training-settings", (req, res) => {
  const row = db
    .prepare("SELECT start_date FROM training_settings WHERE device_id = ?")
    .get(req.deviceId);

  res.json({
    startDate: row ? row.start_date : null,
  });
});

apiRouter.put("/training-settings", (req, res) => {
  const { startDate } = req.body || {};
  if (!startDate) {
    return res.status(400).json({ error: "startDate is required" });
  }

  db.prepare(
    `
      INSERT INTO training_settings (device_id, start_date, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(device_id) DO UPDATE SET
        start_date = excluded.start_date,
        updated_at = CURRENT_TIMESTAMP
    `
  ).run(req.deviceId, startDate);

  res.json({ startDate });
});

apiRouter.get("/completed-workouts", (req, res) => {
  const rows = db
    .prepare(
      "SELECT workout_day as day, completed_at FROM completed_workouts WHERE device_id = ?"
    )
    .all(req.deviceId);

  res.json({
    completed: rows,
  });
});

apiRouter.post("/completed-workouts", (req, res) => {
  const { day } = req.body || {};
  const workoutDay = Number(day);

  if (!Number.isInteger(workoutDay) || workoutDay < 1) {
    return res.status(400).json({ error: "day must be a positive integer" });
  }

  const completedAt = new Date().toISOString();

  db.prepare(
    `
      INSERT INTO completed_workouts (device_id, workout_day, completed_at)
      VALUES (?, ?, ?)
      ON CONFLICT(device_id, workout_day) DO UPDATE SET
        completed_at = excluded.completed_at
    `
  ).run(req.deviceId, workoutDay, completedAt);

  res.json({ day: workoutDay, completed_at: completedAt });
});

apiRouter.delete("/completed-workouts/:day", (req, res) => {
  const workoutDay = Number(req.params.day);

  if (!Number.isInteger(workoutDay) || workoutDay < 1) {
    return res.status(400).json({ error: "day must be a positive integer" });
  }

  db.prepare(
    "DELETE FROM completed_workouts WHERE device_id = ? AND workout_day = ?"
  ).run(req.deviceId, workoutDay);

  res.status(204).send();
});

app.use("/api", apiRouter);

// Serve the built React app when available
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.warn("dist/ folder not found; API will run without serving the UI");
}

app.listen(PORT, () => {
  console.log(`Ergotracker server listening on port ${PORT}`);
  console.log(`Using SQLite database at ${DATABASE_PATH}`);
});
