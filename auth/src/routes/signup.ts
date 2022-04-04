import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

const validation = [
    body('email').isEmail().withMessage('Email not valid'), 
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4-20 characters') 
];

router.post('/api/users/signup', validation, validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new BadRequestError('Email already in use');
    }
    
    const user = User.build({ email, password });
    await user.save();

    //Generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email    
    }, process.env.JWT_KEY! );

    //Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export { router as signupRouter };