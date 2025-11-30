'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSearch } from '@/context/SearchContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      } else {
        console.warn('Auth object is null, cannot sign out.');
      }
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (pathname !== '/projects') {
        router.push('/projects');
      }
    }
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`block md:inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'text-accent'
            : 'text-text-secondary hover:text-text'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  const SearchBar = () => (
    <div className="relative">
      <input
        type="text"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        className={`w-full md:w-48 bg-gray-800 text-text-secondary placeholder-gray-500 px-4 py-2 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent`}
      />
      <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );

  return (
    <nav className="bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b border-border-color">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-text hover:text-accent transition-colors">
              Madiha Ayaz
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <div className="flex items-center">
              {!loading &&
                (user ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link href="/auth/login" className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text transition-colors">
                      Login
                  </Link>
                ))}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-text" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-text" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="mb-4">
                  <SearchBar />
                </div>
                <div className="flex items-center">
                  {!loading &&
                    (user ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text transition-colors"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link href="/auth/login" className="w-full block px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text transition-colors">
                          Login
                      </Link>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
