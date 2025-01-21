import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InscriereProiect({ state, setState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeProiect: '',
    idEchipa: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aici poți folosi state și setState din props
    setState({
      ...state,
      idEchipa: formData.idEchipa
    });
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="form-container">
      <h2>Înscriere Proiect</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nume Proiect:</label>
          <input
            type="text"
            value={formData.numeProiect}
            onChange={(e) => setFormData({...formData, numeProiect: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>ID Echipă:</label>
          <input
            type="text"
            value={formData.idEchipa}
            onChange={(e) => setFormData({...formData, idEchipa: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Salvează</button>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Înscriere finalizată cu succes!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InscriereProiect;