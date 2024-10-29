import { Router } from "express";
import { jobsList } from "../../controllers/jobsController";
import verifyJWT from "../../middleware/auth/authenticator";

const router = Router();

router.get("/listjobs", verifyJWT, jobsList);

export default router;