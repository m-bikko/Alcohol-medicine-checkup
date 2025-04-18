import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

// Auth
import Login from './pages/Auth/Login';
import DepartmentSelect from './pages/Auth/DepartmentSelect';

// Layout
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees';
import Testing from './pages/Testing/Testing';
import AlcoholTestJournal from './pages/Journals/AlcoholTestJournal';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // В реальном приложении здесь была бы проверка аутентификации
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3000}
        >
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/department-select" element={<DepartmentSelect />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Employees />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/testing"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Testing />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/journal/alcohol-tests"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AlcoholTestJournal />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;