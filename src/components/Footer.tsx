
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 md:px-12 bg-white/50 backdrop-blur-sm border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} HealthHub. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <Link to="/terms" className="text-gray-500 text-sm hover:text-health-primary transition-colors duration-200">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-gray-500 text-sm hover:text-health-primary transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link to="/contact" className="text-gray-500 text-sm hover:text-health-primary transition-colors duration-200">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
