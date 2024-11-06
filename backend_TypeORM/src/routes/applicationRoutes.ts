// src/routes/ApplicationRoutes.ts
import { Router } from 'express';
import { applyForJob, getPendingApplicationsByAdmin, hasUserApplied } from '../controllers/ApplicationController';
import { verifyJWT } from '../middleware/verifyJWT'; // Middleware para verificar el token JWT

const router = Router();

// Ruta para aplicar a un trabajo
router.post('/apply', applyForJob);

// Ruta para listar las inscripciones pendientes para un userAdmin específico
router.get('/pending/applications', verifyJWT, getPendingApplicationsByAdmin);

// Ruta para verificar si un usuario ha aplicado a un trabajo (se pasa a BackEnd)
router.get('/check/aa', hasUserApplied);

export default router;