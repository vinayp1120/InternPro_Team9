import React from 'react';
import { BarChart3, Upload, Home, Database, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentPage: 'landing' | 'upload' | 'analysis';
  onNavigate: (page: 'landing' | 'upload' | 'analysis') => void;
  hasData: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, hasData }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DataCraft EDA
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => onNavigate('landing')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'landing'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => onNavigate('upload')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'upload'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Upload Data</span>
              </button>
              
              <button
                onClick={() => onNavigate('analysis')}
                disabled={!hasData}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'analysis'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : hasData 
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>EDA Analysis</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              hasData 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                hasData ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span>{hasData ? 'Data Loaded' : 'No Data'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;