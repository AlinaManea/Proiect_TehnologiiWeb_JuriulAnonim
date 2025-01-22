import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const IncarcareLivrabil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeLivrabil: '',
    dataLivrare: '',
    linkVideo: '',
    linkProiect: ''
  });
  
  const [proiectId, setProiectId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProiectInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Nu sunteți autentificat.');
        return;
      }

      try {
        // Decodificăm token-ul pentru a obține EchipaId
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (!tokenData.echipa) {
          setError('Nu sunteți asociat cu o echipă.');
          return;
        }

        // Căutăm proiectul asociat echipei
        const proiecteResponse = await axios.get(`${API_URL}/api/proiect`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const proiectulEchipei = proiecteResponse.data.find(p => p.EchipaId === tokenData.echipa);
        
        if (proiectulEchipei) {
          setProiectId(proiectulEchipei.idProiect);
        } else {
          setError('Nu aveți un proiect asociat echipei.');
        }
      } catch (err) {
        setError('Eroare la obținerea informațiilor despre proiect.');
        console.error(err);
      }
    };

    getProiectInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token || !proiectId) {
      setError('Nu puteți încărca livrabile în acest moment.');
      setLoading(false);
      return;
    }

    try {
      const formattedData = {
        numeLivrabil: formData.numeLivrabil,
        dataLivrare: new Date(formData.dataLivrare).toISOString(),
        videoLink: formData.linkVideo,
        proiectLink: formData.linkProiect
      };

      const response = await axios.post(
        `${API_URL}/api/proiect/${proiectId}/livrabil`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la încărcarea livrabilului.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Încărcare Livrabil</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nume Livrabil:</label>
          <input
            type="text"
            value={formData.numeLivrabil}
            onChange={(e) => setFormData({ ...formData, numeLivrabil: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Data Livrare:</label>
          <input
            type="date"
            value={formData.dataLivrare}
            onChange={(e) => setFormData({ ...formData, dataLivrare: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Link Video:</label>
          <input
            type="url"
            value={formData.linkVideo}
            onChange={(e) => setFormData({ ...formData, linkVideo: e.target.value })}
            required
            placeholder="https://"
          />
        </div>

        <div className="form-group">
          <label>Link Proiect:</label>
          <input
            type="url"
            value={formData.linkProiect}
            onChange={(e) => setFormData({ ...formData, linkProiect: e.target.value })}
            required
            placeholder="https://"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !proiectId}>
          {loading ? 'Se încarcă...' : 'Salvează'}
        </button>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Livrabil trimis cu succes!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncarcareLivrabil;