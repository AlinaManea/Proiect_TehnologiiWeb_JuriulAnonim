// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Home({ user, onLogout }) {
//   const navigate = useNavigate();

//   const getMenuItems = (rol) => {
//     if (rol === 'student') {
//       return [
//         { id: 'projects', label: 'Înscriere proiect', path: '/inscriere-proiect' },
//         { id: 'livrabile', label: 'Încărcare livrabil', path: '/incarcare-livrabil' },
//         { id: 'vizualizare', label: 'Vizualizare proiect', path: '/vizualizare-proiecte' },
//       ];
//     } else if (rol === 'profesor') {
//       return [
//         { id: 'view-projects', label: 'Vizualizare Proiecte', path: '/vizualizare-proiecte-profesor' },
//         { id: 'jury-selection', label: 'Selectie Juriu', path: '/selectie-juriu' },
//         { id: 'view-teams', label: 'Vizualizare Echipe', path: '/vizualizare-echipe' },
//         { id: 'view-grades', label: 'Vizualizare Note', path: '/vizualizare-note' }
//       ];
//     }
//   };

//   const menuItems = getMenuItems(user.rol);

//   return (
//     <div className="home-layout">
//       <nav className="main-nav">
//         <ul className="nav-links">
//           <li>
//             <button 
//               onClick={() => navigate('/')} 
//               className="nav-link"
//             >
//               Acasă
//             </button>
//           </li>
//           {menuItems.map(item => (
//             <li key={item.id}>
//               <button
//                 onClick={() => navigate(item.path)}
//                 className="nav-link"
//               >
//                 {item.label}
//               </button>
//             </li>
//           ))}
//         </ul>
//         <div className="nav-user">
//           <span className="user-email">{user.email}</span>
//           <span className="user-rol">({user.rol})</span>
//           <button onClick={onLogout} className="logout-btn">
//             Logout
//           </button>
//         </div>
//       </nav>
      
//       <main className="main-content">
//         <div className="welcome-section">
//           <h1>Bine ai venit, {user.name}!</h1>
//           <p>Rol: {user.rol}</p>
//           {user.rol === 'profesor' && (
//             <div className="role-info">
//               <p>Ca profesor, aveți acces la următoarele funcționalități:</p>
//               <ul>
//                 <li>Vizualizarea tuturor proiectelor</li>
//                 <li>Selectarea juriului pentru proiecte</li>
//                 <li>Vizualizarea echipelor</li>
//                 <li>Vizualizarea notelor</li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Home;
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ user, onLogout }) {
  const navigate = useNavigate();

  const getMenuItems = (rol) => {
    if (rol === 'student') {
      return [
        { id: 'projects', label: 'Înscriere proiect', path: '/inscriere-proiect' },
        { id: 'livrabile', label: 'Încărcare livrabil', path: '/incarcare-livrabil' },
        { id: 'vizualizare', label: 'Vizualizare proiect', path: '/vizualizare-proiecte' },
      ];
    } else if (rol === 'profesor') {
      return [
        { id: 'view-projects', label: 'Vizualizare Proiecte', path: '/vizualizare-proiecte-profesor' },
        { id: 'jury-selection', label: 'Selectie Juriu', path: '/selectie-juriu' },
        { id: 'view-teams', label: 'Vizualizare Echipe', path: '/vizualizare-echipe' },
        { id: 'view-grades', label: 'Vizualizare Note', path: '/vizualizare-note' }
      ];
    }
    return []; // În caz că rolul nu este definit, returnăm o listă goală
  };

  const menuItems = getMenuItems(user.rol);

  return (
    <div className="home-layout">
      <nav className="main-nav">
        <ul className="nav-links">
          <li>
            <button 
              onClick={() => navigate('/')} 
              className="nav-link"
            >
              Acasă
            </button>
          </li>
          {/* Verificăm dacă există elemente în menuItems înainte de a aplica map */}
          {menuItems && menuItems.length > 0 ? (
            menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className="nav-link"
                >
                  {item.label}
                </button>
              </li>
            ))
          ) : (
            <p>Nu sunt disponibile opțiuni pentru acest rol.</p>
          )}
        </ul>
        <div className="nav-user">
          <span className="user-email">{user.email}</span>
          <span className="user-rol">({user.rol})</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        <div className="welcome-section">
          <h1>Bine ai venit, {user.name}!</h1>
          <p>Rol: {user.rol}</p>
          {user.rol === 'profesor' && (
            <div className="role-info">
              <p>Ca profesor, aveți acces la următoarele funcționalități:</p>
              <ul>
                <li>Vizualizarea tuturor proiectelor</li>
                <li>Selectarea juriului pentru proiecte</li>
                <li>Vizualizarea echipelor</li>
                <li>Vizualizarea notelor</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
