import React from "react";
import { NavLink } from "react-router-dom";

const logoSrc =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgNDAwIDE4MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iYmxhY2siLz48dGV4dCB4PSI1MCUiIHk9IjIwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBsZXR0ZXItc3BhY2luZz0iNCI+U1RVRElPCjwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJHYXJhbW9uZCwgVGltZXMgTmV3IFJvbWFuLCBzZXJpZiIgZm9udC1zaXplPSI2MCIgZm9udC13ZWlnaHQ9Im5vcm1hbCI+SnVjaWVsZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9Ijg1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJHYXJhbW9uZCwgVGltZXMgTmV3IFJvbWFuLCBzZXJpZiIgZm9udC1zaXplPSI2MCIgZm9udC1zdHlsZT0iaXRhbGljIj5NYXJxdWVzPC90ZXh0Pjwvc3ZnPg==";

const Header: React.FC = () => {
  const activeLinkClass = "bg-gray-700 text-white";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <header className="bg-black shadow-md">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink
              to="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded-md"
            >
              <img
                src={logoSrc}
                alt="Studio Juciele Marques"
                className="h-12 w-auto"
              />
            </NavLink>
          </div>
          <div className="flex space-x-4">
            <NavLink
              to="/clientes"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Clientes
            </NavLink>
            <NavLink
              to="/agendamentos"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Agendamentos
            </NavLink>
            <NavLink
              to="/pos-producao"
              className={({ isActive }) =>
                `${
                  isActive ? activeLinkClass : inactiveLinkClass
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Pós-produção
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
