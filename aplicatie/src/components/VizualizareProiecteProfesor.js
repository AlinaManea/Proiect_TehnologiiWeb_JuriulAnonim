import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const VizualizareProiectProfesor = () => {
  const [idProiect, setIdProiect] = useState('');
  const [proiect, setProiect] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setProiect(null);
  
    try {
      // Obține token-ul din localStorage
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error("Token-ul de autentificare este necesar.");
      }
  
      // Adaugă token-ul în header pentru cererea API
      const response = await fetch(`${API_URL}/api/proiect/${idProiect}/livrabile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setProiect(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vizualizare-proiecte-container">
      <h1 className="page-title">Vizualizare Proiect</h1>
      <div className="search-form">
        <label className="form-label" htmlFor="idProiect">
          Introduceți ID-ul Proiectului:
        </label>
        <div className="search-input-group">
          <input
            type="text"
            id="idProiect"
            value={idProiect}
            onChange={(e) => setIdProiect(e.target.value)}
            className="search-input"
            placeholder="Ex: 1"
          />
          <button
            onClick={handleSearch}
            className="search-button"
          >
            Caută
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          <strong>Eroare! </strong>
          <span>{error}</span>
        </div>
      )}

      {proiect && (
        <div className="proiect-card">
          <h2 className="proiect-title">{proiect.titlu}</h2>
          <p className="proiect-echipa">
            <span className="label">Echipa:</span> {proiect.Echipa?.EchipaNume || 'Nespecificată'}
          </p>

          <h3 className="livrabile-title">Livrabile:</h3>
          {proiect.Livrabile && proiect.Livrabile.length > 0 ? (
            <div className="livrabile-grid">
              {proiect.Livrabile.map((livrabil) => (
                <div 
                  key={livrabil.idLivrabil} 
                  className="livrabil-card"
                >
                  <h4 className="livrabil-name">{livrabil.numeLivrabil || 'Nespecificat'}</h4>
                  <p className="livrabil-date">
                    Data livrare: {new Date(livrabil.dataLivrare).toLocaleDateString('ro-RO')}
                  </p>
                  <div className="livrabil-links">
                    {livrabil.videoLink && (
                      <a
                        href={livrabil.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="livrabil-link"
                      >
                        Vizualizează Video
                      </a>
                    )}
                    {livrabil.proiectLink && (
                      <a
                        href={livrabil.proiectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="livrabil-link"
                      >
                        Vezi Proiectul
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-livrabile">Nu există livrabile pentru acest proiect.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VizualizareProiectProfesor;
