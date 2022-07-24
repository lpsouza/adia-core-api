import * as request from 'supertest';
import app from '../../app';

process.env.TOKEN_KEY = 'test';
process.env.ACCESS_TOKEN_LIFE_TIME = "3600"
process.env.REFRESH_TOKEN_LIFE_TIME = "864000"

const user = {
    email: 'login@teste.com',
    password: '123456'
};
const token = {
    access: '',
    refresh: '',
    expireDate: ''
}

describe('POST /auth/register', () => {
    it('should return a created user', async () => {
        const res = await request(app).post('/auth/register').send(user);
        expect(res.status).toBe(201);
    });

    it('should return a error when user is already registered', async () => {
        const res = await request(app).post('/auth/register').send(user);
        expect(res.status).toBe(400);
    });

    it('should return a error when email is undefined', async () => {
        const res = await request(app).post('/auth/register').send({
            password: '123456'
        });
        expect(res.status).toBe(400);
    });

    it('should return a error when password is undefined', async () => {
        const res = await request(app).post('/auth/register').send({ email: user.email });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/login', () => {
    it('should return a token', async () => {
        const res = await request(app).post('/auth/login').send(user);
        expect(res.status).toBe(200);
        expect(res.body.access).toBeDefined();
        expect(res.body.refresh).toBeDefined();
        expect(res.body.expireDate).toBeDefined();
        token.access = res.body.access;
        token.refresh = res.body.refresh;
        token.expireDate = res.body.expireDate;
    });
});

describe('GET /auth/token', () => {
    it('should return the token is valid', async () => {
        const res = await request(app).get('/auth/token').set('Authorization', `Bearer ${token.access}`);
        expect(res.status).toBe(200);
    });
});

describe('POST /auth/token', () => {
    it('should return a new token', async () => {
        const refresh = { refreshToken: token.refresh };
        const res = await request(app).post('/auth/token').send(refresh);
        expect(res.status).toBe(200);
        expect(res.body.access).toBeDefined();
        expect(res.body.refresh).toBeDefined();
        expect(res.body.expireDate).toBeDefined();
    });
});
