import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Zap, 
  Target,
  AlertCircle,
  Info,
  Play,
  Download,
  Settings
} from 'lucide-react';
import Plot from 'react-plotly.js';
import { format, parseISO, isValid } from 'date-fns';
import * as ss from 'simple-statistics';
import { polynomial } from 'regression';

interface TimeSeriesAnalysisProps {
  data: any[];
  selectedColumns: string[];
  columnInfo: { [key: string]: any };
}

interface TimeSeriesData {
  dates: Date[];
  values: number[];
  originalData: { date: Date; value: number; index: number }[];
}

interface DecompositionResult {
  trend: number[];
  seasonal: number[];
  residual: number[];
  dates: Date[];
}

interface ForecastResult {
  dates: Date[];
  forecast: number[];
  upperBound: number[];
  lowerBound: number[];
  confidence: number;
}

const TimeSeriesAnalysis: React.FC<TimeSeriesAnalysisProps> = ({ 
  data, 
  selectedColumns, 
  columnInfo 
}) => {
  const [timeSeriesData, setTimeSeriesData] = useState<{ [key: string]: TimeSeriesData }>({});
  const [selectedDateColumn, setSelectedDateColumn] = useState<string>('');
  const [selectedValueColumn, setSelectedValueColumn] = useState<string>('');
  const [activeAnalysis, setActiveAnalysis] = useState<'overview' | 'decomposition' | 'forecast' | 'trends' | 'seasonality'>('overview');
  const [decompositionResult, setDecompositionResult] = useState<DecompositionResult | null>(null);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [forecastPeriods, setForecastPeriods] = useState<number>(30);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Get datetime and numeric columns
  const dateColumns = Object.entries(columnInfo)
    .filter(([_, info]) => info.type === 'datetime' || isDateColumn(_))
    .map(([name]) => name);
  
  const numericColumns = Object.entries(columnInfo)
    .filter(([_, info]) => info.type === 'numeric')
    .map(([name]) => name);

  function isDateColumn(columnName: string): boolean {
    const sampleValues = data.slice(0, 10).map(row => row[columnName]);
    return sampleValues.some(val => {
      if (!val) return false;
      const parsed = new Date(val);
      return isValid(parsed) && !isNaN(parsed.getTime());
    });
  }

  // Auto-detect date columns if not explicitly marked
  useEffect(() => {
    if (dateColumns.length === 0) {
      // Try to find date-like columns
      const potentialDateColumns = Object.keys(columnInfo).filter(col => {
        const sampleValues = data.slice(0, 5).map(row => row[col]);
        return sampleValues.some(val => {
          if (typeof val === 'string') {
            return !isNaN(Date.parse(val));
          }
          return false;
        });
      });
      
      if (potentialDateColumns.length > 0 && !selectedDateColumn) {
        setSelectedDateColumn(potentialDateColumns[0]);
      }
    } else if (!selectedDateColumn) {
      setSelectedDateColumn(dateColumns[0]);
    }

    if (numericColumns.length > 0 && !selectedValueColumn) {
      setSelectedValueColumn(numericColumns[0]);
    }
  }, [data, columnInfo]);

  // Process time series data
  useEffect(() => {
    if (selectedDateColumn && selectedValueColumn) {
      processTimeSeriesData();
    }
  }, [selectedDateColumn, selectedValueColumn, data]);

  const processTimeSeriesData = () => {
    if (!selectedDateColumn || !selectedValueColumn) return;

    const processedData: { date: Date; value: number; index: number }[] = [];
    
    data.forEach((row, index) => {
      const dateValue = row[selectedDateColumn];
      const numericValue = row[selectedValueColumn];
      
      if (dateValue && numericValue !== null && numericValue !== undefined) {
        let date: Date;
        
        if (dateValue instanceof Date) {
          date = dateValue;
        } else if (typeof dateValue === 'string') {
          date = new Date(dateValue);
        } else {
          date = new Date(dateValue);
        }
        
        if (isValid(date) && !isNaN(Number(numericValue))) {
          processedData.push({
            date,
            value: Number(numericValue),
            index
          });
        }
      }
    });

    // Sort by date
    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    const tsData: TimeSeriesData = {
      dates: processedData.map(d => d.date),
      values: processedData.map(d => d.value),
      originalData: processedData
    };

    setTimeSeriesData({ [selectedValueColumn]: tsData });
  };

  // Simple seasonal decomposition using moving averages
  const performSeasonalDecomposition = () => {
    if (!timeSeriesData[selectedValueColumn]) return;

    setIsAnalyzing(true);
    
    const { dates, values } = timeSeriesData[selectedValueColumn];
    const n = values.length;
    
    if (n < 12) {
      setIsAnalyzing(false);
      return;
    }

    // Calculate trend using moving average (period = 12 for monthly seasonality)
    const period = Math.min(12, Math.floor(n / 4));
    const trend: number[] = new Array(n).fill(0);
    
    for (let i = Math.floor(period / 2); i < n - Math.floor(period / 2); i++) {
      let sum = 0;
      for (let j = i - Math.floor(period / 2); j <= i + Math.floor(period / 2); j++) {
        sum += values[j];
      }
      trend[i] = sum / period;
    }

    // Fill in the edges with linear extrapolation
    for (let i = 0; i < Math.floor(period / 2); i++) {
      trend[i] = trend[Math.floor(period / 2)];
      trend[n - 1 - i] = trend[n - 1 - Math.floor(period / 2)];
    }

    // Calculate detrended series
    const detrended = values.map((val, i) => val - trend[i]);

    // Calculate seasonal component
    const seasonal: number[] = new Array(n).fill(0);
    const seasonalAverages: { [key: number]: number[] } = {};
    
    detrended.forEach((val, i) => {
      const seasonIndex = i % period;
      if (!seasonalAverages[seasonIndex]) {
        seasonalAverages[seasonIndex] = [];
      }
      seasonalAverages[seasonIndex].push(val);
    });

    // Average seasonal components
    const seasonalPattern: number[] = [];
    for (let i = 0; i < period; i++) {
      if (seasonalAverages[i]) {
        seasonalPattern[i] = ss.mean(seasonalAverages[i]);
      } else {
        seasonalPattern[i] = 0;
      }
    }

    // Apply seasonal pattern
    for (let i = 0; i < n; i++) {
      seasonal[i] = seasonalPattern[i % period];
    }

    // Calculate residual
    const residual = values.map((val, i) => val - trend[i] - seasonal[i]);

    setDecompositionResult({
      trend,
      seasonal,
      residual,
      dates
    });

    setIsAnalyzing(false);
  };

  // Simple linear trend forecasting with confidence intervals
  const performForecast = () => {
    if (!timeSeriesData[selectedValueColumn]) return;

    setIsAnalyzing(true);

    const { dates, values } = timeSeriesData[selectedValueColumn];
    const n = values.length;

    // Convert dates to numeric values (days since first date)
    const firstDate = dates[0].getTime();
    const x = dates.map(date => (date.getTime() - firstDate) / (1000 * 60 * 60 * 24));
    
    // Fit polynomial regression (degree 2 for slight curve)
    const regressionData = x.map((xVal, i) => [xVal, values[i]]);
    const result = polynomial(regressionData, { order: 2 });

    // Generate future dates
    const lastDate = dates[dates.length - 1];
    const futureDates: Date[] = [];
    const futureX: number[] = [];
    
    for (let i = 1; i <= forecastPeriods; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      futureDates.push(futureDate);
      futureX.push(x[x.length - 1] + i);
    }

    // Calculate forecast values
    const forecast = futureX.map(xVal => result.predict(xVal)[1]);

    // Calculate residuals for confidence intervals
    const residuals = values.map((val, i) => val - result.predict(x[i])[1]);
    const residualStd = ss.standardDeviation(residuals);
    const confidenceMultiplier = 1.96; // 95% confidence interval

    const upperBound = forecast.map(val => val + confidenceMultiplier * residualStd);
    const lowerBound = forecast.map(val => val - confidenceMultiplier * residualStd);

    setForecastResult({
      dates: futureDates,
      forecast,
      upperBound,
      lowerBound,
      confidence: 95
    });

    setIsAnalyzing(false);
  };

  // Calculate trend statistics
  const calculateTrendStats = () => {
    if (!timeSeriesData[selectedValueColumn]) return null;

    const { values } = timeSeriesData[selectedValueColumn];
    const n = values.length;
    
    if (n < 2) return null;

    // Calculate overall trend
    const firstHalf = values.slice(0, Math.floor(n / 2));
    const secondHalf = values.slice(Math.floor(n / 2));
    
    const firstHalfMean = ss.mean(firstHalf);
    const secondHalfMean = ss.mean(secondHalf);
    const overallTrend = ((secondHalfMean - firstHalfMean) / firstHalfMean) * 100;

    // Calculate volatility
    const returns = values.slice(1).map((val, i) => (val - values[i]) / values[i]);
    const volatility = ss.standardDeviation(returns) * 100;

    // Detect trend direction
    const trendDirection = overallTrend > 5 ? 'Increasing' : 
                          overallTrend < -5 ? 'Decreasing' : 'Stable';

    return {
      overallTrend: overallTrend.toFixed(2),
      volatility: volatility.toFixed(2),
      trendDirection,
      dataPoints: n,
      timeSpan: `${format(timeSeriesData[selectedValueColumn].dates[0], 'MMM yyyy')} - ${format(timeSeriesData[selectedValueColumn].dates[n-1], 'MMM yyyy')}`
    };
  };

  const analysisTypes = [
    { id: 'overview', name: 'Overview', icon: Calendar, color: 'blue' },
    { id: 'decomposition', name: 'Decomposition', icon: BarChart3, color: 'purple' },
    { id: 'forecast', name: 'Forecasting', icon: TrendingUp, color: 'green' },
    { id: 'trends', name: 'Trend Analysis', icon: Activity, color: 'orange' },
    { id: 'seasonality', name: 'Seasonality', icon: Target, color: 'teal' }
  ];

  const trendStats = calculateTrendStats();

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Time Series Configuration</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Column</label>
            <select
              value={selectedDateColumn}
              onChange={(e) => setSelectedDateColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select date column...</option>
              {Object.keys(columnInfo).filter(col => 
                columnInfo[col].type === 'datetime' || isDateColumn(col)
              ).map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value Column</label>
            <select
              value={selectedValueColumn}
              onChange={(e) => setSelectedValueColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select value column...</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Periods</label>
            <input
              type="number"
              value={forecastPeriods}
              onChange={(e) => setForecastPeriods(Number(e.target.value))}
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {(!selectedDateColumn || !selectedValueColumn) && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Please select both a date column and a value column to perform time series analysis.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedDateColumn && selectedValueColumn && timeSeriesData[selectedValueColumn] && (
        <>
          {/* Analysis Type Selector */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
          </div>

          {/* Analysis Content */}
          <div className="space-y-6">
            {/* Overview */}
            {activeAnalysis === 'overview' && (
              <div className="space-y-6">
                {/* Time Series Plot */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Time Series Overview</h3>
                  <Plot
                    data={[{
                      x: timeSeriesData[selectedValueColumn].dates,
                      y: timeSeriesData[selectedValueColumn].values,
                      type: 'scatter',
                      mode: 'lines+markers',
                      name: selectedValueColumn,
                      line: { color: '#3b82f6', width: 2 },
                      marker: { size: 4, color: '#3b82f6' }
                    }]}
                    layout={{
                      title: `${selectedValueColumn} over Time`,
                      xaxis: { title: 'Date' },
                      yaxis: { title: selectedValueColumn },
                      height: 400,
                      margin: { t: 50, r: 50, b: 50, l: 50 }
                    }}
                    config={{ responsive: true }}
                  />
                </div>

                {/* Statistics */}
                {trendStats && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Time Series Statistics</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Overall Trend</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{trendStats.overallTrend}%</p>
                        <p className="text-sm text-blue-700">{trendStats.trendDirection}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-purple-900">Volatility</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">{trendStats.volatility}%</p>
                        <p className="text-sm text-purple-700">Standard deviation</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Time Span</span>
                        </div>
                        <p className="text-sm font-bold text-green-600">{trendStats.timeSpan}</p>
                        <p className="text-sm text-green-700">{trendStats.dataPoints} data points</p>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-orange-900">Data Quality</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-600">
                          {((timeSeriesData[selectedValueColumn].values.length / data.length) * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-orange-700">Complete records</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Seasonal Decomposition */}
            {activeAnalysis === 'decomposition' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Seasonal Decomposition</h3>
                    <button
                      onClick={performSeasonalDecomposition}
                      disabled={isAnalyzing}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      <span>{isAnalyzing ? 'Analyzing...' : 'Run Decomposition'}</span>
                    </button>
                  </div>

                  {decompositionResult ? (
                    <div className="space-y-6">
                      {/* Original Series */}
                      <Plot
                        data={[{
                          x: decompositionResult.dates,
                          y: timeSeriesData[selectedValueColumn].values,
                          type: 'scatter',
                          mode: 'lines',
                          name: 'Original',
                          line: { color: '#3b82f6' }
                        }]}
                        layout={{
                          title: 'Original Time Series',
                          height: 250,
                          margin: { t: 50, r: 50, b: 50, l: 50 }
                        }}
                        config={{ responsive: true }}
                      />

                      {/* Trend */}
                      <Plot
                        data={[{
                          x: decompositionResult.dates,
                          y: decompositionResult.trend,
                          type: 'scatter',
                          mode: 'lines',
                          name: 'Trend',
                          line: { color: '#10b981' }
                        }]}
                        layout={{
                          title: 'Trend Component',
                          height: 250,
                          margin: { t: 50, r: 50, b: 50, l: 50 }
                        }}
                        config={{ responsive: true }}
                      />

                      {/* Seasonal */}
                      <Plot
                        data={[{
                          x: decompositionResult.dates,
                          y: decompositionResult.seasonal,
                          type: 'scatter',
                          mode: 'lines',
                          name: 'Seasonal',
                          line: { color: '#8b5cf6' }
                        }]}
                        layout={{
                          title: 'Seasonal Component',
                          height: 250,
                          margin: { t: 50, r: 50, b: 50, l: 50 }
                        }}
                        config={{ responsive: true }}
                      />

                      {/* Residual */}
                      <Plot
                        data={[{
                          x: decompositionResult.dates,
                          y: decompositionResult.residual,
                          type: 'scatter',
                          mode: 'lines',
                          name: 'Residual',
                          line: { color: '#f59e0b' }
                        }]}
                        layout={{
                          title: 'Residual Component',
                          height: 250,
                          margin: { t: 50, r: 50, b: 50, l: 50 }
                        }}
                        config={{ responsive: true }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click "Run Decomposition" to analyze seasonal patterns</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Forecasting */}
            {activeAnalysis === 'forecast' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Time Series Forecasting</h3>
                    <button
                      onClick={performForecast}
                      disabled={isAnalyzing}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      <span>{isAnalyzing ? 'Forecasting...' : 'Generate Forecast'}</span>
                    </button>
                  </div>

                  {forecastResult ? (
                    <div className="space-y-6">
                      <Plot
                        data={[
                          {
                            x: timeSeriesData[selectedValueColumn].dates,
                            y: timeSeriesData[selectedValueColumn].values,
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Historical Data',
                            line: { color: '#3b82f6' },
                            marker: { size: 4 }
                          },
                          {
                            x: forecastResult.dates,
                            y: forecastResult.forecast,
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Forecast',
                            line: { color: '#10b981', dash: 'dash' },
                            marker: { size: 4 }
                          },
                          {
                            x: forecastResult.dates,
                            y: forecastResult.upperBound,
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Upper Bound',
                            line: { color: 'rgba(16, 185, 129, 0.3)' },
                            showlegend: false
                          },
                          {
                            x: forecastResult.dates,
                            y: forecastResult.lowerBound,
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Lower Bound',
                            line: { color: 'rgba(16, 185, 129, 0.3)' },
                            fill: 'tonexty',
                            fillcolor: 'rgba(16, 185, 129, 0.2)',
                            showlegend: false
                          }
                        ]}
                        layout={{
                          title: `${selectedValueColumn} Forecast (${forecastPeriods} periods)`,
                          xaxis: { title: 'Date' },
                          yaxis: { title: selectedValueColumn },
                          height: 500,
                          margin: { t: 50, r: 50, b: 50, l: 50 }
                        }}
                        config={{ responsive: true }}
                      />

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Forecast Summary</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-green-700">Forecast Period:</span>
                            <span className="ml-2 font-medium">{forecastPeriods} periods</span>
                          </div>
                          <div>
                            <span className="text-green-700">Confidence Level:</span>
                            <span className="ml-2 font-medium">{forecastResult.confidence}%</span>
                          </div>
                          <div>
                            <span className="text-green-700">Method:</span>
                            <span className="ml-2 font-medium">Polynomial Regression</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click "Generate Forecast" to predict future values</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Integration Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Advanced Time Series Integration Points</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <p className="font-medium mb-1">Prophet Forecasting:</p>
                  <p>Integrate Facebook Prophet for advanced forecasting with holiday effects and changepoint detection</p>
                </div>
                <div>
                  <p className="font-medium mb-1">ARIMA Models:</p>
                  <p>Add ARIMA/SARIMA models for sophisticated time series modeling and forecasting</p>
                </div>
                <div>
                  <p className="font-medium mb-1">STL Decomposition:</p>
                  <p>Implement Seasonal and Trend decomposition using Loess for robust seasonal analysis</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Anomaly Detection:</p>
                  <p>Add time series anomaly detection using statistical methods and machine learning</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeSeriesAnalysis;