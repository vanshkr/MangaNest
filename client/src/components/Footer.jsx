import { Book, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  const footerLinks = {
    "Quick Links": ["Home", "Top Airing", "Random"],
    Genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance"],
  };

  return (
    <footer className="bg-black/50 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Book className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MangaNest
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-xs">
              Your ultimate destination for reading the latest and greatest
              manga series.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
              >
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="min-w-0">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm block truncate"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © 2025 MangaNest. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
            Made with ❤️ for manga lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
