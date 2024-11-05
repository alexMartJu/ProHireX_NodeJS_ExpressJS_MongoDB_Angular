import { Router } from 'express';
import { assignAdminToJob, listJobsForAdmin, assignJobToAdmin, respondToJobOffer } from '../controllers/AdminJobController';
import { verifyJWT } from '../middleware/verifyJWT';

const router = Router();

router.post('/assignAdmin', assignAdminToJob);
router.get('/listJobs', verifyJWT, listJobsForAdmin);
router.post('/assignJob', assignJobToAdmin);
router.post('/respond', respondToJobOffer);

export default router;
