import * as express from 'express';
const router = express.Router();

import { Crypto } from '../services/Crypto';

import { User } from '../database/models/User';

/**
 * @swagger
 * /users:
 *  get:
 *   description: Get all users
 *   responses:
 *    '200':
 *     description: A list of users found
 *    '404':
 *     description: No one users found
 */
router.get('/', async (req: express.Request, res: express.Response) => {
    const users = await User.find();
    if (users) {
        res.status(200).json(users);
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
 *     description: User found
 *    '404':
 *     description: User not found
 */
router.get('/:email', async (req: express.Request, res: express.Response) => {
    const users = await User.findOne({ email: req.params.email });
    if (users) {
        res.status(200).json(users);
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
 *     description: New user created
 *    '400':
 *     description: Bad request
 */
router.post('/', async (req: express.Request, res: express.Response) => {
    const user = new User(req.body);
    user.password = await Crypto.generateHash(user.password);
    user.role = user.role !== undefined ? user.role : 'none';
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
 *     description: User updated successfully
 *    '400':
 *     description: Bad request
 */
router.put('/:email', async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
        user.password = req.body.password ? await Crypto.generateHash(req.body.password) : user.password;
        user.role = req.body.role ? req.body.role : user.role;
        user.telegram = req.body.telegram ? req.body.telegram : user.telegram;
        user.token = req.body.token ? req.body.token : user.token;
        const updated = await user.save();
        if (updated) {
            res.status(200).json(user);
        } else {
            res.status(400).send('Bad request');
        }
    } else {
        res.status(404).send('No user found');
    }
});

/**
 * @swagger
 * /users/:email:
 *  delete:
 *   description: Delete a user
 *   responses:
 *    '200':
 *     description: User is successfully deleted
 *    '404':
 *     description: User not found
 */
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
