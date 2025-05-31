import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { stripNonDigits } from '../utils/stripFormating';
import { PrismaClient, WeekDay } from '.prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secreto'

interface AccountData {
    restaurantName: string;
    cnpj?: string;
    ownersName: string;
    cpf: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export const signUpService = async (data: AccountData) => {
    const { restaurantName, cnpj, ownersName, cpf, phoneNumber, email, password } = data;

    const rawCpf = stripNonDigits(cpf);
    const rawCnpj = cnpj ? stripNonDigits(cnpj) : null;
    const rawPhoneNumber = stripNonDigits(phoneNumber);

    if (password.length < 8) throw new Error('Senha fraca');
    if (!email.includes('@')) throw new Error('Email inválido');
    if (rawCpf.length !== 11) throw new Error('CPF inválido');
    if (cnpj && rawCnpj && rawCnpj.length !== 14) throw new Error('CNPJ inválido');
    if (password.length > 72) throw new Error('Senha muito longa');
    if (!/[A-Z]/.test(password)) throw new Error('Senha sem letra maiúscula');
    if (!/[0-9]/.test(password)) throw new Error('Senha sem número');

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.$transaction(async (prisma) => {

        const user = await prisma.user.create({
            data: {
                restaurantName,
                cnpj: rawCnpj,
                ownersName,
                cpf: rawCpf,
                phoneNumber: rawPhoneNumber,
                email,
                password: hashedPassword,
            },
        });

        const daysOfWeek: WeekDay[] = [
            'segunda',
            'terca',
            'quarta',
            'quinta',
            'sexta',
            'sabado',
            'domingo'
        ];

        await prisma.openingHour.createMany({
            data: daysOfWeek.map(day => ({
                userId: user.id,
                day,
                isOpen: false, 
                timeRanges: [] 
            }))
        });

        return user;
    });

    return newUser;
};


export const loginService = async (data: AccountData) => {
    const { email, password } = data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new Error('INVALID_DATA');
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw new Error('INVALID_DATA')
    }
    const token = jwt.sign(
        {
            userId: user.id,
            plan: user.plan,
            accountStatus: user.accountStatus
        },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    return token;
}