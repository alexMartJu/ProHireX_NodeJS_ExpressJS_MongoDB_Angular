import { Router } from "express";
import { jobsList } from "../../controllers/jobsController";
import { jobCreate } from "../../controllers/jobsController";
import { updateJobState } from "../../controllers/jobsController";
import verifyJWT from "../../middleware/auth/authenticator";
import * as validator from "../../middleware/jobsValidator";

const router = Router();

router.get("/listjobs", verifyJWT, jobsList);
router.post("/createjob", validator.jobCreateValidator, jobCreate);
router.put("/:slug", updateJobState);

export default router;