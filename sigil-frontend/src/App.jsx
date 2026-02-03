import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login';
import HomePage from './views/Home';
import { PrivateGuard, PublicGuard } from './util/Guard';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './views/Dashboard';
import MainLayout from './util/MainLayout';
import NotFoundPage from './views/NotFound';
import RegisterPage from './views/Register';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
          
            {/* Private Routes */}
            <Route element={<PrivateGuard/>}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
          
          {/* Only for not logged in users */}
          <Route element={<PublicGuard/>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
