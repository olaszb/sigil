import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
