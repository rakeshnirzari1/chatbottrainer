import { Link } from 'react-router-dom';
import { Bot, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-blue-400" size={28} />
              <span className="text-xl font-bold text-white">Websitebot.com.au</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your website into an intelligent AI chatbot that provides instant support to your customers. Based in Sydney, Australia.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-400" />
                <a href="mailto:support@websitebot.com.au" className="hover:text-blue-400 transition">
                  support@websitebot.com.au
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-blue-400 mt-1" />
                <span>Sydney, NSW, Australia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Websitebot.com.au. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm hover:text-blue-400 transition">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm hover:text-blue-400 transition">
                Terms
              </Link>
              <Link to="/contact" className="text-sm hover:text-blue-400 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
