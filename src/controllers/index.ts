import type { Request, Response } from 'express';

export const getHome = (req: Request, res: Response) => {
  res.json({
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
  });
};

export const getInfo = (req: Request, res: Response) => {
  res.json({
    name: 'Test Task',
    version: '0.0.1',
    environment: 'development'
  });
};
