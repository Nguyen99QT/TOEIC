/**
 * ================================================================
 * FOOTER COMPONENT
 * ================================================================
 * 
 * Main footer with links and information
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-gradient mb-4">
              TOICEnglish
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Comprehensive TOEIC learning platform designed to help you achieve your target score 
              with interactive lessons, practice exercises, and personalized learning paths.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Learn
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/lessons" className="text-gray-600 hover:text-gray-900 text-sm">
                  Lessons
                </Link>
              </li>
              <li>
                <Link to="/exercises" className="text-gray-600 hover:text-gray-900 text-sm">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link to="/flashcards" className="text-gray-600 hover:text-gray-900 text-sm">
                  Flashcards
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>            <ul className="space-y-3">
              <li>
                <a href="/help" className="text-gray-600 hover:text-gray-900 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-gray-900 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} TOICEnglish TOEIC Platform. All rights reserved.
            </p>            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-gray-500">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-gray-500">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
