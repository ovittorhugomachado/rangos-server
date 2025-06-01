import { Request, Response } from "express";
import { signUpService, loginService, refreshTokenService, logoutService } from "./auth.service";
import { loginFieldsErrorChecker, signUpFieldsErrorChecker } from "./error-checker";

export const signUp = async (req: Request, res: Response) => {

    try {
        const validationError = signUpFieldsErrorChecker(req.body);

        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        await signUpService(req.body);
        return res.status(201).json({ message: 'Usuário criado com sucesso' });

    } catch (error: any) {
        const errorMap: Record<string, number> = {
            'Email já cadastrado': 409,
            'CPF inválido': 400,
            'CNPJ inválido': 400,
            'Senha fraca': 400,
            'Email inválido': 400
        };

        const statusCode = errorMap[error.message] || 500;
        return res.status(statusCode).json({
            message: error.message || 'Erro interno do servidor'
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
            path: '/refresh',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        });
        return res.status(200).json({ message: 'Login realizado com sucesso' });

    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'INVALID_DATA') {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
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
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        return res.status(403).json({ message: 'Refresh token inválido ou expirado' });
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