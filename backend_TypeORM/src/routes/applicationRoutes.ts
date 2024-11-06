// src/routes/ApplicationRoutes.ts
import { Router } from 'express';
import { applyForJob, hasUserApplied } from '../controllers/ApplicationController';

const router = Router();

// Ruta para aplicar a un trabajo
router.post('/apply', applyForJob);

// Ruta para verificar si un usuario ha aplicado a un trabajo (se pasa a BackEnd)
router.get('/check/aa', hasUserApplied);

export default router;