import * as express from 'express';
import routerIndex from './routes/index';
import routerDocs from './routes/docs';

const app: express.Application = express();

app.use(express.json());
app.use('/', routerIndex);
app.use('/docs', routerDocs);

export default app;
