import React, { useState, useEffect } from "react"


const VizualizareEchipeProfesor = () => {
  const [echipe, setEchipe] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEchipe = async () => {
      try {
        const response = await fetch("/api/echipa")
        if (!response.ok) throw new Error("Server error")
        const data = await response.json()
        setEchipe(data)
      } catch (err) {
        setError("Eroare la încărcarea echipelor")
      } finally {
        setLoading(false)
      }
    }

    fetchEchipe()
  }, [])

  if (loading) return <div className="loading-spinner">Se încarcă...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="vizualizare-echipe-container">
      <h2 className="page-title">Vizualizare Echipe</h2>
      <div className="echipe-grid">
        {echipe.map((echipa) => (
          <div key={echipa.EchipaId} className="echipa-card">
            <h3 className="echipa-name">{echipa.EchipaNume}</h3>
            <p className="echipa-id">ID Echipă: {echipa.EchipaId}</p>
            <div className="membri-container">
              <h4 className="membri-title">Membri:</h4>
              {echipa.Membri && echipa.Membri.length > 0 ? (
                <ul className="membri-list">
                  {echipa.Membri.map((membru) => (
                    <li key={membru.UtilizatorId} className="membru-item">
                      {membru.UtilizatorNume}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-membri">Niciun membru</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VizualizareEchipeProfesor
