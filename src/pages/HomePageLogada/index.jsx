import Header from '../../components/Header'
import IndicadorPage from '../IndicadorPage'

export default function HomePageLogada () {
  return <Header>
    <IndicadorPage>
      
    </IndicadorPage>
  </Header>
}

// import React, { useState } from 'react';
// import './styles.css'; // Ensure the path is correct
// import AdminPage from '../AdminPage';
// import UsersPage from '../UsersPage';
// import IndicadorPage from '../IndicadorPage';
// import CadastramentoUsuarioPage from '../CadastramentoUsuarioPage';

// function HomePage() {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState('indicadores');
//   const [adminSubPage, setAdminSubPage] = useState('');

//   const handleDrawerToggle = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const renderAdminSubPage = () => {
//     switch (adminSubPage) {
//       case 'cadastramentoSetor':
//         return <AdminPage />;
//       case 'cadastramentoUsuario':
//         return <CadastramentoUsuarioPage />;
//       default:
//         return <div>Selecione uma opção de administração.</div>;
//     }
//   };

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'indicadores':
//         return <IndicadorPage />;
//       case 'administracao':
//         return (
//           <div>
//             <h2>Administração</h2>
//             <nav className="subNav">
//               <ul>
//                 <li onClick={() => handleAdminSubPageClick('cadastramentoSetor')}>Cadastramento de Setor</li>
//                 <li onClick={() => handleAdminSubPageClick('cadastramentoUsuario')}>Cadastramento de Usuário</li>
//               </ul>
//             </nav>
//             <div className="adminSubPageContent">
//               {renderAdminSubPage()}
//             </div>
//           </div>
//         );
//       case 'usuarios':
//         return (
//           <div>
//             <h2>Usuários</h2>
//             <UsersPage />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   const handleMenuItemClick = (page) => {
//     setCurrentPage(page);
//     setDrawerOpen(false);
//   };

//   const handleAdminSubPageClick = (subPage) => {
//     setAdminSubPage(subPage);
//   };

//   return (
//     <div>
//       <header className="appBar">
//         <button className="menuButton" onClick={handleDrawerToggle}>
//           ☰
//         </button>
//         <h1 className="title">Channel</h1>
//         <div className="userSection">
//           <img
//             alt="Foto do Usuário"
//             src="/path/to/your/image.jpg"
//             className="userAvatar"
//           />
//           <div className="userInfo">
//             <p className="userName">Nome do Usuário</p>
//             <p className="userTitle">Cargo do Usuário</p>
//           </div>
//         </div>
//       </header>

//       <nav className={`drawer ${drawerOpen ? 'open' : ''}`}>
//         <ul>
//           <li onClick={() => handleMenuItemClick('indicadores')}>Indicadores</li>
//           <li onClick={() => handleMenuItemClick('administracao')}>Administração</li>
//           <li onClick={() => handleMenuItemClick('usuarios')}>Usuários</li>
//         </ul>
//       </nav>

//       <main className="mainContent">{renderPage()}</main>
//     </div>
//   );
// }

// export default HomePage;

