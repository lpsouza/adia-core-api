import * as express from 'express';
import routerIndex from './routes/index';
import routerDocs from './routes/docs';
import routerUsers from './routes/users';

const app: express.Application = express();

app.use(express.json());
app.use('/', routerIndex);
app.use('/docs', routerDocs);
app.use('/users', routerUsers);

export default app;
