import * as request from 'supertest';
import app from '../../app';

import { IUser } from '../../interfaces/IUser';

describe('Successful requests', () => {
    const user: IUser = {
        email: 'johndoe@fakemail.com',
        role: 'owner'
    };
    describe('POST /users', () => {
        it('should return a created user', async () => {
            const res = await request(app).post('/users').send(user);
            expect(res.status).toBe(201);
            expect(res.body.email).toEqual(user.email);
            expect(res.body.role).toEqual(user.role);
        });
    });

    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe('GET /users/:email', () => {
        it('should return a user', async () => {
            const res = await request(app).get(`/users/${user.email}`);
            expect(res.status).toBe(200);
            expect(res.body.email).toEqual(user.email);
            expect(res.body.role).toEqual(user.role);
        });
    });

    describe('PUT /users/:email', () => {
        it('should return a user', async () => {
            user.role = 'none';
            const res = await request(app).put(`/users/${user.email}`).send(user);
            expect(res.status).toBe(200);
            expect(res.body.email).toEqual(user.email);
            expect(res.body.role).toEqual(user.role);
        });
    });

    describe('DELETE /users/:email', () => {
        it('should return a user', async () => {
            const res = await request(app).delete(`/users/${user.email}`);
            expect(res.status).toBe(200);
        });
    });
});
