import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const activeLinkClass = "bg-blue-600 text-white";
  const inactiveLinkClass = "text-gray-200 hover:bg-blue-800 hover:text-white";

  return (
    <header className="bg-blue-700 shadow-md">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink
              to="/"
              className="flex items-center text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white rounded-md p-1"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-2 text-2xl font-bold">CRM</span>
            </NavLink>
          </div>
          <div className="flex space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Cadastro
            </NavLink>
            <NavLink
              to="/list"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Lista de Clientes
            </NavLink>
            <NavLink
              to="/scheduling"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Agendamento
            </NavLink>
            <NavLink
              to="/scheduling-list"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Lista de Agendamentos
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
