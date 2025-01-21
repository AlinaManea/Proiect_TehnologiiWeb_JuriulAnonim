
import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import InscriereProiect from './components/InscriereProiect.js';
import IncarcareLivrabil from './components/IncarcareLivrabil';
import VizualizareProiecte from './components/VizualizareProiecte';
import VizualizareProiecteProfesor from './components/VizualizareProiecteProfesor.js';
import SelectieJuriu from './components/SelectieJuriu';
import VizualizareEchipeProfesor from './components/VizualizareEchipeProfesor.js';
import VizualizareNoteProfesor from './components/VizualizareNoteProfesor.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

function App() {
  const [state, setState] = useState({
    email: '',
    password: '',
    name: '',
    rol: '',
    teamId: '',
    isLoggedIn: false,
    error: null,
    authView: 'login',
  });

  // Componenta pentru protejarea rutelor
  const ProtectedRoute = ({ element: Element, allowedRoles }) => {
    if (!state.isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(state.rol)) {
      return <Navigate to="/" replace />;
    }

    return Element;
  };

  return (
    <Router>
      <div className="App">
        {!state.isLoggedIn ? (
          <div className="auth-container">
            <div className="auth-card">
              {state.authView === 'login' ? (
                <>
                  <Login
                    loginData={state}
                    setLoginData={setState}
                  />
                  <p className="auth-switch">
                    Nu ai cont?{' '}
                    <button 
                      className="link-button"
                      onClick={() => setState(prev => ({ ...prev, authView: 'register' }))}>
                      Înregistrează-te
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <Register
                    registerData={state}
                    setRegisterData={setState}
                    switchToLogin={() => setState(prev => ({ ...prev, authView: 'login' }))}
                  />
                  <p className="auth-switch">
                    Ai deja cont?{' '}
                    <button 
                      className="link-button"
                      onClick={() => setState(prev => ({ ...prev, authView: 'login' }))}>
                      Conectează-te
                    </button>
                  </p>
                </>
              )}
              {state.error && <p className="error">{state.error}</p>}
            </div>
          </div>
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={<Home user={state} onLogout={() => setState(prev => ({ ...prev, isLoggedIn: false }))} />} 
            />
            <Route
              path="/inscriere-proiect"
              element={
                <ProtectedRoute 
                  element={<InscriereProiect state={state} setState={setState} />}
                  allowedRoles={['student']}
                />
              }
            />
            <Route
              path="/incarcare-livrabil"
              element={
                <ProtectedRoute 
                  element={<IncarcareLivrabil state={state} setState={setState} />}
                  allowedRoles={['student']}
                />
              }
            />
            <Route
              path="/vizualizare-proiecte"
              element={
                <ProtectedRoute 
                  element={<VizualizareProiecte />}
                  allowedRoles={['student']}
                />
              }
            />
            <Route
              path="/vizualizare-proiecte-profesor"
              element={
                <ProtectedRoute 
                  element={<VizualizareProiecteProfesor />}
                  allowedRoles={['profesor']}
                />
              }
            />
            <Route
              path="/selectie-juriu"
              element={
                <ProtectedRoute 
                  element={<SelectieJuriu />}
                  allowedRoles={['profesor']}
                />
              }
            />
            <Route
              path="/vizualizare-echipe"
              element={
                <ProtectedRoute 
                  element={<VizualizareEchipeProfesor />}
                  allowedRoles={['profesor']}
                />
              }
            />
            <Route
              path="/vizualizare-note"
              element={
                <ProtectedRoute 
                  element={<VizualizareNoteProfesor />}
                  allowedRoles={['profesor']}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
