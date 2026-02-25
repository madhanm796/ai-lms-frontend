import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Middleware from './components/Middleware';
import MainLayout from './components/MainLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'
import RoadmapDetail from './pages/RoadmapDetails';
import Profile from './pages/Profile';
import MyLearning from './pages/MyLearning';
import QuizView from './pages/QuizView';

function App() {
  return (
    <div className='w-full min-w-screen'>
      <Toaster position="top-center" />

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Middleware />}>

          <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
          <Route element={<MainLayout />}>

            <Route path="/dashboard" element={<Home />} />
            {/* <Route path="/explore" element={<Explore />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />


          </Route>
          <Route path="/quiz/:id" element={<QuizView />} />
        </Route>

        <Route path="*" element={<div className="text-white text-center mt-20">404 - Page Not Found</div>} />

      </Routes>
    </div>
  );
}

export default App;