import { Router } from 'express';
import { blockUser, getAllUsers, getUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.get("/get", authMiddleware, getAllUsers);
userRouter.put("/ban/:id", authMiddleware, blockUser);
userRouter.get("/:id", authMiddleware, getUser);

export default userRouter;