
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PenLine, Wand2, Upload, User, Menu, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <Layers size={18} /> },
    { path: '/generator', label: 'Text to Drawing', icon: <Wand2 size={18} /> },
    { path: '/canvas', label: 'Drawing Canvas', icon: <PenLine size={18} /> },
    { path: '/upload', label: 'Upload Image', icon: <Upload size={18} /> },
    { path: '/character', label: 'Character Designer', icon: <User size={18} /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 text-primary font-medium text-lg"
          >
            <Layers className="w-6 h-6" />
            <span className="font-light tracking-tight">Creater</span>
          </NavLink>

          {isMobile ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>

              {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md animate-slide-down">
                  <nav className="container py-4">
                    <ul className="space-y-1">
                      {navLinks.map((link) => (
                        <li key={link.path}>
                          <NavLink
                            to={link.path}
                            className={({ isActive }) => 
                              `flex items-center px-4 py-3 rounded-md transition-colors ${
                                isActive 
                                  ? 'bg-secondary text-primary' 
                                  : 'text-muted-foreground hover:bg-secondary/50'
                              }`
                            }
                          >
                            <span className="mr-3">{link.icon}</span>
                            {link.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                      isActive 
                        ? 'bg-secondary text-primary' 
                        : 'text-muted-foreground hover:bg-secondary/50'
                    }`
                  }
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
