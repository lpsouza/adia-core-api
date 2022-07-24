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
    it('should return a error when email is undefined', async () => {
        const res = await request(app).post('/auth/login').send({ password: user.password });
        expect(res.status).toBe(400);
    });
    it('should return a error when password is undefined', async () => {
        const res = await request(app).post('/auth/login').send({ email: user.email });
        expect(res.status).toBe(400);
    });
});

describe('GET /auth/token', () => {
    it('should return the token is valid', async () => {
        const res = await request(app).get('/auth/token').set('Authorization', `Bearer ${token.access}`);
        expect(res.status).toBe(200);
    });
    it('should return a error when token is invalid', async () => {
        const res = await request(app).get('/auth/token').set('Authorization', 'Bearer invalid');
        expect(res.status).toBe(401);
    });
    it('should return a error when token is expired', async () => {
        process.env.ACCESS_TOKEN_LIFE_TIME = "0"
        const login = { email: 'teste@login.com', password: '123456' };
        await request(app).post('/auth/register').send(login);
        const expired = (await request(app).post('/auth/login').send(login)).body.access;
        const res = await request(app).get('/auth/token').set('Authorization', `Bearer ${expired}`);
        expect(res.status).toBe(400);
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
    it('should return a error when refresh token is undefined', async () => {
        const res = await request(app).post('/auth/token').send({});
        expect(res.status).toBe(400);
    });
});
