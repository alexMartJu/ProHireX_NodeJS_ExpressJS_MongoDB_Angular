import express from "express";
import authEnterpriseRouter from "./routes/api/authEnterprise";
import cors from "cors";

const app = express();

// Configuración de CORS (opcional)
const corsOptions = {
    origin: process.env.CORSURL,
    optionsSuccessStatus: 200,
};

// Habilitar CORS con opciones
app.use(cors(corsOptions));

// Allows parsing of json in the body of the request.
app.use(express.json());

app.use("/api/authEnterprise", authEnterpriseRouter);

export default app;