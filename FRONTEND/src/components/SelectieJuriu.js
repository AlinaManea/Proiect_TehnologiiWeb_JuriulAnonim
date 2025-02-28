
import React, { useState } from 'react';

const SelectieJuriu = () => {
  const [idProiect, setIdProiect] = useState('');
  const [numarJurati, setNumarJurati] = useState('');
  const [juratiSelectati, setJuratiSelectati] = useState(null);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const selecteazaJuriu = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch(`/api/selecteaza-juriu/${idProiect}/${numarJurati}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la selectarea juriului');
      }

      const data = await response.json();
      setJuratiSelectati(data.jurati);
    } catch (err) {
      setError(err.message);
      console.error('Eroare la selectarea juriului:', err);
    }
  };

  const salveazaJuriu = async () => {
    if (!juratiSelectati) return;

    try {
      const response = await fetch('/api/adauga-juriu', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          idProiect,
          jurati: juratiSelectati
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la salvarea juriului');
      }

      const data = await response.json();
      console.log('Juriul a fost salvat cu succes:', data);
      
      setJuratiSelectati(null);
      setIdProiect('');
      setNumarJurati('');
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Eroare la salvarea juriului:', err);
    }
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Selectare Juriu</h2>

      <form onSubmit={selecteazaJuriu} className="search-form">
        <div className="search-input-group mb-4">
          <input
            type="number"
            value={idProiect}
            onChange={(e) => setIdProiect(e.target.value)}
            placeholder="ID Proiect"
            className="search-input"
            required
          />
          <input
            type="number"
            value={numarJurati}
            onChange={(e) => setNumarJurati(e.target.value)}
            placeholder="Număr Jurați"
            className="search-input"
            required
          />
          <button 
            type="submit" 
            className="search-button"
          >
            Selectează Juriu
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {juratiSelectati && (
        <div className="mt-4">
          <h3 className="text-xl mb-2">Jurați Selectați:</h3>
          <ul className="list-disc pl-5 mb-4">
            {juratiSelectati.map(juratId => (
              <li key={juratId}>ID Jurat: {juratId}</li>
            ))}
          </ul>
          <button
            onClick={salveazaJuriu}
            className="action-btn"
          >
            Salvează Juriul
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectieJuriu;
