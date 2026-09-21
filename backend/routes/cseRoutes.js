import { Router } from "express";
import { listCSEs, getCSE } from "../controllers/cseController.js";
const r = Router();
r.get("/", listCSEs);
r.get("/:id", getCSE);
export default r;
