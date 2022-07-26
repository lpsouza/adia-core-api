import * as request from 'supertest';
import app from '../../app';

const appTest = {
    name: 'Test App',
    description: 'Test App Description',
    endpoint: 'http://localhost:3000'
}

process.env.TOKEN_KEY = 'test';
process.env.ACCESS_TOKEN_LIFE_TIME = "3600"
process.env.REFRESH_TOKEN_LIFE_TIME = "864000"
const login = { email: 'teste@login.com', password: '123456' };
let token: string;
let appToken: string;
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
        const res = await request(app).post('/apps').send(appTest).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body.name).toEqual(appTest.name);
        expect(res.body.description).toEqual(appTest.description);
        expect(res.body.endpoint).toEqual(appTest.endpoint);
        appToken = res.body.token;
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
        expect(res.body.name).toEqual(appTest.name);
        expect(res.body.description).toEqual(appTest.description);
        expect(res.body.endpoint).toEqual(appTest.endpoint);
        expect(res.body.token).toEqual(appToken);
    });
});

describe('PUT /apps/:id', () => {
    it('should return a updated app', async () => {
        appTest.name = 'Test App Updated';
        appTest.description = 'Test App Description Updated';
        const res = await request(app).put(`/apps/${id}`).send(appTest).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual(appTest.name);
        expect(res.body.description).toEqual(appTest.description);
        expect(res.body.endpoint).toEqual(appTest.endpoint);
        expect(res.body.token).toEqual(appToken);
    });
});

describe('POST /apps/:id/token', () => {
    it('should set a new token', async () => {
        const res = await request(app).post(`/apps/${id}/token`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual(appTest.name);
        expect(res.body.description).toEqual(appTest.description);
        expect(res.body.endpoint).toEqual(appTest.endpoint);
        expect(res.body.token).not.toEqual(appToken);
    });
});

describe('DELETE /apps/:id', () => {
    it('should return a deleted app', async () => {
        const res = await request(app).delete(`/apps/${id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});
