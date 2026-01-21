import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login';
import HomePage from './views/Home';
import { PrivateGuard, PublicGuard } from './components/Guard';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './views/Dashboard';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          
          {/* Only for not logged in users */}
          <Route element={<PublicGuard/>}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          
          {/* Private Routes */}
          <Route element={<PrivateGuard/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
