import React from 'react';
import { BarChart3, Database, Brain, TrendingUp, Zap, Target, Activity, ArrowRight, Upload, Filter, Calculator, Eye, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-green-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EDA Platform
              </span>{' '}
              for Data Scientists
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Upload your Excel or CSV files and get instant exploratory data analysis with distribution detection, 
              outlier identification, correlation matrices, and interactive visualizations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Start Data Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EDA Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Exploratory Data Analysis Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for comprehensive data exploration and analysis in one interactive platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-blue-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Data Import</h3>
              <p className="text-gray-600">
                Upload Excel (.xlsx, .xls) or CSV files with automatic column type detection and data validation.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-purple-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Distribution Analysis</h3>
              <p className="text-gray-600">
                Automatic detection of Normal, Bernoulli, Poisson distributions with interactive histograms and KDE plots.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-green-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Outlier Detection</h3>
              <p className="text-gray-600">
                Identify outliers using IQR and Z-score methods with interactive box plots and detailed statistics.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-orange-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Correlation Analysis</h3>
              <p className="text-gray-600">
                Interactive correlation heatmaps and covariance matrices to discover relationships between variables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Workflow */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              EDA Workflow in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From data upload to comprehensive insights in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Data</h3>
              <p className="text-gray-600">Drag and drop Excel or CSV files with automatic parsing and validation</p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Columns</h3>
              <p className="text-gray-600">Choose specific columns or select all for comprehensive analysis</p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Insights</h3>
              <p className="text-gray-600">Interactive visualizations, statistics, and automated insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced EDA Capabilities
            </h2>
            <p className="text-xl text-gray-600">
              Professional-grade analysis tools for data scientists
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <Database className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Dictionary</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Automatic data type detection</li>
                <li>• Missing value analysis</li>
                <li>• Unique value counts</li>
                <li>• Statistical summaries</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <Activity className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Visualizations</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Histograms and KDE plots</li>
                <li>• Box plots and violin plots</li>
                <li>• Scatter plot matrices</li>
                <li>• Categorical bar charts</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Missing Data Patterns</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Missing data heatmaps</li>
                <li>• Pattern identification</li>
                <li>• Imputation suggestions</li>
                <li>• Data quality scores</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Explore Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Upload your dataset and get comprehensive EDA insights in seconds.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Analysis Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;