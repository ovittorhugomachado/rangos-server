import { Request, Response } from "express";
import { loginFieldsErrorChecker, signUpFieldsErrorChecker } from "./field-error-checker";
import { ConflictError, UnauthorizedError, ValidationError } from "../../utils/errors";
import { signUpService, loginService, refreshTokenService, logoutService } from "./auth.service";


export const signUp = async (req: Request, res: Response) => {

    try {

        const validationError = signUpFieldsErrorChecker(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        await signUpService(req.body);

        return res.status(201).json({ message: 'Usuário criado com sucesso' });

    } catch (error: any) {

        console.error('Erro no cadastro:', error);
                
        if (error instanceof ConflictError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        if (error instanceof ValidationError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
    }
};

export const login = async (req: Request, res: Response) => {

    try {

        const validationError = loginFieldsErrorChecker(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const { accessToken, refreshToken } = await loginService(req.body);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: false, //EM PRODUÇÃOO MUDAR PARA TRUE
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,//EM PRODUÇÃOO MUDAR PARA TRUE
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        });

        return res.status(200).json({ message: 'Login realizado com sucesso' });

    } catch (error: any) {

        console.error('Erro no login:', error);

        if (error instanceof UnauthorizedError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        if (error instanceof ConflictError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        if (error instanceof ValidationError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
    }
};

export const refreshAccessToken = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token não fornecido' });
    }

    try {
        const newAccessToken = await refreshTokenService(refreshToken);

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Token renovado com sucesso' });

    } catch (error: any) {
 
        console.error('Erro na criação de um novo token:', error);

        if (error instanceof UnauthorizedError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
    }
};

export const logout = async (req: Request & { user?: any }, res: Response) => {

    try {

        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        await logoutService(userId);

        res.clearCookie('token');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logout efetuado com sucesso' });

    } catch (error) {

        console.error('Erro no logout:', error);

        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};