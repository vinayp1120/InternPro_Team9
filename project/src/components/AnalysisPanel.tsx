import React, { useState } from 'react';
import { Calculator, TrendingUp, BarChart3, PieChart, Database, Code, AlertCircle } from 'lucide-react';

interface AnalysisPanelProps {
  data: any[];
  selectedColumns: string[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data, selectedColumns }) => {
  const [activeAnalysis, setActiveAnalysis] = useState<'descriptive' | 'correlation' | 'trends' | 'custom'>('descriptive');

  // PLACEHOLDER: Replace these with your actual statistical analysis functions
  const calculateDescriptiveStats = (column: string) => {
    const numericData = data.map(row => row[column]).filter(val => typeof val === 'number');
    if (numericData.length === 0) return null;
    
    // PLACEHOLDER: Add your statistical calculation logic here
    const mean = numericData.reduce((a, b) => a + b, 0) / numericData.length;
    const sorted = [...numericData].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...numericData);
    const max = Math.max(...numericData);
    const variance = numericData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericData.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, median, min, max, stdDev, count: numericData.length };
  };

  const getNumericColumns = () => {
    if (data.length === 0) return [];
    return selectedColumns.filter(col => typeof data[0][col] === 'number');
  };

  const analysisTypes = [
    { id: 'descriptive', name: 'Descriptive Statistics', icon: Calculator, color: 'blue' },
    { id: 'correlation', name: 'Correlation Analysis', icon: TrendingUp, color: 'green' },
    { id: 'trends', name: 'Trend Analysis', icon: BarChart3, color: 'purple' },
    { id: 'custom', name: 'Custom Analysis', icon: Code, color: 'orange' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistical Analysis</h2>
        <p className="text-gray-600">
          Comprehensive analysis of your selected data columns with statistical insights and patterns.
        </p>
        
        {/* PLACEHOLDER: Analysis Integration Notice */}
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800">
                <strong>Integration Point:</strong> This analysis panel is ready for your statistical analysis code. 
                Replace the placeholder calculations with your preferred statistical libraries (NumPy, SciPy, D3-statistics, etc.).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Type Selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {analysisTypes.map((analysis) => {
          const Icon = analysis.icon;
          return (
            <button
              key={analysis.id}
              onClick={() => setActiveAnalysis(analysis.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeAnalysis === analysis.id
                  ? `bg-${analysis.color}-50 text-${analysis.color}-600 border-2 border-${analysis.color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{analysis.name}</span>
            </button>
          );
        })}
      </div>

      {/* Analysis Content */}
      <div className="space-y-6">
        {activeAnalysis === 'descriptive' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Descriptive Statistics</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getNumericColumns().map((column) => {
                const stats = calculateDescriptiveStats(column);
                if (!stats) return null;
                
                return (
                  <div key={column} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{column}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mean:</span>
                        <span className="font-medium">{stats.mean.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Median:</span>
                        <span className="font-medium">{stats.median.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Std Dev:</span>
                        <span className="font-medium">{stats.stdDev.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min:</span>
                        <span className="font-medium">{stats.min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max:</span>
                        <span className="font-medium">{stats.max}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Count:</span>
                        <span className="font-medium">{stats.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeAnalysis === 'correlation' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Correlation Analysis</h3>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Correlation Matrix</h4>
                <p className="text-gray-600 mb-4">
                  PLACEHOLDER: Implement correlation analysis between selected numeric columns
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Integration point for correlation calculations, heatmaps, and relationship analysis.
                    Consider using libraries like Pearson correlation, Spearman rank correlation, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeAnalysis === 'trends' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trend Analysis</h3>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Time Series & Patterns</h4>
                <p className="text-gray-600 mb-4">
                  PLACEHOLDER: Implement trend detection, seasonality analysis, and forecasting
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Integration point for time series analysis, moving averages, trend lines, 
                    seasonal decomposition, and predictive modeling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeAnalysis === 'custom' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Analysis</h3>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="text-center">
                <Code className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
                <p className="text-gray-600 mb-4">
                  PLACEHOLDER: Custom analysis functions and machine learning models
                </p>
                <div className="bg-white p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-700">
                    Integration points for:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Regression analysis and predictive modeling</li>
                    <li>• Clustering and classification algorithms</li>
                    <li>• Outlier detection and anomaly analysis</li>
                    <li>• Custom statistical tests and hypothesis testing</li>
                    <li>• Data preprocessing and feature engineering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Summary */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-gray-600">Total Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{selectedColumns.length}</div>
            <div className="text-sm text-gray-600">Selected Columns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{getNumericColumns().length}</div>
            <div className="text-sm text-gray-600">Numeric Columns</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;