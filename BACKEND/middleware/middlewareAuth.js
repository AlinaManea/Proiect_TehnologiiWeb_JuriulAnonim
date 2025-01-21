
import jwt from 'jsonwebtoken';

// Middleware pentru autentificare 
export const authMiddleware = (req, res, next) => {
    try {
        // Extragem token-ul din header-ul Authorization 
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token lipsă' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            rol: decoded.rol 
        };
        console.log(decoded); 
        req.user = decoded;
        next();
        
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid sau expirat' });
    }
};

// Middleware pentru verificarea rolului unui utilizator
export const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        console.log("Rolul utilizatorului:", userRole); 

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Acces interzis. Rol nepermis.' });
        }

        next();
    };
};

export default authMiddleware;