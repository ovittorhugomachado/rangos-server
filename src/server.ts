import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import resetPasswordRoutes from './modules/password/password.routes';
import userDataRouter from './modules/user/user.routes';
import storeDataRoutes from './modules/store/store.routes';
import uploadFile from './modules/uploads/upload.routes';
import updateSchedule from './modules/schedules/schedules.routes';
import menuCategoriesRoutes from './modules/manage-menu/menu-category/menu-category.routes';
import menuItemRoutes from './modules/manage-menu/menu-items/menu-item.routes';
import ordersRoutes from './modules/orders/create-order/by-store/order.routes';
import manageOrdersRoutes from './modules/orders/manage-order/by-store/orders.routes';
import pageStyle from './modules/menu-customization/store-customization.routes';
import './modules/password/clean-expired-tokens.utils';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

{/*ANTES DE COLOCAR O PROJETO EM PRODUÇÃO FAZER TESTES SALVANDO DADOS NO CACHE
    PRA DIMINUIR O NUMERO DE CONSULTAR NO BD E DIMINUIR A LATÊNCIA */}

const app = express();
const port = process.env.PORT;
const swaggerDocument = YAML.load(path.resolve(__dirname, './docs/swagger.yaml'));
const apiUrl = process.env.APP_URL || `http://localhost:${port}`;
swaggerDocument.servers = [{ url: apiUrl, description: 'API Server' }];

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use('/api', authRoutes);
app.use('/api', resetPasswordRoutes);
app.use('/api', userDataRouter);
app.use('/api', storeDataRoutes);
app.use('/api', uploadFile);
app.use('/api', updateSchedule);
app.use('/api', menuCategoriesRoutes);
app.use('/api', menuItemRoutes);
app.use('/api', ordersRoutes);
app.use('/api', manageOrdersRoutes);
app.use('/api', pageStyle);
app.use('/api/uploads', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

