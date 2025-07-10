import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/website' },
    { name: 'Features', href: '/website/features' },
    { name: 'Pricing', href: '/website/pricing' },
    { name: 'About', href: '/website/about' },
    { name: 'Contact', href: '/website/contact' },
  ];

  const solutions = [
    { name: 'Sales CRM', description: 'Manage your sales pipeline effectively' },
    { name: 'Marketing Automation', description: 'Automate your marketing campaigns' },
    { name: 'Customer Service', description: 'Deliver exceptional support' },
    { name: 'Analytics & Reports', description: 'Get insights from your data' }
  ];

  const resources = [
    { name: 'Blog', href: '#' },
    { name: 'Help Center', href: '#' },
    { name: 'API Documentation', href: '#' },
    { name: 'Case Studies', href: '#' },
    { name: 'Webinars', href: '#' },
    { name: 'Templates', href: '#' }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/website" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">CRM Platform</span>
                <div className="text-xs text-gray-500">by Lovable</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Solutions Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-50">
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-6">
                    <div className="space-y-4">
                      {solutions.map((solution, index) => (
                        <Link key={index} to="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="font-medium text-gray-900">{solution.name}</div>
                          <div className="text-sm text-gray-600">{solution.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resources Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-50">
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      {resources.map((resource, index) => (
                        <Link key={index} to={resource.href} className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                          {resource.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started Free</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <span className="font-bold text-xl">CRM Platform</span>
                  <div className="text-xs text-gray-400">by Lovable</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The ultimate CRM solution for modern businesses. Streamline your sales process, 
                automate customer engagement, and grow your business with our AI-powered platform.
              </p>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">🚀 Trusted by 10,000+ companies</div>
                <div className="text-sm text-gray-400">⭐ 4.9/5 rating from 1,200+ reviews</div>
                <div className="text-sm text-gray-400">🔒 SOC2 & GDPR compliant</div>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/website/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/website/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            {/* Solutions */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Solutions</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sales CRM</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketing Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Automation</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/website/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/website/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                &copy; 2024 CRM Platform. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="hover:text-white transition-colors">Status</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
