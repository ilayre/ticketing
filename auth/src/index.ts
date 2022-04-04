import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY muse be defined');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to MongoDb');
    }
    catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listeninig on pors 3000');
    });
};

start();