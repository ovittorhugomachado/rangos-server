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
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

    {/*ANTES DE COLOCAR O PROJETO EM PRODUÇÃO FAZER TESTES SALVANDO DADOS NO CACHE
    PRA DIMINUIR O NUMERO DE CONSULTAR NO BD E DIMINUIR A LATÊNCIA */}

const app = express();
const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load(path.resolve(__dirname, './docs/swagger.yaml'));

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors());

app.use('/', authRoutes);
app.use('/', resetPasswordRoutes);
app.use('/', userDataRouter);
app.use('/', storeDataRoutes)
app.use('/', uploadFile);
app.use('/', updateSchedule);
app.use('/', menuCategoriesRoutes);
app.use('/', menuItemRoutes);
app.use('/', ordersRoutes);
app.use('/', manageOrdersRoutes);
app.use('/', pageStyle);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

