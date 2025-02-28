import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente principal que configura el enrutamiento y las notificaciones globales
const App: React.FC = () => {
  return (
    <>
      {/* Configura el enrutamiento con react-router-dom */}
      <Router>
        <Routes>
          {/* Ruta raíz que muestra la lista de hoteles */}
          <Route path="/" element={<Hotels />} />
          {/* Ruta dinámica para detalles de un hotel específico */}
          <Route path="/hoteles/:id" element={<HotelDetail />} />
        </Routes>
      </Router>
      {/* Contenedor de notificaciones de react-toastify, ubicado en la esquina inferior derecha */}
      <ToastContainer
        position="bottom-right" // Posición fija en la parte inferior derecha
        autoClose={3000} // Tiempo en milisegundos antes de cerrar automáticamente
        hideProgressBar={false} // Muestra la barra de progreso
        newestOnTop={false} // Nuevas notificaciones no se apilan encima
        closeOnClick // Cierra al hacer clic
        rtl={false} // Dirección de izquierda a derecha
        pauseOnFocusLoss // Pausa al perder el foco
        draggable // Permite arrastrar
        pauseOnHover // Pausa al pasar el mouse
        theme="light" // Tema claro por defecto
      />
    </>
  );
};

export default App;
