import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RegistrationPage from "./pages/RegistrationPage";
import CustomerListPage from "./pages/CustomerListPage";
import EditCustomerPage from "./pages/EditCustomerPage";
import SchedulingPage from "./pages/SchedulingPage";
import SchedulingListPage from "./pages/SchedulingListPage";
// NOVO: Importa a página de Pós-produção
import PostProductionPage from "./pages/PostProductionPage";

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <Header />
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<RegistrationPage />} />
              <Route path="/list" element={<CustomerListPage />} />
              <Route path="/edit/:id" element={<EditCustomerPage />} />
              <Route path="/scheduling" element={<SchedulingPage />} />
              <Route path="/scheduling/:id" element={<SchedulingPage />} />
              <Route path="/scheduling-list" element={<SchedulingListPage />} />
              {/* NOVO: Rota para a página de Pós-produção */}
              <Route path="/post-production" element={<PostProductionPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
