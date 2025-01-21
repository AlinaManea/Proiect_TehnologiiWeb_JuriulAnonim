import React, { useState, useEffect } from 'react';

function VizualizareNoteProfesor() {
  const [note, setNote] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setNote([
      { id_proiect: 1, titlu_proiect: "Proiect 1", nume_echipa: "Echipa Alpha", nota: 9.5 },
      { id_proiect: 2, titlu_proiect: "Proiect 2", nume_echipa: "Echipa Beta", nota: 9.8 },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Vizualizare Note</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID Proiect</th>
              <th className="px-4 py-2">Titlu Proiect</th>
              <th className="px-4 py-2">Nume Echipă</th>
              <th className="px-4 py-2">Notă</th>
            </tr>
          </thead>
          <tbody>
            {note.map(nota => (
              <tr key={nota.id_proiect} className="border-b">
                <td className="px-4 py-2">{nota.id_proiect}</td>
                <td className="px-4 py-2">{nota.titlu_proiect}</td>
                <td className="px-4 py-2">{nota.nume_echipa}</td>
                <td className="px-4 py-2">{nota.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VizualizareNoteProfesor;