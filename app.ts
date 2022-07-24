import * as express from 'express';
import { DB } from './database/DB';
import { AuthMiddleware } from './middleware/auth';

import routerIndex from './routes/index';
import routerDocs from './routes/docs';
import routerAuth from './routes/auth';
import routerUsers from './routes/users';
import routerApps from './routes/apps';

const db = DB.getInstance();
const app: express.Application = express();

db.start();
app.use(express.json());
app.use('/', routerIndex);
app.use('/docs', routerDocs);
app.use('/auth', routerAuth);
app.use('/users', AuthMiddleware, routerUsers);
app.use('/apps', AuthMiddleware, routerApps);

export default app;
