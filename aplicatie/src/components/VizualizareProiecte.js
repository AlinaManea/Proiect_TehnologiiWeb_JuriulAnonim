function VizualizareProiecte({ livrabile }) {
    return (
      <div className="livrabile-container">
        <h2>Livrabilele Mele</h2>
        {livrabile.length === 0 ? (
          <p className="no-livrabile">Nu există livrabile încărcate.</p>
        ) : (
          <div className="livrabile-list">
            {livrabile.map((livrabil, index) => (
              <div key={index} className="livrabil-card">
                <h3>{livrabil.numeLivrabil}</h3>
                <p><strong>Data livrare:</strong> {livrabil.dataLivrare}</p>
                <div className="livrabil-links">
                  <a href={livrabil.linkVideo} target="_blank" rel="noopener noreferrer">
                    Vezi Video
                  </a>
                  <a href={livrabil.linkProiect} target="_blank" rel="noopener noreferrer">
                    Vezi Proiect
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default VizualizareProiecte;