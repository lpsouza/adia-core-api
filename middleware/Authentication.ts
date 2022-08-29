import * as express from 'express';
import { App } from '../database/models/App';
import { User } from '../database/models/User';

import { TokenManager } from '../services/TokenManager';

export const Authentication = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const appId = req.headers['x-app-id'] as string;
        const appToken = req.headers['x-app-token'] as string;
        if (!appId || !appToken) {
            res.status(401).send('Unauthorized');
            return;
        }

        const app = await App.findOne({ token: appToken });
        if (!app) {
            res.status(401).send('Unauthorized');
            return;
        }

        if (app.token === appToken) {
            res.locals.app = app;
            next();
            return;
        }
    }

    try {
        const tokenInfo = TokenManager.verify(token);
        const user = await User.findOne({ email: tokenInfo.email });
        res.locals.user = user;
    } catch (error) {
        res.status(401).send("Unauthorized");
        return;
    }

    next();
}
