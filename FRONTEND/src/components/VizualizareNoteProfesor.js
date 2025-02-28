
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function VizualizareNoteProfesor() {
  const [note, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token'); 

        const response = await axios.get(`${API_URL}/api/note-finale`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        setNote(response.data);
        setLoading(false);
      } catch (err) {
        setError('Nu s-au putut încărca notele finale. Încercați din nou.');
        setLoading(false);
      }
    };

    fetchNote();
  }, []);

  return (
    <div className="vizualizare-note-container">
  <h2 className="page-title">Vizualizare Note Finale</h2>

  {loading ? (
    <p className="loading">Se încarcă notele...</p>
  ) : error ? (
    <p className="error-message">{error}</p>
  ) : (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>ID Proiect</th>
            <th>Titlu Proiect</th>
            <th>Nume Echipă</th>
            <th>Notă</th>
          </tr>
        </thead>
        <tbody>
          {note.map((nota, index) => (
            <tr key={nota.idProiect}>
              <td>{nota.idProiect}</td>
              <td>{nota.titluProiect}</td>
              <td>{nota.numeEchipa}</td>
              <td className={nota.notaFinala ? "important" : ""}>
                {nota.notaFinala !== null ? nota.notaFinala : 'Note insuficiente'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
}

export default VizualizareNoteProfesor;
