import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const EvaluareProiect = () => {
  const [proiecte, setProiecte] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState('');
  const [proiectSelectat, setProiectSelectat] = useState(null);

  useEffect(() => {
    const fetchProiecteEvaluare = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Nu sunteți autentificat.');
            setLoading(false);
            return;
        }

        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenData.id; // ID utilizator din token
            console.log("Fetching projects for user ID:", userId); // DEBUG

            const response = await axios.get(`${API_URL}/api/proiecte-evaluare/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Projects response:", response.data); // DEBUG
            setProiecte(response.data);
        } catch (err) {
            console.error("Error fetching projects:", err.message); // DEBUG
            setError('Eroare la preluarea proiectelor pentru evaluare.');
        } finally {
            setLoading(false);
        }
    };

    fetchProiecteEvaluare();
}, []);


  const acordaNota = async (proiectId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Nu sunteți autentificat.');
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/acorda-nota/${proiectId}`,
        { nota },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Actualizăm starea proiectelor pentru a reflecta nota acordată
      setProiecte((prevProiecte) =>
        prevProiecte.map((proiect) =>
          proiect.proiectId === proiectId ? { ...proiect, nota: response.data.Nota } : proiect
        )
      );

      setNota('');
      setProiectSelectat(null);
      setError('');
    } catch (err) {
      setError('Eroare la acordarea notei.');
      console.error(err);
    }
  };

  return (
    <div className="evaluare-proiect">
      <h2>Proiectele atribuite pentru evaluare</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Se încarcă...</p>}
      {proiecte.length > 0 ? (
        <ul>
          {proiecte.map((proiect) => (
            <li key={proiect.proiectId}>
              <h3>{proiect.titlu}</h3>
              <p><strong>ID Proiect:</strong> {proiect.proiectId}</p>
              <h4>Livrabile:</h4>
              <ul>
                {proiect.livrabile.map((livrabil) => (
                  <li key={livrabil.idLivrabil}>
                    {livrabil.numeLivrabil} -{' '}
                    <a href={livrabil.proiectLink} target="_blank" rel="noopener noreferrer">
                      Vizualizează proiect
                    </a>
                  </li>
                ))}
              </ul>
              {proiectSelectat === proiect.proiectId ? (
                <div>
                  <input
                    type="number"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Adaugă o notă (1-10)"
                    min="1"
                    max="10"
                    className="border p-2 rounded mb-2"
                  />
                  <button
                    onClick={() => acordaNota(proiect.proiectId)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Salvează Nota
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setProiectSelectat(proiect.proiectId)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Adaugă o Notă
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu aveți proiecte de evaluat.</p>
      )}
    </div>
  );
};

export default EvaluareProiect;
