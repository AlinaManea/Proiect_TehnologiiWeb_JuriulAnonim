// import React from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import API_URL from '../config';

// function Login({ loginData, setLoginData, switchToRegister }) {
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!loginData.email || !loginData.password) {
//       alert('Toate câmpurile sunt obligatorii!');
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         UtilizatorEmail: loginData.email,
//         UtilizatorParola: loginData.password,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         const userData = response.data;
//         // Actualizăm starea cu datele utilizatorului
//         setLoginData((prevState) => ({
//           ...prevState,
//           isLoggedIn: true,
//           name: userData.name,
//           rol: userData.role, // Preluăm rolul
//           email: userData.email,
//           teamId: userData.teamId,
//         }));

//         // Redirecționăm utilizatorul în funcție de rol
//         if (userData.role === 'student') {
//           navigate('/vizualizare-proiecte');
//         } else if (userData.role === 'profesor') {
//           navigate('/vizualizare-proiecte-profesor');
//         }
//       }
//     } catch (error) {
//       console.error('Eroare completă:', error);
//       if (error.response) {
//         alert(`Eroare: ${error.response.data.message || 'Eroare la autentificare'}`);
//       } else if (error.request) {
//         alert('Nu s-a putut stabili conexiunea cu serverul');
//       } else {
//         alert('Eroare la trimiterea cererii');
//       }
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>Conectare</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             value={loginData.email}
//             onChange={(e) =>
//               setLoginData({
//                 ...loginData,
//                 email: e.target.value,
//               })
//             }
//             placeholder="Introdu email-ul"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Parolă:</label>
//           <input
//             type="password"
//             value={loginData.password}
//             onChange={(e) =>
//               setLoginData({
//                 ...loginData,
//                 password: e.target.value,
//               })
//             }
//             placeholder="Introdu parola"
//             required
//           />
//         </div>

//         <button type="submit" className="auth-button">
//           Conectare
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Login({ loginData, setLoginData, switchToRegister }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert('Toate câmpurile sunt obligatorii!');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        UtilizatorEmail: loginData.email,
        UtilizatorParola: loginData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.status === 200) {
        const userData = response.data;
        // Actualizăm starea cu datele utilizatorului
        setLoginData(prevState => ({
          ...prevState,
          isLoggedIn: true,
          name: userData.name,
          rol: userData.rol,
          email: userData.email,
          teamId: userData.teamId
        }));

        // Redirecționăm către pagina corespunzătoare rolului
        navigate('/');
      }
    } catch (error) {
      console.error('Eroare completă:', error);
      if (error.response) {
        alert(`Eroare: ${error.response.data.message || 'Eroare la autentificare'}`);
      } else if (error.request) {
        alert('Nu s-a putut stabili conexiunea cu serverul');
      } else {
        alert('Eroare la trimiterea cererii');
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Conectare</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({
              ...loginData,
              email: e.target.value
            })}
            placeholder="Introdu email-ul"
            required
          />
        </div>

        <div className="form-group">
          <label>Parolă:</label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({
              ...loginData,
              password: e.target.value
            })}
            placeholder="Introdu parola"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Conectare
        </button>
      </form>
    </div>
  );
}

export default Login;
