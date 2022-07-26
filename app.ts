import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import { DB } from './database/DB';

import { Authentication } from './middleware/Authentication';
import { Authorization } from './middleware/Authorization';

import routerIndex from './routes/index';
import routerDocs from './routes/docs';
import routerAuth from './routes/auth';
import routerUsers from './routes/users';
import routerApps from './routes/apps';

const db = DB.getInstance();
const app: express.Application = express();

db.start();
app.use(express.json());
app.use(morgan('combined'));

if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}

app.use('/', routerIndex);
app.use('/docs', routerDocs);
app.use('/auth', routerAuth);
app.use('/users', Authentication, Authorization, routerUsers);
app.use('/apps', Authentication, Authorization, routerApps);

export default app;
