import React from 'react';
import axios from 'axios';
import API_URL from '../config'; 



function Register({ registerData, setRegisterData, switchToLogin }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validarea datelor de intrare
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.rol) {
      alert('Toate câmpurile sunt obligatorii!');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        UtilizatorNume: registerData.name,
        UtilizatorEmail: registerData.email,
        UtilizatorParola: registerData.password,
        UtilizatorRol: registerData.rol,
        EchipaId: registerData.rol === 'student' ? registerData.teamId : null,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true  
      });
      
      
      if (response.status === 201) {
          alert('Înregistrare reușită! Te poți conecta acum.');
          switchToLogin();
      }
  } catch (error) {
      console.error('Eroare completă:', error);
      if (error.response) {
        
          console.error('Date eroare:', error.response.data);
          console.error('Status:', error.response.status);
          alert(`Eroare: ${error.response.data.message || 'Eroare la înregistrare'}`);
      } else if (error.request) {
          
          console.error('Nu s-a primit răspuns de la server');
          alert('Nu s-a putut stabili conexiunea cu serverul');
      } else {
          // Ceva a declanșat o eroare la setarea cererii
          console.error('Eroare:', error.message);
          alert('Eroare la trimiterea cererii');
      }
  }}

  return (
    <div className="auth-form">
      <h2>Înregistrare</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nume complet:</label>
          <input
            type="text"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                name: e.target.value,
              })
            }
            placeholder="Introdu numele complet"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                email: e.target.value,
              })
            }
            placeholder="Introdu email-ul"
            required
          />
        </div>

        <div className="form-group">
          <label>Rol:</label>
          <select
  onChange={(e) =>
    setRegisterData({
      ...registerData,
      rol: e.target.value,
    })
  }
  value={registerData.rol}  
  required
>
  <option value="" disabled>
    Alege un rol
  </option>
  <option value="student">Student</option>
  <option value="profesor">Profesor</option>
</select>

        </div>

        {registerData.rol === 'student' && (
          <div className="form-group">
            <label>ID Echipă:</label>
            <input
              type="number"
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  teamId: e.target.value,
                })
              }
              placeholder="Introdu ID-ul echipei"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Parolă:</label>
          <input
            type="password"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password: e.target.value,
              })
            }
            placeholder="Introdu parola"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Înregistrare
        </button>
      </form>
    </div>
  );
}

export default Register;