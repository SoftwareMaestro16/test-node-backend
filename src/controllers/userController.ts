import type { Request, Response } from 'express';
import User from '../models/User';
import type { JwtPayload } from 'jsonwebtoken';

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user as JwtPayload;

    const requestedUser = await User.findOne({ id: Number(req.params.id) });
    if (!requestedUser) return res.status(404).json({ error: 'Пользователь не найден' });
    if (user.role !== 'admin' && user.email !== requestedUser.email) {
        return res.status(403).json({ error: 'Нет доступа к этим данным' });
    }
    const foundUser = await User.findOne({ id });
    if (!foundUser) return res.status(404).json({ error: 'Пользователь не найден' });

    return res.json({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        middleName: foundUser.middleName || null,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status,
    });
};

export const getAllUsers = async (req: Request, res: Response) => {
    const user = (req as any).user as JwtPayload;

    if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Нет доступа' });
    }

    try {
        const users = await User.find();

        const result = users.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            middleName: u.middleName || null,
            email: u.email,
            role: u.role,
            status: u.status,
        }));

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const blockUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user as JwtPayload;

    try {
        const requestedUser = await User.findOne({ id });
        if (!requestedUser) return res.status(404).json({ error: 'Пользователь не найден' });
        if (user.role !== 'admin' && user.email !== requestedUser.email) {
            return res.status(403).json({ error: 'Нет доступа к этим данным' });
        }

        requestedUser.status = 'blocked';
        await requestedUser.save();

        return res.json({
            message: 'Пользователь заблокирован',
            user: {
                id: requestedUser.id,
                status: requestedUser.status,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};
