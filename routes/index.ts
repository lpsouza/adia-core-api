import * as express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: Function): void => {
    res.json({});
});

export default router;
