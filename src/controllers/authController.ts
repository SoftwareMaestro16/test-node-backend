import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, middleName, birthDay, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Пользователь уже существует" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      middleName,
      birthDay,
      email,
      passwordHash,
      role: role || 'user',
    });

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        'secret123',
        { expiresIn: "7d" }
      );
      
      return res.json({
        message: "Пользователь зарегистрирован",
        token, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Неверный email или пароль" });
  
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) return res.status(400).json({ error: "Неверный email или пароль" });
  
      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        'secret123',
        { expiresIn: "7d" } 
      );
  
      return res.json({
        message: "Авторизация успешна",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName || null,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  };