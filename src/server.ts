import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { PrismaClient } from '../node_modules/.prisma/client/index';
import { cleanExpiredTokens } from './services/reset-password.service';
import authRoutes from './routes/auth.routes';
import resetPasswordRoutes from './routes/reset-password.routes';
import userDataRouter from './routes/user.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/reset-password', resetPasswordRoutes);
app.use('/data', userDataRouter);

cron.schedule('0 * * * *', async () => {
    await cleanExpiredTokens(prisma);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

