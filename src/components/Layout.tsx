import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, ListTodo, BarChart2, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="relative flex items-center justify-center py-3">
            {/* Main navigation items centered */}
            <div className="flex justify-center space-x-12">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 ${
                    isActive 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <Home size={24} />
                <span className="text-xs">Inicio</span>
              </NavLink>
              
              <NavLink
                to="/lists"
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 ${
                    isActive 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <ListTodo size={24} />
                <span className="text-xs">Listas</span>
              </NavLink>

              <NavLink
                to="/stats"
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 ${
                    isActive 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <BarChart2 size={24} />
                <span className="text-xs">Estadísticas</span>
              </NavLink>
              
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 ${
                    isActive 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <Settings size={24} />
                <span className="text-xs">Ajustes</span>
              </NavLink>
            </div>

            {/* Theme toggle positioned absolutely on the right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;