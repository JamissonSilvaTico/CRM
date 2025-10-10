import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-4">
      <div className="text-center mb-16 font-serif">
        <p className="font-sans text-2xl tracking-[0.2em] uppercase">Studio</p>
        <h1 className="text-7xl md:text-8xl font-normal">Juciele</h1>
        <h2 className="text-7xl md:text-8xl italic font-normal">Marques</h2>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/clientes"
          className="px-10 py-3 border-2 border-white rounded-lg text-lg font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300 text-center"
        >
          Clientes
        </Link>
        <Link
          to="/agendamentos"
          className="px-10 py-3 border-2 border-white rounded-lg text-lg font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300 text-center"
        >
          Agendamentos
        </Link>
        <Link
          to="/pos-producao"
          className="px-10 py-3 border-2 border-white rounded-lg text-lg font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300 text-center"
        >
          Pós-produção
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
