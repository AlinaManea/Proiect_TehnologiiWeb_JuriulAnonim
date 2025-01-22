import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const VizualizareProiecte = () => {
    const [idProiect, setIdProiect] = useState('');
    const [proiect, setProiect] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setProiect(null);

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // API call to fetch project by id
            const response = await axios.get(`${API_URL}/api/proiect/${idProiect}/livrabile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setProiect(response.data);
        } catch (err) {
            console.error('Error fetching project:', err);

            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (err.response?.status === 404) {
                setError('Proiectul nu a fost găsit.');
            } else {
                setError(err.response?.data?.error || 'A apărut o eroare la încărcarea proiectului.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Vizualizare Proiect</h1>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idProiect">
                    Introduceți ID-ul Proiectului:
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        id="idProiect"
                        value={idProiect}
                        onChange={(e) => setIdProiect(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Ex: 1"
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Caută
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Eroare! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {proiect && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{proiect.titlu}</h2>
                    <p className="text-gray-600 mb-4">
                        <span className="font-medium">Echipa:</span> {proiect.Echipa?.EchipaNume || 'Nespecificată'}
                    </p>

                    <h3 className="text-lg font-medium text-gray-800 mb-2">Livrabile:</h3>
                    {proiect.Livrabile && proiect.Livrabile.length > 0 ? (
                        <div className="grid gap-4">
                            {proiect.Livrabile.map((livrabil) => (
                                <div 
                                    key={livrabil.idLivrabil} 
                                    className="bg-gray-50 rounded-md p-4 hover:bg-gray-100 transition-colors"
                                >
                                    <h4 className="font-medium text-gray-800">{livrabil.numeLivrabil || 'Nespecificat'}</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Data livrare: {new Date(livrabil.dataLivrare).toLocaleDateString('ro-RO')}
                                    </p>
                                    <div className="mt-2 space-y-2">
                                        {livrabil.videoLink && (
                                            <a
                                                href={livrabil.videoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Vizualizează Video
                                            </a>
                                        )}
                                        {livrabil.proiectLink && (
                                            <a
                                                href={livrabil.proiectLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Vezi Proiectul
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Nu există livrabile pentru acest proiect.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VizualizareProiecte;
