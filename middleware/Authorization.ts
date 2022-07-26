import * as express from 'express';

export const Authorization = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = res.locals.user;
    const app = res.locals.app;
    if (user) {
        if (user.role === 'owner') {
            next();
            return;
        }
        res.status(403).send('Forbidden');
        return;
    }

    if (app) {
        next();
        return;
    }
}
