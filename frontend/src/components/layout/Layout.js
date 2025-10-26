import React from 'react';
import Navbar from '../Navbar';

const Layout = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar user={user} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;