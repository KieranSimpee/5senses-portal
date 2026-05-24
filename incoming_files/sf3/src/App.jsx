import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Finance from './pages/Finance';
import HR from './pages/HR';
import Brand from './pages/Brand';
import Compliance from './pages/Compliance';
import Documents from './pages/Documents';
import Vault from './pages/Vault';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f4ff]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e8e6fe] border-t-[#8c82fc] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-[#8c82fc] font-bold" style={{fontFamily:'Montserrat, sans-serif'}}>Loading 5S Portal...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    else if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/hr" element={<HR />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/vault" element={<Vault />} />
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
