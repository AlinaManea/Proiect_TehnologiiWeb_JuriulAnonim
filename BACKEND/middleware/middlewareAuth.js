import jwt from 'jsonwebtoken';

// Middleware pentru autentificare (verificarea token-ului)
export const authMiddleware = (req, res, next) => {
    try {
        // Extragem token-ul din header-ul Authorization (formatul "Bearer <token>")
        const token = req.headers.authorization?.split(' ')[1];

        // Dacă token-ul nu există, trimitem un răspuns de eroare
        if (!token) {
            return res.status(401).json({ message: 'Token lipsă' });
        }

        // Decodăm token-ul pentru a obține datele utilizatorului
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adăugăm datele utilizatorului în request-ul curent
        req.user = decoded;

        // Continuăm procesarea cererii
        next();
    } catch (err) {
        // Dacă token-ul nu este valid sau expirat, returnăm eroare
        return res.status(401).json({ message: 'Token invalid sau expirat' });
    }
};

// Middleware pentru verificarea rolului unui utilizator
// Permite accesul doar utilizatorilor cu rolurile specifice
export const checkRole = (roles) => {
    return (req, res, next) => {
        // Verificăm dacă rolul utilizatorului se află în lista de roluri permise
        if (!roles.includes(req.user.UtilizatorRol)) {
            return res.status(403).json({ message: 'Acces interzis. Rol nepermis.' });
        }

        // Dacă rolul este permis, continuăm procesarea cererii
        next();
    };
};



// Middleware pentru autentificarea utilizatorului
// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', ''); 

//     if (!token) {
//         return res.status(401).json({ message: 'Token-ul nu a fost furnizat.' }); 
//     }

//     try {
//         // Verificăm și decodificăm token-ul
//         const decoded = jwt.verify(token, JWT_SECRET); // Decodăm token-ul
//         req.user = decoded; // Adăugăm datele utilizatorului în req.user
//         next(); // Continuăm cu următorul middleware/ruta
//     } catch (err) {
//         return res.status(400).json({ message: 'Token invalid.' }); // Dacă token-ul nu este valid
//     }
// };

export default authMiddleware;
