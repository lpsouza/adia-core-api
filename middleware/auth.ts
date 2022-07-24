import * as express from 'express';

import { TokenManager } from '../services/TokenManager';

export const AuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(400).send('Token not found');
        return;
    }

    const isValid = TokenManager.verify(token);
    if (!isValid) {
        res.status(400).send('Invalid token');
        return;
    }

    next();
}
