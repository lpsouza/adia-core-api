import * as express from 'express';
import { ITokenInfo } from '../database/interfaces/ITokenInfo';
const router = express.Router();

import { Crypto } from '../services/Crypto';
import { TokenManager } from '../services/TokenManager';

import { User } from '../database/models/User';

router.post('/register', async (req, res) => {
    const user = new User(req.body);

    if (!user.email || !user.password) {
        res.status(400).send('Invalid user data');
        return;
    }

    const userInDB = await User.findOne({ email: user.email });

    if (userInDB) {
        res.status(400).send('User already exists');
        return;
    }

    user.password = await Crypto.generateHash(user.password);
    user.role = (await User.find()).length === 0 ? 'owner' : 'none';
    await user.save();

    res.status(201).send('User created');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send('Invalid user data');
        return;
    }

    const userInDB = await User.findOne({ email: email });

    if (!userInDB) {
        res.status(400).send('User not found');
        return;
    }

    const isValid = await Crypto.compareHash(password, userInDB.password);

    let token: ITokenInfo;
    if (!isValid) {
        res.status(400).send('Invalid password');
        return;
    } else {
        token = {
            access: TokenManager.generate({ email: userInDB.email }, parseInt(process.env.ACCESS_TOKEN_LIFE_TIME)),
            refresh: TokenManager.generate({ email: userInDB.email }, parseInt(process.env.REFRESH_TOKEN_LIFE_TIME)),
            expireDate: new Date(Date.now() + parseInt(process.env.ACCESS_TOKEN_LIFE_TIME) * 1000)
        }
        userInDB.token = token;
    }
    userInDB.save();
    res.status(200).json(token);
});

router.get('/token', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(400).send('Token not found');
        return;
    }
    const user = await User.findOne({ 'token.access': token });
    if (!user) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        TokenManager.verify(token);
    } catch (error) {
        switch (error.message) {
            case "jwt expired":
                res.status(400).send('Token expired');
                break;

            default:
                res.status(400).send(error.message);
                break;
        }
        return;
    }

    res.status(200).send('Token valid');
});

router.post('/token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).send('Token not found');
        return;
    }
    const user = await User.findOne({ 'token.refresh': refreshToken });
    if (!user) {
        res.status(400).send('Invalid token');
        return;
    }

    try {
        TokenManager.verify(refreshToken);
    } catch (error) {
        switch (error.message) {
            case "jwt expired":
                res.status(400).send('Token expired');
                break;

            default:
                res.status(400).send(error.message);
                break;
        }
        return;
    }

    const newToken = {
        access: TokenManager.generate({ email: user.email }, parseInt(process.env.ACCESS_TOKEN_LIFE_TIME)),
        refresh: TokenManager.generate({ email: user.email }, parseInt(process.env.REFRESH_TOKEN_LIFE_TIME)),
        expireDate: new Date(Date.now() + parseInt(process.env.ACCESS_TOKEN_LIFE_TIME) * 1000)
    }
    user.token = newToken;
    user.save();
    res.status(200).json(newToken);
});

export default router;
