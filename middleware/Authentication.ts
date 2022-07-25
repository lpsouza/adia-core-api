import * as express from 'express';
import { App } from '../database/models/App';

import { TokenManager } from '../services/TokenManager';

export const Authentication = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const appToken = req.headers['x-app-token'];
        if (!appToken) {
            res.status(401).send('Unauthorized');
            return;
        } else {
            const app = await App.findOne({ token: appToken });
            if (!app) {
                res.status(401).send('Unauthorized');
                return;
            } else {
                next();
                return;
            }
        }
    }

    try {
        TokenManager.verify(token);
    } catch (error) {
        res.status(401).send("Unauthorized");
        return;
    }

    next();
}
