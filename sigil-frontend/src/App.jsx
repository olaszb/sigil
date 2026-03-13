import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/Login';
import HomePage from './views/Home';
import { AdminGuard, AdminOrOrganizerGuard, PrivateGuard, PublicGuard } from './util/Guard';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './views/Dashboard';
import MainLayout from './util/MainLayout';
import NotFoundPage from './views/NotFound';
import RegisterPage from './views/Register';
import CreateEvent from './views/CreateEvent';
import EventDetails from './views/EventDetails';
import UpdateEvent from './views/UpdateEvent';
import AddVenuePage from './views/AddVenue';
import Venues from './views/Venues';
import PastEventsPage from './views/PastEvents';
import ProfilePage from './views/Profile';
import EditProfile from './views/EditProfile';
import AllEvents from './views/AllEvents';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/events/:slug' element={<EventDetails mode={'current'} />} />
            <Route path='/past-events' element={<PastEventsPage />} />
            <Route path='/past-events/:slug' element={<EventDetails mode={'past'} />} />
            <Route path='/users/:username' element={<ProfilePage />} />
            <Route path='/events' element={<AllEvents />} />
          
            {/* Private Routes */}
            <Route element={<PrivateGuard/>}>
              <Route path="/profile" element={<ProfilePage />}/>
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>
            
            {/* Routes for admins only */}
            <Route element={<AdminGuard />}>
                <Route path="/venues" element={<Venues />}/>
            </Route>

            {/* Routes for admins or organizers */}
            <Route element={<AdminOrOrganizerGuard />}>
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/update-event/:slug" element={<UpdateEvent />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/update-event/:slug" element={<UpdateEvent />} />
                <Route path="/add-venue" element={<AddVenuePage/>}/>
                <Route path="/archive/events/:slug" element={<EventDetails mode={'archived'}/>} />
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
