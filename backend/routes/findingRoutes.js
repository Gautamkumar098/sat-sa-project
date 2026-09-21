import { Router } from "express";
import { listFindings } from "../controllers/findingController.js";
const r = Router();
r.get("/", listFindings);
export default r;
