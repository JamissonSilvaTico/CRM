import React from "react";
import { Link } from "react-router-dom";

const logoSrc =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgNDAwIDE4MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iYmxhY2siLz48dGV4dCB4PSI1MCUiIHk9IjIwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBsZXR0ZXItc3BhY2luZz0iNCI+U1RVRElPCjwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJHYXJhbW9uZCwgVGltZXMgTmV3IFJvbWFuLCBzZXJpZiIgZm9udC1zaXplPSI2MCIgZm9udC13ZWlnaHQ9Im5vcm1hbCI+SnVjaWVsZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9Ijg1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJHYXJhbW9uZCwgVGltZXMgTmV3IFJvbWFuLCBzZXJpZiIgZm9udC1zaXplPSI2MCIgZm9udC1zdHlsZT0iaXRhbGljIj5NYXJxdWVzPC90ZXh0Pjwvc3ZnPg==";

const HomePage: React.FC = () => {
  const buttonClasses =
    "flex items-center justify-center h-16 w-64 bg-black text-white px-5 py-3 rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="mb-12">
          <img
            src={logoSrc}
            alt="Studio Juciele Marques"
            className="h-auto w-full max-w-sm rounded-lg"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/register" className={buttonClasses}>
            Cadastro Cliente
          </Link>
          <Link to="/list" className={buttonClasses}>
            Lista de Clientes
          </Link>
          <Link to="/scheduling" className={buttonClasses}>
            Agendamento
          </Link>
          <Link to="/scheduling-list" className={buttonClasses}>
            Lista de Agendamentos
          </Link>
          <Link to="/post-production" className={buttonClasses}>
            Pós-produção
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
