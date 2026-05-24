import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects';
import Expenses from './pages/Expenses';
import Documents from './pages/Documents.jsx';
import Vault from './pages/Vault';
import Tools from './pages/Tools';
import CalendarPage from './pages/Calendar';
import Inbox from './pages/Inbox.jsx';
import Office from './pages/Office';
import EmailScan from './pages/EmailScan';
import Compliance from './pages/Compliance';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/email-scan" element={<EmailScan />} />
        <Route path="/office" element={<Office />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
