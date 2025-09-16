
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RegistrationPage from './pages/RegistrationPage';
import CustomerListPage from './pages/CustomerListPage';

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
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
