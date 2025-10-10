import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CustomerListPage from "./pages/CustomerListPage";
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
              <Route path="/" element={<CustomerListPage />} />
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
