import express from 'express'
import cors from 'cors'
import { PrismaClient } from './generated/prisma/index';

const app = express()
const prisma = new PrismaClient()
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
})

app.delete('/categories/:id', async (req, res) => {
    const id = Number(req.params.id)

    if(isNaN(id)) {
        res.status(400).send({ message: 'ID inválido' })
        return
    }

    try {
        const category = await prisma.menuCategory.findUnique({
            where: { id }
        })

        if(!category) {
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
})

app.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.menuCategory.findMany()

        res.status(200).json(categories)
    } catch {
        res.status(500).send({ message: 'Erro ao buscar lista de categorias' })
    }

})

app.listen(port, () => {
    console.log(`Rodando em http://localhost:${port}/ `)
})