import { Link } from 'react-router-dom';
import { MoveLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <h1 className="text-6xl font-bold mb-2">404</h1>
          <p className="text-xl">Page Not Found</p>
        </div>
        
        <div className="px-6 py-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 p-3 rounded-full">
              <Search className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          
          <p className="text-gray-600 text-center mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              <MoveLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;