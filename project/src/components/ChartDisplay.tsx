import React from 'react';

interface ChartDisplayProps {
  data: any[];
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'histogram';
  selectedColumns: string[];
  settings: {
    title: string;
    colorScheme: string;
    showLegend: boolean;
    showGrid: boolean;
    animation: boolean;
    chartSize: string;
  };
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, chartType, selectedColumns, settings }) => {
  // PLACEHOLDER: Replace this section with your actual chart library integration
  // Popular options: Chart.js, D3.js, Recharts, Victory, or custom WebGL solutions
  
  const renderChart = () => {
    // PLACEHOLDER: Add your chart rendering logic here
    // This is where you'll integrate your preferred charting library
    
    if (chartType === 'bar') {
      return <BarChart data={data} columns={selectedColumns} settings={settings} />;
    } else if (chartType === 'line') {
      return <LineChart data={data} columns={selectedColumns} settings={settings} />;
    } else if (chartType === 'pie') {
      return <PieChart data={data} columns={selectedColumns} settings={settings} />;
    } else if (chartType === 'area') {
      return <AreaChart data={data} columns={selectedColumns} settings={settings} />;
    } else if (chartType === 'scatter') {
      return <ScatterChart data={data} columns={selectedColumns} settings={settings} />;
    } else if (chartType === 'histogram') {
      return <HistogramChart data={data} columns={selectedColumns} settings={settings} />;
    }
    return null;
  };

  const chartHeight = settings.chartSize === 'small' ? '400px' : 
                    settings.chartSize === 'large' ? '700px' : '500px';

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {settings.title}
        </h2>
        <p className="text-gray-600">
          {chartType.charAt(0).toUpperCase() + chartType.slice(1)} visualization of {selectedColumns.length} selected columns
        </p>
        
        {/* PLACEHOLDER: Chart Integration Notice */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Integration Point:</strong> Replace the mock charts below with your preferred charting library 
            (Chart.js, D3.js, Recharts, etc.). Chart settings and data are passed as props.
          </p>
        </div>
      </div>
      
      <div style={{ minHeight: chartHeight }} className="flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  );
};

// PLACEHOLDER: Mock Chart Components - Replace with your actual chart library
// These are simplified examples showing the structure for integration

const BarChart: React.FC<{ data: any[]; columns: string[]; settings: any }> = ({ data, columns, settings }) => {
  const maxValue = Math.max(...data.map(item => Math.max(...columns.filter(col => typeof item[col] === 'number').map(col => item[col]))));
  
  return (
    <div className="w-full h-full">
      <div className="flex items-end justify-center space-x-4 h-96">
        {data.slice(0, 8).map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {columns.filter(col => typeof item[col] === 'number').map((col, colIndex) => (
                <div
                  key={col}
                  className={`w-8 rounded-t-lg transition-all duration-500 ${
                    settings.colorScheme === 'blue' ? 'bg-gradient-to-t from-blue-600 to-blue-400' :
                    settings.colorScheme === 'purple' ? 'bg-gradient-to-t from-purple-600 to-purple-400' :
                    settings.colorScheme === 'green' ? 'bg-gradient-to-t from-green-600 to-green-400' :
                    'bg-gradient-to-t from-orange-600 to-orange-400'
                  }`}
                  style={{
                    height: `${(item[col] / maxValue) * 250}px`,
                    animationDelay: settings.animation ? `${index * 100}ms` : '0ms'
                  }}
                ></div>
              ))}
            </div>
            <span className="text-xs text-gray-600 font-medium transform -rotate-45 origin-left">
              {item[columns[0]] || `Item ${index + 1}`}
            </span>
          </div>
        ))}
      </div>
      {settings.showLegend && (
        <div className="mt-8 flex justify-center space-x-6">
          {columns.filter(col => typeof data[0]?.[col] === 'number').map((col, index) => (
            <div key={col} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${
                settings.colorScheme === 'blue' ? 'bg-blue-600' :
                settings.colorScheme === 'purple' ? 'bg-purple-600' :
                settings.colorScheme === 'green' ? 'bg-green-600' :
                'bg-orange-600'
              }`}></div>
              <span className="text-sm text-gray-700 capitalize">{col}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LineChart: React.FC<{ data: any[]; columns: string[]; settings: any }> = ({ data, columns, settings }) => {
  return (
    <div className="w-full h-full">
      <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          {settings.showGrid && (
            <>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 50}
                  x2="800"
                  y2={i * 50}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </>
          )}
          
          <polyline
            fill="none"
            stroke={settings.colorScheme === 'blue' ? '#3b82f6' : 
                   settings.colorScheme === 'purple' ? '#8b5cf6' :
                   settings.colorScheme === 'green' ? '#10b981' : '#f97316'}
            strokeWidth="3"
            points="50,200 150,150 250,180 350,120 450,140 550,100 650,110 750,80"
            className={settings.animation ? "animate-pulse" : ""}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/80 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Line Chart Visualization</h3>
            <p className="text-gray-600">PLACEHOLDER: Integrate your charting library here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PieChart: React.FC<{ data: any[]; columns: string[]; settings: any }> = ({ data, columns, settings }) => {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${
            settings.colorScheme === 'blue' ? 'from-blue-400 via-blue-500 to-blue-600' :
            settings.colorScheme === 'purple' ? 'from-purple-400 via-purple-500 to-purple-600' :
            settings.colorScheme === 'green' ? 'from-green-400 via-green-500 to-green-600' :
            'from-orange-400 via-orange-500 to-orange-600'
          } ${settings.animation ? 'animate-spin-slow' : ''}`}></div>
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Pie Chart</h3>
              <p className="text-sm text-gray-600">PLACEHOLDER</p>
            </div>
          </div>
        </div>
      </div>
      
      {settings.showLegend && (
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          {data.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-sm text-gray-700">
                {item[columns[0]] || `Segment ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AreaChart: React.FC<{ data: any[]; columns: string[]; settings: any }> = ({ data, columns, settings }) => {
  return (
    <div className="w-full h-full">
      <div className="relative h-96 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-8">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          {settings.showGrid && (
            <>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 50}
                  x2="800"
                  y2={i * 50}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </>
          )}
          
          <polygon
            fill="url(#areaGradient)"
            points="50,300 50,180 150,140 250,160 350,100 450,120 550,80 650,90 750,60 750,300"
            className="opacity-80"
          />
          
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            points="50,180 150,140 250,160 350,100 450,120 550,80 650,90 750,60"
          />
          
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/80 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Area Chart Visualization</h3>
            <p className="text-gray-600">PLACEHOLDER: Integrate your charting library here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScatterChart: React.FC<{ data: any[]; columns: string[]; settings: any }> = ({ data, columns, settings }) => {
  return (
    <div className="w-full h-full">
      <div className="relative h-96 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-8">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          {settings.showGrid && (
            <>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 50}
                  x2="800"
                  y2={i * 50}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </>
          )}
          
          {/* Sample scatter points */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={50 + (i * 35)}
              cy={50 + Math.random() * 200}
              r="4"
              fill="#14b8a6"
              className={settings.animation ? "animate-pulse" : ""}
            />
          ))}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/80 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Scatter Plot</h3>
            <p className="text-gray-600">PLACEHOLDER: Integrate your charting library here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistogramChart: React.FC<{ data: any[]; columns: string[]; settings: any }> = ({ data, columns, settings }) => {
  return (
    <div className="w-full h-full">
      <div className="flex items-end justify-center space-x-1 h-96">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className={`w-8 rounded-t-lg transition-all duration-500 ${
              settings.colorScheme === 'blue' ? 'bg-gradient-to-t from-blue-600 to-blue-400' :
              settings.colorScheme === 'purple' ? 'bg-gradient-to-t from-purple-600 to-purple-400' :
              settings.colorScheme === 'green' ? 'bg-gradient-to-t from-green-600 to-green-400' :
              'bg-gradient-to-t from-pink-600 to-pink-400'
            }`}
            style={{
              height: `${Math.random() * 250 + 50}px`,
              animationDelay: settings.animation ? `${index * 50}ms` : '0ms'
            }}
          ></div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Histogram Distribution</h3>
        <p className="text-gray-600">PLACEHOLDER: Integrate your charting library here</p>
      </div>
    </div>
  );
};

export default ChartDisplay;