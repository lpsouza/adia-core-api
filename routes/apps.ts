import * as express from 'express';
const router = express.Router();

import { App } from '../database/models/App';
import { Crypto } from '../services/Crypto';

/**
 * @swagger
 * /apps:
 *  get:
 *   description: Get all apps
 *   responses:
 *    '200':
 *     description: A list of apps found
 *    '404':
 *     description: No one apps found
 */
router.get('/', async (req: express.Request, res: express.Response) => {
    const apps = await App.find();
    if (apps) {
        res.status(200).json(apps);
    } else {
        res.status(404).send('No apps found');
    }
});

/**
 * @swagger
 * /apps/:id:
 *  get:
 *   description: Get a app by id
 *   responses:
 *    '200':
 *     description: App found
 *    '404':
 *     description: App not found
 */
router.get('/:id', async (req: express.Request, res: express.Response) => {
    const app = await App.findOne({ _id: req.params.id });
    if (app) {
        res.status(200).json(app);
    } else {
        res.status(404).send('No app found');
    }
});

/**
 * @swagger
 * /apps:
 *  post:
 *   description: Create a new app
 *   responses:
 *    '201':
 *     description: New app created
 *    '400':
 *     description: App already exists
 */
router.post('/', async (req: express.Request, res: express.Response) => {
    const app = new App(req.body);
    app.token = await Crypto.generateHash(`${app.name}${new Date().getUTCMilliseconds()}`);
    const created = await app.save();
    if (created) {
        res.status(201).json(created);
    } else {
        res.status(404).send('No app created');
    }
});

/**
 * @swagger
 * /apps/:id:
 *  put:
 *   description: Update a app
 *   responses:
 *    '200':
 *     description: App updated
 *    '400':
 *     description: App not found
 */
router.put('/:id', async (req: express.Request, res: express.Response) => {
    const app = await App.findOne({ _id: req.params.id });
    if (app) {
        app.name = req.body.name;
        app.description = req.body.description;
        app.endpoint = req.body.endpoint;
        const updated = await app.save();
        if (updated) {
            res.status(200).json(updated);
        } else {
            res.status(400).send('No app updated');
        }
    } else {
        res.status(400).send('No app found');
    }
});

/**
 * @swagger
 * /apps/:id:
 *  delete:
 *   description: Delete a app
 *   responses:
 *    '200':
 *     description: App deleted
 *    '400':
 *     description: App not found
 */
router.delete('/:id', async (req: express.Request, res: express.Response) => {
    const app = await App.findOneAndDelete({ _id: req.params.id });
    if (app) {
        res.status(200).send('App deleted');
    } else {
        res.status(404).send('No app found');
    }
});

/**
 * @swagger
 * /apps/:id/token:
 *  post:
 *   description: Generate a new app token
 *   responses:
 *    '200':
 *     description: New token generated
 *    '400':
 *     description: App not found
 */
router.post('/:id/token', async (req: express.Request, res: express.Response) => {
    const app = await App.findOne({ _id: req.params.id });
    if (app) {
        app.token = await Crypto.generateHash(`${app.name}${new Date().getUTCMilliseconds()}`);
        const updated = await app.save();
        if (updated) {
            res.status(200).json(updated);
        } else {
            res.status(400).send('No app updated');
        }
    } else {
        res.status(400).send('No app found');
    }
});

export default router;
