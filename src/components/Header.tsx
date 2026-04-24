import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Logo } from './Logo';

interface HeaderProps {
  onGetStarted?: () => void;
  showAuthButtons?: boolean;
  isAdminUser?: boolean;
}

export function Header({ onGetStarted, showAuthButtons = true, isAdminUser = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">
                About
              </Link>
              <Link to="/faq" className="text-gray-700 hover:text-blue-600 font-medium transition">
                FAQ
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Contact
              </Link>

              {showAuthButtons && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2 text-gray-700 hover:text-blue-600 font-semibold transition"
                      >
                        Dashboard
                      </button>
                      {isAdminUser && (
                        <button
                          onClick={() => navigate('/admin')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                          <Shield size={18} />
                          Admin
                        </button>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="px-5 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-5 py-2 text-gray-700 hover:text-blue-600 font-semibold transition"
                      >
                        Sign In
                      </button>
                      {onGetStarted && (
                        <button
                          onClick={onGetStarted}
                          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                        >
                          Get Started
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-4">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleNavClick('/')}
                  className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('/about')}
                  className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavClick('/faq')}
                  className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  FAQ
                </button>
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  Contact
                </button>

                {showAuthButtons && (
                  <>
                    {user ? (
                      <>
                        <button
                          onClick={() => handleNavClick('/dashboard')}
                          className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition"
                        >
                          Dashboard
                        </button>
                        {isAdminUser && (
                          <button
                            onClick={() => handleNavClick('/admin')}
                            className="text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                          >
                            Admin Panel
                          </button>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="text-left px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowAuthModal(true);
                            setMobileMenuOpen(false);
                          }}
                          className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition"
                        >
                          Sign In
                        </button>
                        {onGetStarted && (
                          <button
                            onClick={() => {
                              onGetStarted();
                              setMobileMenuOpen(false);
                            }}
                            className="text-left px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                          >
                            Get Started
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
