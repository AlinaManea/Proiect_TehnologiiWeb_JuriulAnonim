// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import API_URL from '../config';

// function VizualizareNoteProfesor() {
//   const [note, setNote] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         setLoading(true);


//         const token = localStorage.getItem('token'); 

    
//         const response = await axios.get(`${API_URL}/api/note-finale`, {
//           headers: {
//             'Authorization': `Bearer ${token}` 
//           }
//         });

//         setNote(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Nu s-au putut încărca notele finale. Încercați din nou.');
//         setLoading(false);
//       }
//     };

//     fetchNote();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Vizualizare Note Finale</h2>

//       {loading ? (
//         <p>Se încarcă notele...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="px-4 py-2">ID Proiect</th>
//                 <th className="px-4 py-2">Titlu Proiect</th>
//                 <th className="px-4 py-2">Nume Echipă</th>
//                 <th className="px-4 py-2">Notă</th>
//               </tr>
//             </thead>
//             <tbody>
//               {note.map((nota) => (
//                 <tr key={nota.idProiect} className="border-b">
//                   <td className="px-4 py-2">{nota.idProiect}</td>
//                   <td className="px-4 py-2">{nota.titluProiect}</td>
//                   <td className="px-4 py-2">{nota.numeEchipa}</td>
//                   <td className="px-4 py-2">{nota.notaFinala !== null ? nota.notaFinala : 'Note insuficiente'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VizualizareNoteProfesor;

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
