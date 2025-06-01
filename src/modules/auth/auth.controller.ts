import { Request, Response } from "express";
import { signUpService, loginService } from "./auth.service";
import { validateSignUpFields, validateLoginFields } from "../../middlewares/validation.middleware";

export const signUp = async (req: Request, res: Response) => {

    try {
        const validationError = validateSignUpFields(req.body);

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
        const validationError = validateLoginFields(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const token = await loginService(req.body)
        return res.status(200).json({ token });

    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'INVALID_DATA') {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};