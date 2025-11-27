'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  FileText, 
  Shield, 
  Wrench, 
  Book, 
  Building,
  Users,
  Globe,
  Code,
  Sparkles,
  User,
  LogOut,
  Settings
} from 'lucide-react';


interface NavItem {
  name: string;
  href: string;
  description?: string;
  hasDropdown?: boolean;
  icon?: React.ReactNode;
}

interface DropdownItem {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Security: Sanitize user input
  const sanitizeText = (text: string): string => {
    return text.replace(/[<>'"&]/g, '').trim().substring(0, 100);
  };

  // Security: Validate URLs for navigation
  const isValidUrl = (url: string): boolean => {
    try {
      // Only allow relative URLs or same-origin absolute URLs
      if (url.startsWith('/')) return true;
      if (url.startsWith('http')) {
        const parsed = new URL(url);
        return parsed.hostname === window.location.hostname;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Security: Safe navigation
  const safeNavigate = (url: string) => {
    if (isValidUrl(url) && !url.includes('javascript:')) {
      window.location.href = url;
    }
  };

  // Handle client-side mount and auth state
  useEffect(() => {
    setIsMounted(true);
    
    // Check authentication status
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser({
            username: sanitizeText(parsedUser.username) || sanitizeText(parsedUser.email?.split('@')[0] || ''),
            email: sanitizeText(parsedUser.email || '')
          });
        } catch (error) {
          console.error('Failed to parse user data:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (for login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedElement = e.target as Node;
      
      // Close main navigation dropdowns
      if (activeDropdown) {
        let isInsideDropdown = false;
        
        // Check if click is inside any dropdown
        Object.values(dropdownRefs.current).forEach(ref => {
          if (ref?.contains(clickedElement)) {
            isInsideDropdown = true;
          }
        });
        
        // Also check if click is on a dropdown button
        const dropdownButtons = document.querySelectorAll('[aria-haspopup="true"]');
        dropdownButtons.forEach(button => {
          if (button.contains(clickedElement)) {
            isInsideDropdown = true;
          }
        });
        
        if (!isInsideDropdown) {
          setActiveDropdown(null);
        }
      }
      
      // Close account dropdown
      if (accountDropdownOpen && accountDropdownRef.current && !accountDropdownRef.current.contains(clickedElement as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, accountDropdownOpen]);

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { name: 'Home', href: '/home' },
    { 
      name: 'Aether Office', 
      href: '/office',
      description: 'SaaS ecosystem for modern workspace collaboration'
    },
    { 
      name: 'Governance', 
      href: '/governance',
      hasDropdown: true,
      description: 'Organizational structure and policies'
    },
    { 
      name: 'Company', 
      href: '/company',
      hasDropdown: true,
      description: 'About Sky Genesis Enterprise'
    },
    { name: 'Vision', href: '/vision' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { 
      name: 'Developer', 
      href: '/developer',
      hasDropdown: true,
      description: 'Developer resources and documentation'
    },
  ];

  // Governance dropdown items
  const governanceItems: DropdownItem[] = [
    { 
      title: 'Organizational Structure', 
      description: 'Corporate hierarchy and teams', 
      href: '/governance/structure',
      icon: <Building className="w-4 h-4" />
    },
    { 
      title: 'Policies & Procedures', 
      description: 'Company policies and guidelines', 
      href: '/governance/policies',
      icon: <FileText className="w-4 h-4" />
    },
    { 
      title: 'Compliance', 
      description: 'Regulatory compliance information', 
      href: '/governance/compliance',
      icon: <Shield className="w-4 h-4" />
    },
    { 
      title: 'Board of Directors', 
      description: 'Leadership and governance', 
      href: '/governance/board',
      icon: <Users className="w-4 h-4" />
    },
  ];

  // Company dropdown items
  const companyItems: DropdownItem[] = [
    { 
      title: 'About Us', 
      description: 'Our story and mission', 
      href: '/company/about',
      icon: <Building className="w-4 h-4" />
    },
    { 
      title: 'Leadership Team', 
      description: 'Meet our executives', 
      href: '/company/leadership',
      icon: <Users className="w-4 h-4" />
    },
    { 
      title: 'Subsidiaries', 
      description: 'Our portfolio companies', 
      href: '/company/subsidiaries',
      icon: <Globe className="w-4 h-4" />
    },
    { 
      title: 'Press & Media', 
      description: 'News and press releases', 
      href: '/company/press',
      icon: <FileText className="w-4 h-4" />
    },
  ];

  // Developer dropdown items
  const developerItems: DropdownItem[] = [
    { 
      title: 'Documentation', 
      description: 'API docs and guides', 
      href: '/developer/docs',
      icon: <Book className="w-4 h-4" />
    },
    { 
      title: 'API Portal', 
      description: 'REST & GraphQL APIs', 
      href: '/developer/api',
      icon: <Code className="w-4 h-4" />,
      badge: 'v2.0'
    },
    { 
      title: 'Open Source', 
      description: 'Our open source projects', 
      href: '/developer/open-source',
      icon: <Code className="w-4 h-4" />
    },
    { 
      title: 'SDK & Tools', 
      description: 'Development kits and tools', 
      href: '/developer/sdk',
      icon: <Wrench className="w-4 h-4" />
    },
  ];

  const getDropdownItems = (name: string): DropdownItem[] => {
    switch (name) {
      case 'Governance': return governanceItems;
      case 'Company': return companyItems;
      case 'Developer': return developerItems;
      default: return [];
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isMounted && scrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-sm' 
            : 'bg-black/80 backdrop-blur-lg border-b border-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center">
              <Link 
                href="/home" 
                className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105"
                aria-label="Sky Genesis Enterprise homepage"
              >
                <div className="relative hidden sm:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col sm:hidden">
                  <span className="text-lg font-bold tracking-tight text-white leading-tight">
                    Sky Genesis Enterprise
                  </span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white leading-tight">
                    Sky Genesis Enterprise
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainNavItems.map((item) => (
                <div 
                  key={item.name} 
                  className="relative"
                  ref={(el) => { dropdownRefs.current[item.name] = el; }}
                >
                  {item.hasDropdown ? (
                      <button
                        className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-white ${
                          activeDropdown === item.name ? 'text-white' : 'text-gray-400'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === item.name ? null : item.name);
                        }}
                        aria-expanded={activeDropdown === item.name}
                        aria-haspopup="true"
                      >
                       <span>{item.name}</span>
                       <ChevronDown className={`w-4 h-4 transition-transform ${
                         activeDropdown === item.name ? 'rotate-180' : ''
                       }`} />
                     </button>
                  ) : (
                      <Link
                        href={isValidUrl(item.href) ? item.href : '/home'}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      >
                       {item.name}
                     </Link>
                  )}

                   {/* Dropdown Menu */}
                   {item.hasDropdown && activeDropdown === item.name && (
                     <div className="absolute top-full left-0 mt-2 min-w-[280px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                       <div className="py-2">
                         {getDropdownItems(item.name).map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={isValidUrl(subItem.href) ? subItem.href : '/home'}
                              className="flex items-center space-x-3 px-3 py-2 hover:bg-muted/50 transition-colors group"
                              onClick={() => setActiveDropdown(null)}
                            >
                             <div className="text-muted-foreground group-hover:text-primary transition-colors">
                               {subItem.icon}
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center justify-between">
                                 <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                   {subItem.title}
                                 </span>
                                 {subItem.badge && (
                                   <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                     {subItem.badge}
                                   </span>
                                 )}
                               </div>
                               <p className="text-xs text-muted-foreground mt-0.5">
                                 {subItem.description}
                               </p>
                             </div>
                           </Link>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50"
                aria-label="Search documentation"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="text-xs bg-muted border border-border rounded px-1.5 py-0.5 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label="Search documentation"
              >
                <Search className="w-5 h-5" />
              </button>



              {/* Auth/Account Section */}
              <div className="hidden lg:flex items-center">
                {isLoggedIn && user ? (
                  <div className="relative" ref={accountDropdownRef}>
                    <button
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                         <span className="text-white font-bold text-sm">
                           {user?.username ? sanitizeText(user.username).charAt(0).toUpperCase() : sanitizeText(user?.email || '').charAt(0).toUpperCase() || 'U'}
                         </span>
                      </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">{sanitizeText(user?.username || user?.email || '')}</div>
                          <div className="text-xs text-gray-500">{sanitizeText(user?.email || '')}</div>
                        </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                        accountDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Account Dropdown */}
                    {accountDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                        <div className="py-2">
                          {/* Profile Link */}
                          <Link
                            href="/admin/profile"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <div>
                              <div className="text-sm font-medium">Mon Profil</div>
                              <div className="text-xs text-gray-500">Gérer mes informations</div>
                            </div>
                          </Link>

                          {/* Account Settings */}
                          <Link
                            href="/admin/account/settings"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setAccountDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <div>
                              <div className="text-sm font-medium">Paramètres du compte</div>
                              <div className="text-xs text-gray-500">Sécurité et préférences</div>
                            </div>
                          </Link>

                          {/* Divider */}
                          <div className="mx-4 my-2 border-t border-gray-200"></div>

                          {/* Logout */}
                          <button
                            onClick={() => {
                              localStorage.removeItem('authToken');
                              localStorage.removeItem('refreshToken');
                              localStorage.removeItem('idToken');
                              localStorage.removeItem('user');
                               setIsLoggedIn(false);
                               setUser(null);
                               setAccountDropdownOpen(false);
                               safeNavigate('/login');
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <div>
                              <div className="text-sm font-medium">Se déconnecter</div>
                              <div className="text-xs text-gray-500">Quitter la session</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="text-sm font-medium text-blue-600 bg-white hover:bg-gray-100 transition-colors px-6 py-2 rounded-lg border border-blue-600"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 rounded-lg hover:bg-muted/50 transition-colors touch-manipulation"
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden border-t border-border/50 py-4 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <Link
                          href={item.href}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98] relative z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                          }}
                        >
                          <span className="font-medium text-base">{item.name}</span>
                        </Link>
                        <button
                          className="w-full flex items-center justify-end p-2 text-left hover:bg-muted/50 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98]"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === item.name ? null : item.name);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            setActiveDropdown(activeDropdown === item.name ? null : item.name);
                          }}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                        {activeDropdown === item.name && (
                          <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-1 duration-200 relative z-0">
                            {getDropdownItems(item.name).map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 touch-manipulation active:scale-[0.98]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActiveDropdown(null);
                                  setIsOpen(false);
                                   // Navigate safely to ensure it works
                                   safeNavigate(subItem.href);
                                }}
                              >
                                <div className="text-primary flex-shrink-0">
                                  {subItem.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate">{subItem.title}</span>
                                    {subItem.badge && (
                                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {subItem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block p-4 text-left hover:bg-muted/50 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98] font-medium text-base"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpen(false);
                           // Navigate safely to ensure it works
                           safeNavigate(item.href);
                        }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

               {/* Mobile Auth */}
               <div className="mt-6 pt-6 border-t border-border/50">
                 {isLoggedIn && user ? (
                   <div className="px-4 py-3">
                     <div className="flex items-center gap-3 mb-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                             {user?.username ? sanitizeText(user.username).charAt(0).toUpperCase() : sanitizeText(user?.email || '').charAt(0).toUpperCase() || 'U'}
                           </span>
                        </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{sanitizeText(user?.username || user?.email || '')}</div>
                            <div className="text-xs text-gray-500">{sanitizeText(user?.email || '')}</div>
                         </div>
                     </div>
                     <button
                       onClick={() => {
                         localStorage.removeItem('authToken');
                         localStorage.removeItem('refreshToken');
                         localStorage.removeItem('idToken');
                         localStorage.removeItem('user');
                         setIsLoggedIn(false);
                          setUser(null);
                          setAccountDropdownOpen(false);
                          safeNavigate('/login');
                       }}
                       className="w-full text-center p-3 text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 rounded-xl touch-manipulation active:scale-[0.98]"
                     >
                       Se déconnecter
                     </button>
                   </div>
                 ) : (
                   <Link 
                     href="/login" 
                     className="block w-full text-center p-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-xl touch-manipulation active:scale-[0.98]"
                     onClick={() => setIsOpen(false)}
                   >
                     Login
                   </Link>
                 )}
               </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] p-4"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation, API, articles..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              Press <kbd className="bg-muted border border-border rounded px-1.5 py-0.5 font-mono">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}