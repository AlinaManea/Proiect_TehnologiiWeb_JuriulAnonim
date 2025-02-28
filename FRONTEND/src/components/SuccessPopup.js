import React from 'react';

const SuccessPopup = ({ message, isVisible }) => {
  if (!isVisible) return null;
  
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  };

  const popupStyle = {
    backgroundColor: '#ffffff',
    padding: '20px 30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '90%',
    position: 'relative',
    zIndex: 10000
  };

  const titleStyle = {
    color: '#16a34a',
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: 'bold'
  };

  const messageStyle = {
    color: '#4b5563',
    fontSize: '16px',
    textAlign: 'center'
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2 style={titleStyle}>Felicitări!</h2>
        <p style={messageStyle}>{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;