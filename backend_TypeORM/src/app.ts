import express from 'express';
import userAdminRoutes from './routes/authAdminRoutes';
import adminRoutes from './routes/adminJobRoutes';
import { AppDataSource } from './config/database';
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();
const app = express();
// Configuración de CORS (opcional)
const corsOptions = {
  origin: process.env.CORSURL,
  optionsSuccessStatus: 200,
};

// Habilitar CORS con opciones
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/authAdmin', userAdminRoutes);
app.use('/api/admin', adminRoutes);

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log(error));

export default app;
