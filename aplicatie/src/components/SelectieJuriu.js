import React, { useState } from 'react';

function SelectieJuriu() {
  const [formData, setFormData] = useState({
    id_proiect: '',
    numar_jurati: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - connect to backend
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Selectie Juriu</h2>
      <div className="bg-white shadow-md rounded p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID Proiect</label>
            <input
              type="text"
              value={formData.id_proiect}
              onChange={(e) => setFormData({...formData, id_proiect: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Număr Jurați</label>
            <input
              type="number"
              value={formData.numar_jurati}
              onChange={(e) => setFormData({...formData, numar_jurati: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Salvează
          </button>
        </form>
      </div>
    </div>
  );
}

export default SelectieJuriu;