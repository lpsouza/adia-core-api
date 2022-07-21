import * as express from 'express';
const router = express.Router();

import { User } from '../models/User';

import { DB } from '../services/DB';
const db = DB.getInstance();
db.start();

/**
 * @swagger
 * /users:
 *  get:
 *   description: Get all users
 *   responses:
 *    '200':
 *     description: A successful response
 */
router.get('/', async (req: express.Request, res: express.Response) => {
    const users = await User.find();
    if (users) {
        res.json(users);
    } else {
        res.status(404).send('No users found');
    }
});

/**
 * @swagger
 * /users/:email:
 *  get:
 *   description: Get a user by id
 *   responses:
 *    '200':
 *     description: A successful response
 */
router.get('/:email', async (req: express.Request, res: express.Response) => {
    const users = await User.findOne({ email: req.params.email });
    if (users) {
        res.json(users);
    } else {
        res.status(404).send('No user found');
    }
});

/**
 * @swagger
 * /users:
 *  post:
 *   description: Create a new user
 *   responses:
 *    '201':
 *     description: A successful response
 */
router.post('/', async (req: express.Request, res: express.Response) => {
    const user = new User(req.body);
    const created = await user.save();
    if (created) {
        res.status(201).json(user);
    } else {
        res.status(400).send('Bad request');
    }
});


/**
 * @swagger
 * /users/:email:
 *  put:
 *   description: Update a user
 *   responses:
 *    '200':
 *      description: A successful response
 */
router.put('/:email', async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
        user.email = req.body.email;
        user.role = req.body.role;
        const updated = await user.save();
        if (updated) {
            res.json(user);
        } else {
            res.status(400).send('Bad request');
        }
    } else {
        res.status(404).send('No user found');
    }
});

router.delete('/:email', async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
        await user.remove();
        res.status(200).send('User deleted');
    } else {
        res.status(404).send('No user found');
    }
});

export default router;
