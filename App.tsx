import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import CustomerListPage from "./pages/CustomerListPage";
import EditCustomerPage from "./pages/EditCustomerPage";
import SchedulingPage from "./pages/SchedulingPage";
import SchedulingListPage from "./pages/SchedulingListPage";
import PostProductionPage from "./pages/PostProductionPage";

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <Header />
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/list" element={<CustomerListPage />} />
              <Route path="/edit/:id" element={<EditCustomerPage />} />
              <Route path="/scheduling" element={<SchedulingPage />} />
              <Route path="/scheduling/:id" element={<SchedulingPage />} />
              <Route path="/scheduling-list" element={<SchedulingListPage />} />
              <Route path="/post-production" element={<PostProductionPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
