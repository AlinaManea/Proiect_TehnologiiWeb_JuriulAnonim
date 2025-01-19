import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../dataAccess/AutentificareDA.js';

const routerAuth = express.Router();

// Înregistrare
routerAuth.post('/register',
    [
        body('UtilizatorNume').notEmpty().withMessage('Numele este obligatoriu.'),
        body('UtilizatorEmail').isEmail().withMessage('Introduceți un email valid.'),
        body('UtilizatorParola').isLength({ min: 6 }).withMessage('Parola trebuie să aibă cel puțin 6 caractere.'),
        body('UtilizatorRol').isIn(['student', 'profesor']).withMessage('Rol invalid.'),
    ],
    register
);

// Autentificare
routerAuth.post('/login',
    [
        body('UtilizatorEmail').isEmail().withMessage('Introduceți un email valid.'),
        body('UtilizatorParola').notEmpty().withMessage('Parola este obligatorie.'),
    ],
    login
);

export default routerAuth;
