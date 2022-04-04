import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'randomjwt'
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});


afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

export const signin = async () => {
   
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email, password
    })
    .expect(201);

    const coockie = response.get('Set-Coockie');

    return coockie; 
};


