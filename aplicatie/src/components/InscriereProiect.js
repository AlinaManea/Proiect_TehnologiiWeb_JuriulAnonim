// InscriereProiect.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function InscriereProiect({ state, setState }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titlu: '',  // Schimbat din numeProiect în titlu
        EchipaId: state.teamId || '' // Schimbat din idEchipa în EchipaId
    });
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (state.teamId) {
            setFormData(prev => ({
                ...prev,
                EchipaId: state.teamId
            }));
        }
    }, [state.teamId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        const token = localStorage.getItem('token');
        
        // Validare date
        if (!formData.titlu.trim()) {
            setError('Vă rugăm introduceți un titlu valid');
            return;
        }
    
        if (!formData.EchipaId || isNaN(parseInt(formData.EchipaId))) {
            setError('Vă rugăm introduceți un ID de echipă valid');
            return;
        }
    
        try {
            const response = await axios.post(`${API_URL}/api/creareproiect`, {
                titlu: formData.titlu.trim(),
                EchipaId: parseInt(formData.EchipaId)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 201) {
                setShowPopup(true);
                setState(prevState => ({
                    ...prevState,
                    teamId: formData.EchipaId
                }));
    
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            if (error.response) {
                // Erori specifice de la server
                switch (error.response.status) {
                    case 400:
                        setError('Date invalide. Verificați titlul și ID-ul echipei.');
                        break;
                    case 401:
                        setError('Sesiune expirată. Vă rugăm să vă autentificați din nou.');
                        localStorage.removeItem('token');
                        navigate('/login');
                        break;
                    case 403:
                        setError('Nu aveți permisiunea de a crea un proiect.');
                        break;
                    default:
                        setError(error.response.data?.message || 'A apărut o eroare la înregistrarea proiectului');
                }
            } else {
                setError('Eroare de conexiune. Verificați conexiunea la internet.');
            }
            setShowPopup(false);
        }
    };
    
    if (!state.isLoggedIn || state.rol !== 'student') {
        return navigate('/');
    }

    return (
        <div className="form-container">
            <h2>Înscriere Proiect</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nume Proiect:</label>
                    <input
                        type="text"
                        value={formData.titlu}
                        onChange={(e) => setFormData({...formData, titlu: e.target.value})}
                        placeholder="Introduceți numele proiectului"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>ID Echipă:</label>
                    <input
                        type="text"
                        value={formData.EchipaId}
                        onChange={(e) => setFormData({...formData, EchipaId: e.target.value})}
                        placeholder="Introduceți ID-ul echipei"
                        disabled={!!state.teamId}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="submit-btn">
                    Salvează Proiect
                </button>
            </form>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Înscriere finalizată cu succes!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InscriereProiect;