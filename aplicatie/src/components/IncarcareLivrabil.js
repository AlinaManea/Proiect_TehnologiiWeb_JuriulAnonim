import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function IncarcareLivrabil({ state, setState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeLivrabil: '',
    dataLivrare: '',
    linkVideo: '',
    linkProiect: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Adăugăm noul livrabil în state
    setState({
      ...state,
      livrabile: [...state.livrabile, formData]
    });

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="form-container">
      <h2>Încărcare Livrabil</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nume Livrabil:</label>
          <input
            type="text"
            value={formData.numeLivrabil}
            onChange={(e) => setFormData({...formData, numeLivrabil: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Data Livrare:</label>
          <input
            type="date"
            value={formData.dataLivrare}
            onChange={(e) => setFormData({...formData, dataLivrare: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Link Video:</label>
          <input
            type="url"
            value={formData.linkVideo}
            onChange={(e) => setFormData({...formData, linkVideo: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Link Proiect:</label>
          <input
            type="url"
            value={formData.linkProiect}
            onChange={(e) => setFormData({...formData, linkProiect: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Salvează</button>
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
}

export default IncarcareLivrabil;