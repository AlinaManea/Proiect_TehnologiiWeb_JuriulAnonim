import axios from 'axios';
import API_URL from '../config';
import React, { useState } from 'react';

const EvaluareProiect = () => {
  const [proiectId, setProiectId] = useState('');
  const [livrabile, setLivrabile] = useState([]);
  const [nota, setNota] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cautaLivrabile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/livrabile/${proiectId}`);
      if (!response.ok) throw new Error('Proiectul nu a fost găsit');
      
      const data = await response.json();
      setLivrabile(data);
    } catch (err) {
      setError(err.message);
      setLivrabile([]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitNota = async (e) => {
    e.preventDefault();
    if (!nota || nota < 1 || nota > 10) {
      setError('Nota trebuie să fie între 1 și 10');
      return;
    }

    try {
      const response = await fetch(`/api/evaluare/${proiectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota })
      });
      
      if (!response.ok) throw new Error('Eroare la salvarea notei');
      setError('Nota a fost salvată cu succes!');
      setNota('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Evaluare Proiect</h2>
      
      <form onSubmit={cautaLivrabile} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={proiectId}
            onChange={(e) => setProiectId(e.target.value)}
            placeholder="Introduceți ID-ul proiectului"
            className="border p-2 rounded flex-grow"
            required
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Se caută...' : 'Caută'}
          </button>
        </div>
      </form>

      {livrabile.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Livrabile găsite:</h3>
          <ul className="border rounded divide-y">
            {livrabile.map((livrabil) => (
              <li key={livrabil.id} className="p-3">
                <p className="font-medium">{livrabil.nume}</p>
                <p className="text-gray-600">{livrabil.descriere}</p>
                <a 
                  href={livrabil.url} 
                  className="text-blue-500 hover:underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Descarcă livrabil
                </a>
              </li>
            ))}
          </ul>

          <form onSubmit={submitNota} className="mt-6">
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Introduceti nota (1-10)"
                className="border p-2 rounded w-40"
                required
              />
              <button 
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Salvează nota
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default EvaluareProiect;