import React, { useState, useEffect } from 'react';

function VizualizareEchipeProfesor() {
  const [echipe, setEchipe] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    setEchipe([
      { echipa_id: "E001", nume_echipa: "Echipa Alpha" },
      { echipa_id: "E002", nume_echipa: "Echipa Beta" },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Vizualizare Echipe</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID Echipă</th>
              <th className="px-4 py-2">Nume Echipă</th>
            </tr>
          </thead>
          <tbody>
            {echipe.map(echipa => (
              <tr key={echipa.echipa_id} className="border-b">
                <td className="px-4 py-2">{echipa.echipa_id}</td>
                <td className="px-4 py-2">{echipa.nume_echipa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VizualizareEchipeProfesor;