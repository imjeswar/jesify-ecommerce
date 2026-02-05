import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram, HelpCircle, Briefcase, Gift } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* ABOUT */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact-us" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-sm text-white hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/payments" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/cancellation-returns" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-white hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* CONSUMER POLICY */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Consumer Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cancellation-returns" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-white hover:text-primary-500 transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <Link to="/seller/register" className="flex items-center gap-2 text-primary-500 hover:text-primary-400 font-medium">
                <Briefcase className="h-5 w-5" />
                <span>Become a Seller</span>
              </Link>
              <Link to="#" className="flex items-center gap-2 text-white hover:text-primary-500 transition-colors">
                <Gift className="h-5 w-5" />
                <span>Gift Cards</span>
              </Link>
              <Link to="/faq" className="flex items-center gap-2 text-white hover:text-primary-500 transition-colors">
                <HelpCircle className="h-5 w-5" />
                <span>Help Center</span>
              </Link>
            </div>
            
            <p className="text-gray-400 text-sm font-brand">
              &copy; 2026-{new Date().getFullYear()} Jesify.com
            </p>
            
            <div className="flex items-center gap-2">
               {/* Payment icons placeholder or just text */}
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
