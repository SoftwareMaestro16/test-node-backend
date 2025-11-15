import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'Нет токена' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, "secret123") as unknown as JwtPayload;
        const user = decoded;
        (req as any).user = user;

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Неверный токен' });
    }
};
