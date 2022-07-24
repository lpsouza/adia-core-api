import * as request from 'supertest';
import app from '../../app';

import { IApp } from '../../database/interfaces/IApp';
const newApp: IApp = {
    name: 'Test App',
    description: 'Test App Description',
    endpoint: 'http://localhost:3000'
}

process.env.TOKEN_KEY = 'test';
process.env.ACCESS_TOKEN_LIFE_TIME = "3600"
process.env.REFRESH_TOKEN_LIFE_TIME = "864000"
const login = { email: 'teste@login.com', password: '123456' };
let token: string;
let id: string;
beforeAll(async () => {
    await request(app).post('/auth/register').send(login);
    const res = await request(app).post('/auth/login').send(login);
    token = res.body.access;
});
afterAll(async () => {
    await request(app).delete(`/auth/user/${login.email}`).set('Authorization', `Bearer ${token}`);
});

describe('POST /apps', () => {
    it('should return a created app', async () => {
        const res = await request(app).post('/apps').send(newApp).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body.name).toEqual(newApp.name);
        expect(res.body.description).toEqual(newApp.description);
        expect(res.body.endpoint).toEqual(newApp.endpoint);
        id = res.body._id;
    });
});

describe('GET /apps', () => {
    it('should return a list of apps', async () => {
        const res = await request(app).get('/apps').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('GET /apps/:id', () => {
    it('should return a app', async () => {
        const res = await request(app).get(`/apps/${id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual(newApp.name);
        expect(res.body.description).toEqual(newApp.description);
        expect(res.body.endpoint).toEqual(newApp.endpoint);
    });
});

describe('PUT /apps/:id', () => {
    it('should return a updated app', async () => {
        const updateApp: IApp = {
            name: 'Test App Updated',
            description: 'Test App Description Updated',
            endpoint: 'http://localhost:3000'
        }
        const res = await request(app).put(`/apps/${id}`).send(updateApp).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual('Test App Updated');
    });
});

describe('DELETE /apps/:id', () => {
    it('should return a deleted app', async () => {
        const res = await request(app).delete(`/apps/${id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});