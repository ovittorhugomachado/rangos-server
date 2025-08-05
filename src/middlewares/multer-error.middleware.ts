import express, { Request, Response, NextFunction } from 'express';

function multerErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Imagem muito grande. Tamanho máximo: 2MB.' });
        }
        if (err.message === 'Tipo de arquivo inválido.') {
            return res.status(400).json({ error: 'Tipo de arquivo inválido. Só é permitido imagem.' });
        }
        return res.status(400).json({ error: err.message });
    }
    next();
};

export { multerErrorHandler }
