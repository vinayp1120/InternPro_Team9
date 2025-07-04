import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Database, 
  Filter, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Settings,
  Zap,
  Target,
  Activity,
  Calendar,
  Hash,
  Type,
  Percent
} from 'lucide-react';
import Plot from 'react-plotly.js';
import * as ss from 'simple-statistics';
import TimeSeriesAnalysis from './TimeSeriesAnalysis';

interface EDADashboardProps {
  data: any[];
  fileName: string;
}

interface ColumnInfo {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'text';
  uniqueValues: number;
  missingCount: number;
  missingPercentage: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
  distribution?: string;
  outliers?: number[];
}

const EDADashboard: React.FC<EDADashboardProps> = ({ data, fileName }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnInfo, setColumnInfo] = useState<{ [key: string]: ColumnInfo }>({});
  const [activeAnalysis, setActiveAnalysis] = useState<'overview' | 'distribution' | 'correlation' | 'outliers' | 'missing' | 'timeseries'>('overview');
  const [correlationData, setCorrelationData] = useState<any>(null);
  const [showSelectAll, setShowSelectAll] = useState(false);

  // Analyze columns on data load
  useEffect(() => {
    if (data.length > 0) {
      analyzeColumns();
    }
  }, [data]);

  const analyzeColumns = () => {
    const analysis: { [key: string]: ColumnInfo } = {};
    const columns = Object.keys(data[0]);

    columns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const allValues = data.map(row => row[column]);
      const missingCount = allValues.length - values.length;
      
      // Detect column type
      const numericValues = values.filter(val => !isNaN(Number(val)) && val !== '').map(Number);
      const isNumeric = numericValues.length > values.length * 0.8;
      
      // Enhanced date detection
      const isDate = values.some(val => {
        if (typeof val === 'string') {
          const parsed = new Date(val);
          return !isNaN(parsed.getTime()) && parsed.getFullYear() > 1900 && parsed.getFullYear() < 2100;
        }
        return false;
      });
      
      let type: 'numeric' | 'categorical' | 'datetime' | 'text' = 'text';
      if (isNumeric) type = 'numeric';
      else if (isDate) type = 'datetime';
      else if (new Set(values).size < values.length * 0.5) type = 'categorical';

      const info: ColumnInfo = {
        name: column,
        type,
        uniqueValues: new Set(values).size,
        missingCount,
        missingPercentage: (missingCount / allValues.length) * 100
      };

      // Additional analysis for numeric columns
      if (type === 'numeric' && numericValues.length > 0) {
        info.min = Math.min(...numericValues);
        info.max = Math.max(...numericValues);
        info.mean = ss.mean(numericValues);
        info.median = ss.median(numericValues);
        info.std = ss.standardDeviation(numericValues);
        
        // Detect distribution
        info.distribution = detectDistribution(numericValues);
        
        // Detect outliers using IQR method
        const q1 = ss.quantile(numericValues, 0.25);
        const q3 = ss.quantile(numericValues, 0.75);
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        info.outliers = numericValues.filter(val => val < lowerBound || val > upperBound);
      }

      analysis[column] = info;
    });

    setColumnInfo(analysis);
  };

  const detectDistribution = (values: number[]): string => {
    if (values.length < 10) return 'Insufficient data';
    
    const mean = ss.mean(values);
    const std = ss.standardDeviation(values);
    const skewness = ss.sampleSkewness(values);
    
    // Simple distribution detection logic
    if (Math.abs(skewness) < 0.5) {
      return 'Normal';
    } else if (skewness > 1) {
      return 'Right-skewed';
    } else if (skewness < -1) {
      return 'Left-skewed';
    } else if (values.every(v => v >= 0) && mean < std) {
      return 'Exponential';
    } else {
      return 'Unknown';
    }
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const selectAllColumns = () => {
    const allColumns = Object.keys(columnInfo);
    setSelectedColumns(allColumns);
  };

  const clearSelection = () => {
    setSelectedColumns([]);
  };

  const generateCorrelationMatrix = () => {
    const numericColumns = selectedColumns.filter(col => columnInfo[col].type === 'numeric');
    if (numericColumns.length < 2) return;

    const matrix: number[][] = [];
    const labels = numericColumns;

    numericColumns.forEach((col1, i) => {
      matrix[i] = [];
      numericColumns.forEach((col2, j) => {
        const values1 = data.map(row => Number(row[col1])).filter(val => !isNaN(val));
        const values2 = data.map(row => Number(row[col2])).filter(val => !isNaN(val));
        
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          try {
            matrix[i][j] = ss.sampleCorrelation(values1, values2);
          } catch {
            matrix[i][j] = 0;
          }
        }
      });
    });

    setCorrelationData({
      z: matrix,
      x: labels,
      y: labels,
      type: 'heatmap',
      colorscale: 'RdBu',
      zmid: 0
    });
  };

  useEffect(() => {
    if (selectedColumns.length > 1) {
      generateCorrelationMatrix();
    }
  }, [selectedColumns]);

  const renderDistributionPlot = (column: string) => {
    const info = columnInfo[column];
    if (info.type !== 'numeric') return null;

    const values = data.map(row => Number(row[column])).filter(val => !isNaN(val));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{column} Distribution</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              info.distribution === 'Normal' ? 'bg-green-100 text-green-800' :
              info.distribution === 'Right-skewed' ? 'bg-orange-100 text-orange-800' :
              info.distribution === 'Left-skewed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {info.distribution}
            </span>
          </div>
        </div>
        
        <Plot
          data={[{
            x: values,
            type: 'histogram',
            nbinsx: 30,
            marker: { color: 'rgba(59, 130, 246, 0.7)' },
            name: 'Frequency'
          }]}
          layout={{
            title: `Distribution of ${column}`,
            xaxis: { title: column },
            yaxis: { title: 'Frequency' },
            height: 400,
            margin: { t: 50, r: 50, b: 50, l: 50 }
          }}
          config={{ responsive: true }}
        />
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-600 font-medium">Mean</p>
            <p className="text-gray-900">{info.mean?.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-green-600 font-medium">Median</p>
            <p className="text-gray-900">{info.median?.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-purple-600 font-medium">Std Dev</p>
            <p className="text-gray-900">{info.std?.toFixed(2)}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-orange-600 font-medium">Outliers</p>
            <p className="text-gray-900">{info.outliers?.length || 0}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderBoxPlot = (column: string) => {
    const info = columnInfo[column];
    if (info.type !== 'numeric') return null;

    const values = data.map(row => Number(row[column])).filter(val => !isNaN(val));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{column} Box Plot</h3>
        <Plot
          data={[{
            y: values,
            type: 'box',
            name: column,
            marker: { color: 'rgba(59, 130, 246, 0.7)' }
          }]}
          layout={{
            title: `Box Plot of ${column}`,
            yaxis: { title: column },
            height: 400,
            margin: { t: 50, r: 50, b: 50, l: 50 }
          }}
          config={{ responsive: true }}
        />
      </div>
    );
  };

  const renderCategoricalPlot = (column: string) => {
    const info = columnInfo[column];
    if (info.type !== 'categorical') return null;

    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined);
    const counts = values.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.keys(counts);
    const frequencies = Object.values(counts) as number[];

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{column} Distribution</h3>
        <Plot
          data={[{
            x: categories,
            y: frequencies,
            type: 'bar',
            marker: { color: 'rgba(139, 92, 246, 0.7)' }
          }]}
          layout={{
            title: `Distribution of ${column}`,
            xaxis: { title: column },
            yaxis: { title: 'Count' },
            height: 400,
            margin: { t: 50, r: 50, b: 50, l: 50 }
          }}
          config={{ responsive: true }}
        />
      </div>
    );
  };

  const renderMissingDataVisualization = () => {
    const columns = Object.keys(columnInfo);
    const missingData = columns.map(col => ({
      column: col,
      missing: columnInfo[col].missingPercentage
    }));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Missing Data Analysis</h3>
        <Plot
          data={[{
            x: missingData.map(d => d.column),
            y: missingData.map(d => d.missing),
            type: 'bar',
            marker: { 
              color: missingData.map(d => d.missing > 20 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)')
            }
          }]}
          layout={{
            title: 'Missing Data Percentage by Column',
            xaxis: { title: 'Columns' },
            yaxis: { title: 'Missing %' },
            height: 400,
            margin: { t: 50, r: 50, b: 50, l: 50 }
          }}
          config={{ responsive: true }}
        />
        
        <div className="mt-4 space-y-2">
          {missingData.filter(d => d.missing > 0).map(d => (
            <div key={d.column} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{d.column}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                d.missing > 20 ? 'bg-red-100 text-red-800' :
                d.missing > 10 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {d.missing.toFixed(1)}% missing
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const analysisTypes = [
    { id: 'overview', name: 'Data Overview', icon: Database, color: 'blue' },
    { id: 'distribution', name: 'Distributions', icon: BarChart3, color: 'purple' },
    { id: 'correlation', name: 'Correlations', icon: TrendingUp, color: 'green' },
    { id: 'outliers', name: 'Outliers', icon: AlertTriangle, color: 'orange' },
    { id: 'missing', name: 'Missing Data', icon: Target, color: 'red' },
    { id: 'timeseries', name: 'Time Series', icon: Calendar, color: 'teal' }
  ];

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Exploratory Data Analysis</h1>
          <p className="text-xl text-gray-600">
            Interactive analysis of <span className="font-semibold text-blue-600">{fileName}</span> 
            • {data.length} rows • {Object.keys(columnInfo).length} columns
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <Hash className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                <p className="text-sm text-gray-600">Total Rows</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <Type className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(columnInfo).filter(c => c.type === 'numeric').length}
                </p>
                <p className="text-sm text-gray-600">Numeric Columns</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(columnInfo).filter(c => c.type === 'categorical').length}
                </p>
                <p className="text-sm text-gray-600">Categorical Columns</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(columnInfo).filter(c => c.type === 'datetime').length}
                </p>
                <p className="text-sm text-gray-600">DateTime Columns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Column Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Column Selection</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllColumns}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(columnInfo).map(([column, info]) => (
                  <label key={column} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => handleColumnToggle(column)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">{column}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          info.type === 'numeric' ? 'bg-blue-100 text-blue-800' :
                          info.type === 'categorical' ? 'bg-purple-100 text-purple-800' :
                          info.type === 'datetime' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {info.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {info.uniqueValues} unique • {info.missingPercentage.toFixed(1)}% missing
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Analysis Type Selector */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Type</h3>
              <div className="space-y-2">
                {analysisTypes.map((analysis) => {
                  const Icon = analysis.icon;
                  return (
                    <button
                      key={analysis.id}
                      onClick={() => setActiveAnalysis(analysis.id as any)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        activeAnalysis === analysis.id
                          ? `bg-${analysis.color}-50 text-${analysis.color}-600 border-2 border-${analysis.color}-200`
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{analysis.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Analysis Area */}
          <div className="lg:col-span-3">
            {/* Data Overview */}
            {activeAnalysis === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Dictionary</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique Values</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missing %</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(columnInfo).map(([column, info]) => (
                          <tr key={column} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{column}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                info.type === 'numeric' ? 'bg-blue-100 text-blue-800' :
                                info.type === 'categorical' ? 'bg-purple-100 text-purple-800' :
                                info.type === 'datetime' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {info.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{info.uniqueValues}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{info.missingPercentage.toFixed(1)}%</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {info.type === 'numeric' && info.min !== undefined && info.max !== undefined
                                ? `${info.min.toFixed(2)} - ${info.max.toFixed(2)}`
                                : 'N/A'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Analysis */}
            {activeAnalysis === 'distribution' && (
              <div className="space-y-6">
                {selectedColumns.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Columns to Analyze</h3>
                    <p className="text-gray-600">Choose one or more columns from the sidebar to view their distributions.</p>
                  </div>
                ) : (
                  selectedColumns.map(column => (
                    <div key={column}>
                      {columnInfo[column].type === 'numeric' && renderDistributionPlot(column)}
                      {columnInfo[column].type === 'categorical' && renderCategoricalPlot(column)}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Correlation Analysis */}
            {activeAnalysis === 'correlation' && (
              <div className="space-y-6">
                {selectedColumns.filter(col => columnInfo[col].type === 'numeric').length < 2 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select 2+ Numeric Columns</h3>
                    <p className="text-gray-600">Choose at least two numeric columns to analyze correlations.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Correlation Matrix</h2>
                    {correlationData && (
                      <Plot
                        data={[correlationData]}
                        layout={{
                          title: 'Correlation Heatmap',
                          height: 500,
                          margin: { t: 50, r: 50, b: 100, l: 100 }
                        }}
                        config={{ responsive: true }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Outlier Analysis */}
            {activeAnalysis === 'outliers' && (
              <div className="space-y-6">
                {selectedColumns.filter(col => columnInfo[col].type === 'numeric').length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Numeric Columns</h3>
                    <p className="text-gray-600">Choose numeric columns to detect outliers using IQR method.</p>
                  </div>
                ) : (
                  selectedColumns
                    .filter(col => columnInfo[col].type === 'numeric')
                    .map(column => renderBoxPlot(column))
                )}
              </div>
            )}

            {/* Missing Data Analysis */}
            {activeAnalysis === 'missing' && (
              <div className="space-y-6">
                {renderMissingDataVisualization()}
              </div>
            )}

            {/* Time Series Analysis */}
            {activeAnalysis === 'timeseries' && (
              <TimeSeriesAnalysis 
                data={data} 
                selectedColumns={selectedColumns} 
                columnInfo={columnInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDADashboard;