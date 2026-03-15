import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Loader from './components/common/Loader';

// Lazy load pages for better performance
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
        <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-6">
            <span className="text-3xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Encountered an Error</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium">{this.state.error?.message}</p>
          <button
            className="btn btn-primary shadow-lg shadow-primary-500/20"
            onClick={() => window.location.reload()}
          >
            Restart Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans">
          <Navbar />
          <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] p-6 md:p-10 transition-all duration-500">
            <main className="w-full">
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="*" element={
                      <div className="p-24 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                        <h2 className="text-6xl font-black text-primary-100 dark:text-slate-800 mb-4">404</h2>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">The resource you're looking for doesn't exist.</p>
                        <a href="/" className="btn btn-primary inline-block">Back to Dashboard</a>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
