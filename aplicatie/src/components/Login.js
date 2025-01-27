import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Login({ loginData, setLoginData }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

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
        const { user, token } = response.data;

        localStorage.setItem('token', token);

        setLoginData(prevState => ({
          ...prevState,
          isLoggedIn: true,
          name: user.name,
          rol: user.rol,
          email: user.email,
          teamId: user.teamId,
          password: '' 
        }));

    
        setShowPopup(true);

       
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 2000);
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

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Autentificare reușită! Redirecționare...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
