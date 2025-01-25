import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './Store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoutes';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import AdminPanel from './pages/AdminPanel';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes for all roles */}
         
            {/* <Route element={<ProtectedRoute allowedRoles={['customer', 'agent', 'admin']} />}> */}
            <Route>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
        </Route>

          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}> */}
          <Route>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
