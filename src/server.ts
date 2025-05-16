import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { transporter } from './utils/email';
import { PrismaClient } from '../node_modules/.prisma/client/index';

dotenv.config();
const app = express()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'secreto'
const port = 3000

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/categories', async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).send({ message: 'O nome da categoria é obrigatório' })
        return
    }

    const categoryWithSameName = await prisma.menuCategory.findFirst({
        where: {
            name: { equals: name.trim(), mode: 'insensitive' }
        }
    });

    if (categoryWithSameName) {
        res.status(409).send({ message: `Categoria ${name} já existe` })
        return
    };

    try {
        await prisma.menuCategory.create({
            data: { name }
        })

        res.status(201).send({ message: `Categoria ${name} criada com sucesso` })
    } catch (error) {
        console.error('[ERRO AO CRIAR CATEGORIA]', error)
        res.status(500).send({ message: "Ocorreu um erro ao criar nova categoria" })
    }
});

app.delete('/categories/:id', async (req, res) => {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        res.status(400).send({ message: 'ID inválido' })
        return
    }

    try {
        const category = await prisma.menuCategory.findUnique({
            where: { id }
        })

        if (!category) {
            res.status(404).send({ message: 'Categoria não encontrada' })
        }

        await prisma.menuCategory.delete({
            where: { id }
        })

        res.status(204).send()
    } catch (error) {
        console.error('[ERRO AO DELETAR CATEGORIA]', error)
        res.status(500).send({ message: 'Erro ao deletar categoria' })
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.menuCategory.findMany()

        res.status(200).json(categories)
    } catch {
        res.status(500).send({ message: 'Erro ao buscar lista de categorias' })
    }

});

app.post('/signup', async (req, res) => {
    const { restaurantName, cnpj, ownersName, cpf, number, email, password } = req.body;

    if (!restaurantName || !ownersName || !cpf || !number || !email || !password) {
        res.status(400).json({ message: 'Campos obrigatórios' })
        return
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            res.status(409).send({ message: 'Email já cadastrado' });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                restaurantName,
                cnpj,
                ownersName,
                cpf,
                phoneNumber: number,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'Usuário criado com sucesso' });
        return

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
        return
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ message: 'Email ou senha inválidos' })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(401).json({ message: 'Email ou senha inválidos' })
            return
        }

        const token = jwt.sign(
            {
                userId: user.id,
                plan: user.plan,
                accountStatus: user.accountStatus
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        )
        res.status(200).json({ token })
    } catch (error) {
        console.error('[ERRO NO LOGIN]', error);
        res.status(500).send({ message: 'Erro ao fazer login' })
    }
});

//Rota para enviar email de recuperação de senha
app.post('/recover-password', async (req, res) => {
    const { email } = req.body

    try {

        const user = await prisma.user.findUnique({ where: { email } })
        const resturant = await prisma.user.findFirst({
            where: { email },
            select: { restaurantName: true }
        })

        console.log(resturant?.restaurantName)

        if (!user) {
            res.status(401).json({ message: 'Usuário não encontrado' })
            return
        }

        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 3600000);

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user?.id,
                expiresAt,
            }
        })

        const link = `http://localhost:5173/create-new-password/${token}`;

        await transporter.sendMail({
            from: '"Meu Menu" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Recuperação de senha',
            html: `
            <p>Olá <strong>${resturant?.restaurantName}</strong>,</p>
            <p>Recebemos uma solicitação de redefinição de senha, clique no link abaixo para criar uma nova senha</p>
            <a href="${link}">Redefinir senha</a>
            <br>
            <p>Se você não solicitou uma nova senha desconsidere o email.</p>
            <p>Caso precise de ajuda é só entrar em contato conosco respondendo esse email</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Meu Menu</strong></p>
            `
        });

        res.status(200).json({ message: 'Um link de redefinição de senha foi enviado para seu email' })
    } catch (error) {
        console.error('[ERRO]', error);
        res.status(500).send({ message: 'Erro ao recuperar senhaserver' })
    }
});

// app.patch('/create-new-password/:token', async (req, res) => {
//     const { newPassword } = req.body

//     try {
//         const password = await prisma.user.update({
//             data: 
//         })
//     } catch {

//     }
// })

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`)
})