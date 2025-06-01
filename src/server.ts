import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import resetPasswordRoutes from './modules/password/password.routes';
import userDataRouter from './modules/user/user.routes';
import uploadFile from './modules/uploads/upload-profile-logo.routes';
import updateSchedule from './modules/schedules/schedules.routes';
import pageStyle from './modules/store-customization/store-customization.routes'
import { PrismaClient } from '../node_modules/.prisma/client/index';
import { cleanExpiredTokens } from './modules/password/password.service';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/', authRoutes);
app.use('/', resetPasswordRoutes);
app.use('/', userDataRouter);
app.use('/', uploadFile);
app.use('/', updateSchedule);
app.use('/', pageStyle);

cron.schedule('0 * * * *', async () => {
    await cleanExpiredTokens(prisma);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

