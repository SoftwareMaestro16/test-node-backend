import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});
app.use('/', router);
app.use('/auth', authRouter);
app.use('/user', userRouter);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT!);
        console.log('✅ Подключение к базе MongoDB');

        app.listen(PORT, () => {
            console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ MongoDB ошибка подключения:', error);
        process.exit(1);
    }
};

startServer();
