import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login';
import HomePage from './views/Home';
import { PrivateGuard, PublicGuard } from './util/Guard';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './views/Dashboard';
import MainLayout from './util/MainLayout';

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
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
