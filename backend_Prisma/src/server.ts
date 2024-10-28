import app from "./app";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Express Server initiated listening on port ${port}`);
});