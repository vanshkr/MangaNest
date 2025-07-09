import { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  Book,
  Bell,
  User,
  Bookmark,
  Home,
  Users,
  Filter,
  Shuffle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Header({ searchQuery, setSearchQuery }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Close menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: "Home", href: "#", active: true, icon: Home },
    { label: "Read2gether", href: "#", icon: Users },
    { label: "Watchlist", href: "#", icon: Bookmark },
    { label: "Random", href: "#", icon: Shuffle },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/75 backdrop-blur-md border-b border-purple-500/20 text-white">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Always visible */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                MangaNest
              </span>
            </div>

            {/* Desktop Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center mx-4 lg:mx-8 max-w-md w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
              </div>
            </div>

            {/* Desktop Navigation - Hidden on mobile and tablet */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-1 xl:space-x-2 text-sm font-medium transition-colors hover:text-purple-400 whitespace-nowrap ${
                    item.active ? "text-purple-400" : "text-gray-300"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {/* Mobile Search Toggle - Only visible on mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={toggleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-purple-300 hover:text-purple-500 hover:bg-purple-500/10 rounded-md"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-purple-300 hover:text-purple-500 hover:bg-purple-500/10 rounded-md"
              >
                <User className="w-4 h-4" />
              </Button>

              {/* Hamburger Menu - Only visible on mobile and tablet */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-300 hover:text-white"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar - Slides down when toggled */}
          {isSearchOpen && (
            <div className="md:hidden py-3 px-2 sm:px-4 border-t border-gray-700 animate-in slide-in-from-top-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay - Full screen on mobile */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-md">
          <div className="flex flex-col h-full w-full max-w-xs px-4 py-6">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors hover:bg-gray-800 ${
                    item.active
                      ? "text-purple-400 bg-gray-800/50"
                      : "text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>

            {/* Mobile-only actions */}
            <div className="flex flex-col space-y-1">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
