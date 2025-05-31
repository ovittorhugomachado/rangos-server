import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/login-and-signup.routes';
import resetPasswordRoutes from './routes/reset-password.routes';
import userDataRouter from './routes/user.routes';
import uploadFile from './routes/upload-files.routes';
import updateSchedule from './routes/schedules.routes';
import pageStyle from './routes/store-customization.routes';
import { PrismaClient } from '../node_modules/.prisma/client/index';
import { cleanExpiredTokens } from './services/reset-password.service';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/reset-password', resetPasswordRoutes);
app.use('/data', userDataRouter);
app.use('/', uploadFile);
app.use('/', updateSchedule);
app.use('/', pageStyle);

cron.schedule('0 * * * *', async () => {
    await cleanExpiredTokens(prisma);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

