import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Utilizator from '../entities/Utilizator.js';

const JWT_SECRET = process.env.JWT_SECRET; 

// Înregistrare
export const register = async (req, res) => {
    const { UtilizatorNume, UtilizatorEmail, UtilizatorParola, UtilizatorRol, EchipaId } = req.body;

    try {
        const existingUser = await Utilizator.findOne({ where: { UtilizatorEmail } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email-ul este deja folosit.' });
        }

        // hashuire parola
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(UtilizatorParola, salt);

        // creare utilizator
        const newUser = await Utilizator.create({
            UtilizatorNume,
            UtilizatorEmail,
            UtilizatorParola: hashedPassword,
            UtilizatorRol,
            EchipaId: UtilizatorRol === 'student' ? EchipaId : null, 
        });

        return res.status(201).json({ message: 'Utilizator înregistrat cu succes!', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Eroare la înregistrare.' });
    }
};

// Autentificare
export const login = async (req, res) => {
    const { UtilizatorEmail, UtilizatorParola } = req.body;

    try {
        const user = await Utilizator.findOne({ where: { UtilizatorEmail } });
        if (!user) {
            return res.status(400).json({ message: 'Utilizator sau parolă incorectă.' });
        }

        const isPasswordValid = await bcrypt.compare(UtilizatorParola, user.UtilizatorParola);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Utilizator sau parolă incorectă.' });
        }

        const token = jwt.sign(
            {
                id: user.UtilizatorId,
                role: user.UtilizatorRol,
                echipa: user.EchipaId,
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Trimitem și datele utilizatorului împreună cu token-ul
        return res.status(200).json({ 
            message: 'Autentificare reușită!', 
            token,
            user: {
                name: user.UtilizatorNume,
                email: user.UtilizatorEmail,
                rol: user.UtilizatorRol,
                teamId: user.EchipaId
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Eroare la autentificare.' });
    }
};