import React, { useState, useEffect } from 'react';

function VizualizareProiecteProfesor() {
  const [proiecte, setProiecte] = useState([]);

  useEffect(() => {
    setProiecte([
      { id_proiect: 1, titlu_proiect: "Proiect 1", echipa_id: "E001" },
      { id_proiect: 2, titlu_proiect: "Proiect 2", echipa_id: "E002" },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Vizualizare Proiecte</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID Proiect</th>
              <th className="px-4 py-2">Titlu Proiect</th>
              <th className="px-4 py-2">ID Echipă</th>
            </tr>
          </thead>
          <tbody>
            {proiecte.map(proiect => (
              <tr key={proiect.id_proiect} className="border-b">
                <td className="px-4 py-2">{proiect.id_proiect}</td>
                <td className="px-4 py-2">{proiect.titlu_proiect}</td>
                <td className="px-4 py-2">{proiect.echipa_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VizualizareProiecteProfesor;