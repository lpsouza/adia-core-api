import * as express from 'express';
import { DB } from './database/DB';
import routerIndex from './routes/index';
import routerDocs from './routes/docs';
import routerUsers from './routes/users';

const db = DB.getInstance();
const app: express.Application = express();

db.start();
app.use(express.json());
app.use('/', routerIndex);
app.use('/docs', routerDocs);
app.use('/users', routerUsers);

export default app;
