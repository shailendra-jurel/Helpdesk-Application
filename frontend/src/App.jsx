import React, { useState, useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet,
  useNavigate 
} from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { 
  Home,
  Ticket,
  Plus,
  Users,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  X
} from 'lucide-react';

import store from './Store/store';
import { logout } from './Store/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoutes';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TicketList = lazy(() => import('./pages/TicketList'));
const CreateTicket = lazy(() => import('./pages/CreateTicket'));
const TicketDetails = lazy(() => import('./pages/TicketDetails'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Reusable Button Component
const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg flex items-center justify-center
        space-x-2 font-medium transition-all duration-300
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  className: PropTypes.string,
  icon: PropTypes.elementType,
};


// Global Layout with Enhanced Sidebar
// Global Layout with Enhanced Sidebar
const GlobalLayout = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Ticket, label: "Tickets", path: "/tickets" },
    { icon: Plus, label: "Create Ticket", path: "/tickets/create" },
    ...(user?.role === "admin" ? [{ 
      icon: Users, 
      label: "Admin Panel", 
      path: "/admin" 
    }] : []),
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 
          shadow-xl z-50 transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        {/* Mobile Close Button */}
        <button 
          className="md:hidden absolute top-4 right-4 z-50"
          onClick={closeSidebar}
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <nav className="p-6 space-y-4 h-full flex flex-col">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Ticket Manager
            </h2>
            {sidebarItems.map((item) => (
              <Button
                key={item.path}
                variant="secondary"
                className="w-full justify-start mb-2"
                onClick={() => {
                  navigate(item.path);
                  closeSidebar();
                }}
              >
                <item.icon className="mr-2" /> {item.label}
              </Button>
            ))}
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 mt-auto"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            <LogOut className="mr-2" /> Logout
          </Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Theme Toggler */}
            <div className="ml-auto flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={toggleDarkMode}
                className="rounded-full p-2"
              >
                {darkMode ? <Sun /> : <Moon />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'agent', 'admin']} />}>
          {/* < Route> */}
            <Route element={<GlobalLayout />}>
              <Route index path="/" element={<Dashboard />} />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/tickets/create" element={<CreateTicket />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          {/* <Route> */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<GlobalLayout />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>

          {/* Redirect to Dashboard for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;