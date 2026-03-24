import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Loader from './components/common/Loader';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Employees = lazy(() => import('./pages/Employees'));
const Attendance = lazy(() => import('./pages/Attendance'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 border border-rose-200 dark:border-rose-500/20">
            <span className="text-4xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Something went wrong</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md font-medium">{this.state.error?.message}</p>
          <button
            className="btn-base btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar />
            
            <div className="lg:pl-20 transition-all duration-300">
              <Navbar />
              
              <main className="px-4 py-6 md:px-8 md:py-8 max-w-[1440px] mx-auto min-h-[calc(100vh-80px)]">
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="*" element={
                      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                        <h2 className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-4 tracking-tighter">404</h2>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">The page you're looking for doesn't exist or has been moved.</p>
                        <a href="/" className="btn-base btn-primary">Return Home</a>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
