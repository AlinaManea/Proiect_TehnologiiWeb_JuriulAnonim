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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Selectare Juriu</h2>

      <form onSubmit={selecteazaJuriu} className="mb-4">
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            value={idProiect}
            onChange={(e) => setIdProiect(e.target.value)}
            placeholder="ID Proiect"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            value={numarJurati}
            onChange={(e) => setNumarJurati(e.target.value)}
            placeholder="Număr Jurați"
            className="border p-2 rounded"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Selectează Juriu
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded border border-red-200">
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
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Salvează Juriul
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectieJuriu;