
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
        req.user = decoded;
        next();
    } catch (err) {
        // Dacă token-ul nu este valid sau expirat, returnăm eroare
        return res.status(401).json({ message: 'Token invalid sau expirat' });
    }
};

// Middleware pentru verificarea juriului
// export function juriuMiddleware(req, res, next) {
//     const { idProiect } = req.params;
//     const utilizatorId = req.user.id;

//     // Verifică dacă utilizatorul este în juriul proiectului specific
//     if (juriuSelectat[idProiect] && juriuSelectat[idProiect].includes(utilizatorId)) {
//         return next();
//     }

//     res.status(403).json({ error: 'Acces interzis. Nu faceți parte din juriu.' });
// }

// // Middleware pentru verificarea rolului unui utilizator
// export const checkRole = (roles) => {
//     return (req, res, next) => {
//         // Verificăm dacă rolul utilizatorului se află în lista de roluri permise
//         if (!roles.includes(req.user.UtilizatorRol)) {
//             return res.status(403).json({ message: 'Acces interzis. Rol nepermis.' });
//         }

//         // Dacă rolul este permis, continuăm procesarea cererii
//         next();
//     };
// };

export default authMiddleware;