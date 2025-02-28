import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const EvaluareProiect = () => {
  const [proiecte, setProiecte] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProiecte = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Nu sunteți autentificat.');
          return;
        }
    
        const response = await axios.get(
          `${API_URL}/api/proiecte-evaluare`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
    
        console.log('API Response:', response.data);
        setProiecte(response.data);
      } catch (err) {
        console.error('Eroare detaliată:', err);
        setError('Nu s-au putut încărca proiectele pentru evaluare: ' + err.message);
      }
    };

    fetchProiecte();
  }, []);

  const handleNotaChange = (proiectId, value) => {
    const nota = parseFloat(value);
    if (!isNaN(nota) && nota >= 1 && nota <= 10) {
      const formattedNota = Math.round(nota * 100) / 100;
      setNote({
        ...note,
        [proiectId]: formattedNota
      });
    }
  };

  const submitNota = async (proiectId) => {
    if (!note[proiectId]) {
      setError('Vă rugăm să introduceți o notă validă.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/acorda-nota/${proiectId}`,
        { nota: note[proiectId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSuccess(`Nota pentru proiect a fost acordată cu succes!`);
        
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.id;
        const refreshResponse = await axios.get(
          `${API_URL}/api/proiecte-evaluare/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const proiecteNeevaluate = refreshResponse.data.filter(proiect => proiect.Nota === null);
        setProiecte(proiecteNeevaluate);
        
        const newNote = { ...note };
        delete newNote[proiectId];
        setNote(newNote);
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Eroare la acordarea notei:', err);
      setError(err.response?.data?.message || 'Eroare la acordarea notei');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="text-2xl font-bold mb-6">Evaluare Proiecte</h1>
      
      {error && (
        <div className="error-message" style={{
          padding: '10px',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message" style={{
          padding: '10px',
          backgroundColor: '#dcfce7',
          border: '1px solid #22c55e',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {success}
        </div>
      )}

      {proiecte.length === 0 && !error ? (
        <div className="info-message">
          Nu aveți proiecte de evaluat momentan.
        </div>
      ) : (
        proiecte.map((proiect) => (
          <div key={proiect.proiectId} className="project-card" style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h2 className="text-xl font-semibold mb-4">
              Titlu Proiect: {proiect.titlu}
            </h2>
            
            <div className="livrabile-container">
              <h3 className="font-semibold mb-2">Livrabile:</h3>
              {proiect.livrabile?.map((livrabil) => (
                <div key={livrabil.idLivrabil} className="livrabil-item" style={{
                  padding: '10px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  <p className="font-medium">{livrabil.numeLivrabil}</p>
                  {livrabil.videoLink && (
                    <p className="text-sm">
                      Video: <a href={livrabil.videoLink} target="_blank" rel="noopener noreferrer" 
                              style={{color: '#3b82f6', textDecoration: 'underline'}}>
                        Link
                      </a>
                    </p>
                  )}
                  {livrabil.proiectLink && (
                    <p className="text-sm">
                      Proiect: <a href={livrabil.proiectLink} target="_blank" rel="noopener noreferrer" 
                                style={{color: '#3b82f6', textDecoration: 'underline'}}>
                        Link
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="evaluation-container" style={{marginTop: '20px'}}>
              <div className="form-group">
                <label style={{display: 'block', marginBottom: '5px'}}>
                  Notă (1-10, max 2 zecimale):
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.01"
                  value={note[proiect.proiectId] || ''}
                  onChange={(e) => handleNotaChange(proiect.proiectId, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                  placeholder="Introduceți nota"
                />
              </div>
              <button
                onClick={() => submitNota(proiect.proiectId)}
                disabled={loading || !note[proiect.proiectId]}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Se salvează...' : 'Salvează Nota'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EvaluareProiect;