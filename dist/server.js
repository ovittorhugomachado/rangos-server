"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const password_routes_1 = __importDefault(require("./modules/password/password.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const store_routes_1 = __importDefault(require("./modules/store/store.routes"));
const upload_routes_1 = __importDefault(require("./modules/uploads/upload.routes"));
const schedules_routes_1 = __importDefault(require("./modules/schedules/schedules.routes"));
const menu_category_routes_1 = __importDefault(require("./modules/manage-menu/menu-category/menu-category.routes"));
const menu_item_routes_1 = __importDefault(require("./modules/manage-menu/menu-items/menu-item.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/create-order/by-store/order.routes"));
const orders_routes_1 = __importDefault(require("./modules/orders/manage-order/by-store/orders.routes"));
const store_customization_routes_1 = __importDefault(require("./modules/menu-customization/store-customization.routes"));
require("./modules/password/clean-expired-tokens.utils");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
{ /*ANTES DE COLOCAR O PROJETO EM PRODUÇÃO FAZER TESTES SALVANDO DADOS NO CACHE
    PRA DIMINUIR O NUMERO DE CONSULTAR NO BD E DIMINUIR A LATÊNCIA */
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const swaggerDocument = yamljs_1.default.load(path_1.default.resolve(__dirname, './docs/swagger.yaml'));
app.set('trust proxy', 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/', auth_routes_1.default);
app.use('/', password_routes_1.default);
app.use('/', user_routes_1.default);
app.use('/', store_routes_1.default);
app.use('/', upload_routes_1.default);
app.use('/', schedules_routes_1.default);
app.use('/', menu_category_routes_1.default);
app.use('/', menu_item_routes_1.default);
app.use('/', order_routes_1.default);
app.use('/', orders_routes_1.default);
app.use('/', store_customization_routes_1.default);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
