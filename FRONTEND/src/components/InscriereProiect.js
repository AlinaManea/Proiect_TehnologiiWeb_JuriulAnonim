import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import SuccessPopup from './SuccessPopup';

function InscriereProiect({ state = {}, setState }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titlu: '',
        EchipaId: ''
    });
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
     
        if (state?.teamId) {
            setFormData(prev => ({
                ...prev,
                EchipaId: state.teamId
            }));
        }
    }, [state?.teamId]);

    useEffect(() => {
     
        if (state && (state.isLoggedIn === false || state.rol !== 'student')) {
            navigate('/');
        }
    }, [state?.isLoggedIn, state?.rol, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Sesiune expirată. Vă rugăm să vă autentificați din nou.');
            navigate('/login');
            return;
        }

        if (!formData.titlu.trim()) {
            setError('Vă rugăm introduceți un titlu valid.');
            return;
        }

        if (!formData.EchipaId || isNaN(parseInt(formData.EchipaId))) {
            setError('Vă rugăm introduceți un ID de echipă valid.');
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
                console.log('Proiect creat cu succes!');
                setShowPopup(true); 
                setState(prevState => ({
                    ...prevState,
                    teamId: formData.EchipaId
                }));
            
               
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            console.error('Eroare:', error);
            if (error.response) {
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
                        setError(error.response.data?.message || 'A apărut o eroare la înregistrarea proiectului.');
                }
            } else {
                setError('Eroare de conexiune. Verificați conexiunea la internet.');
            }
            setShowPopup(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Înscriere Proiect</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titlu Proiect:</label>
                    <input
                        type="text"
                        value={formData.titlu}
                        onChange={(e) => setFormData({...formData, titlu: e.target.value})}
                        placeholder="Introduceți titlul proiectului"
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
                        disabled={!!state?.teamId}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="submit-btn">
                    Salvează Proiect
                </button>
            </form>

            <SuccessPopup 
                isVisible={showPopup} 
                message="Înscriere finalizată cu succes!"
            />
        </div>
    );
}

export default InscriereProiect;