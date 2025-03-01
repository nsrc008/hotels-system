import React from "react";
import HotelList from "../components/HotelList";

const Hotels: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header elegante con navegación */}
      <header className="bg-indigo-600 text-white p-6 shadow-lg fixed w-full top-0 z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold tracking-tight truncate">
              Hoteles Decameron
            </h1>
          </div>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <HotelList />
      </main>

      {/* Footer elegante */}
      <footer className="bg-gray-900 text-gray-200 py-4 text-center">
        <p className="text-sm font-medium">
          © {new Date().getFullYear()} Hoteles Decameron. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
};

export default Hotels;
