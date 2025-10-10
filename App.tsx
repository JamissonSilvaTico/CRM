import React from "react";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CustomerListPage from "./pages/CustomerListPage";
import SchedulingListPage from "./pages/SchedulingListPage";
import PostProductionPage from "./pages/PostProductionPage";

const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
    <Header />
    <main className="p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<AppLayout />}>
          <Route path="/clientes" element={<CustomerListPage />} />
          <Route path="/agendamentos" element={<SchedulingListPage />} />
          <Route path="/pos-producao" element={<PostProductionPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
