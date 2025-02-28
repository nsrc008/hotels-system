import React from "react";
import HotelList from "../components/HotelList";

const Hotels: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-6 shadow-md fixed w-full top-0 z-10">
        <nav className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">
            Hoteles Decameron
          </h1>
        </nav>
      </header>
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-20">
        <HotelList />
      </main>
      <footer className="bg-gray-800 p-4 text-center">
        <p>© 2025 Hoteles Decameron</p>
      </footer>
    </div>
  );
};

export default Hotels;
