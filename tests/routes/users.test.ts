import * as request from 'supertest';
import app from '../../app';

import { Crypto } from '../../services/Crypto';

const user = {
    email: 'johndoe@fakemail.com',
    password: '123456',
    role: 'owner'
};

process.env.TOKEN_KEY = 'test';
process.env.ACCESS_TOKEN_LIFE_TIME = "3600"
process.env.REFRESH_TOKEN_LIFE_TIME = "864000"
const login = { email: 'teste@login.com', password: '123456' };
let token: string;
beforeAll(async () => {
    await request(app).post('/auth/register').send(login);
    const res = await request(app).post('/auth/login').send(login);
    token = res.body.access;
});
afterAll(async () => {
    await request(app).delete(`/auth/user/${login.email}`).set('Authorization', `Bearer ${token}`);
});

describe('POST /users', () => {
    it('should return a created user', async () => {
        const res = await request(app).post('/users').send(user).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body.email).toEqual(user.email);
        expect(await Crypto.compareHash(`${user.password}`, res.body.password)).toBe(true);
        expect(res.body.role).toEqual(user.role);
    });
});

describe('GET /users', () => {
    it('should return a list of users', async () => {
        const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

describe('GET /users/:email', () => {
    it('should return a user', async () => {
        const res = await request(app).get(`/users/${user.email}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toEqual(user.email);
        expect(await Crypto.compareHash(`${user.password}`, res.body.password)).toBe(true);
        expect(res.body.role).toEqual(user.role);
    });
});

describe('PUT /users/:email', () => {
    it('should return a user', async () => {
        user.role = 'none';
        const res = await request(app).put(`/users/${user.email}`).send(user).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toEqual(user.email);
        expect(await Crypto.compareHash(`${user.password}`, res.body.password)).toBe(true);
        expect(res.body.role).toEqual(user.role);
    });
});

describe('DELETE /users/:email', () => {
    it('should return a user', async () => {
        const res = await request(app).delete(`/users/${user.email}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});
