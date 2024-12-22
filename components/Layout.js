import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const router = useRouter();

  // Check if the current path is the login page
  const isLoginPage = router.pathname === '/';

  return (
    <div>
      {/* Only render Navbar if we're not on the login page */}
      {!isLoginPage && <Navbar />}
      <main>{children}</main> {/* This is where the page content will go */}
    </div>
  );
};

export default Layout;
