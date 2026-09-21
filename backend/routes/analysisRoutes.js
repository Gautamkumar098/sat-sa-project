import { Router } from "express";
import { spawn } from "child_process";
const r = Router();
r.get("/summary", (req, res) =>
  res.json({
    supervisoryScore: 67.4,
    executionGap: 72,
    negativeSpace: 81,
    anomalyNlp: 64,
    baseline: 58,
    formula: "0.35 EG + 0.30 NS + 0.20 Anomaly/NLP + 0.15 Baseline",
  }),
);
r.post("/run", (req, res) => {
  const py = process.env.PYTHON_BIN || "python";
  const p = spawn(
    py,
    ["../python-engine/run_pipeline.py", "../python-engine/sample_data"],
    { cwd: process.cwd() },
  );
  let out = "";
  let err = "";
  p.stdout.on("data", (d) => (out += d));
  p.stderr.on("data", (d) => (err += d));
  p.on("close", (code) =>
    res.status(code ? 500 : 200).json({ ok: !code, output: out, error: err }),
  );
});
export default r;
