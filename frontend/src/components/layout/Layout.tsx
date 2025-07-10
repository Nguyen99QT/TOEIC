// Kiểm tra tất cả các import statements
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
// import TokenRefreshIndicator from '../auth/TokenRefreshIndicator'; // TẠM THỜI COMMENT OUT

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* <TokenRefreshIndicator /> */} {/* TẠM THỜI COMMENT OUT */}
    </div>
  );
};

export default Layout;