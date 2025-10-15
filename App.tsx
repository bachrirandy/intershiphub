import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { ModalProvider, useModal } from './contexts/ModalContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ResourceCenter from './pages/ResourceCenter';
import ToastContainer from './components/ToastContainer';
import AuthModal from './components/AuthModal';
import { Role } from './types';
import StudentSearchPage from './pages/StudentSearchPage';
import StudentApplicationsPage from './pages/StudentApplicationsPage';
import StudentCalendarPage from './pages/StudentCalendarPage';
import StudentProfilePage from './pages/StudentProfilePage';
import CompanyListingsPage from './pages/CompanyListingsPage';
import CompanyPostPage from './pages/CompanyPostPage';
import CompanyCalendarPage from './pages/CompanyCalendarPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import ApplicationFormPage from './pages/ApplicationFormPage';

const PrivateRoute: React.FC<{ children: React.ReactNode; roles: Role[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { isAuthModalOpen, authModalConfig } = useModal();

    return (
        <div className="min-h-screen bg-[#EFF0F4] font-sans">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/resources" element={<ResourceCenter />} />
                    
                    <Route path="/student" element={
                        <PrivateRoute roles={[Role.STUDENT]}>
                            <StudentDashboard />
                        </PrivateRoute>
                    }>
                        <Route index element={<StudentSearchPage />} />
                        <Route path="applications" element={<StudentApplicationsPage />} />
                        <Route path="calendar" element={<StudentCalendarPage />} />
                        <Route path="profile" element={<StudentProfilePage />} />
                    </Route>
                    
                    <Route path="/student/apply/:internshipId" element={
                        <PrivateRoute roles={[Role.STUDENT]}>
                            <ApplicationFormPage />
                        </PrivateRoute>
                    } />

                    <Route path="/company" element={
                        <PrivateRoute roles={[Role.COMPANY]}>
                            <CompanyDashboard />
                        </PrivateRoute>
                    }>
                        <Route index element={<CompanyListingsPage />} />
                        <Route path="post" element={<CompanyPostPage />} />
                        <Route path="calendar" element={<CompanyCalendarPage />} />
                        <Route path="profile" element={<CompanyProfilePage />} />
                    </Route>

                    <Route path="/admin" element={
                        <PrivateRoute roles={[Role.ADMIN]}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            {isAuthModalOpen && <AuthModal initialMode={authModalConfig.mode} initialRole={authModalConfig.role} />}
            <ToastContainer />
        </div>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;