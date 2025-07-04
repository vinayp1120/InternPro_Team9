import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Settings, Table, Filter, Eye, Calculator, Database, Sliders, Code } from 'lucide-react';
import ChartDisplay from './ChartDisplay';
import DataTable from './DataTable';
import AnalysisPanel from './AnalysisPanel';

interface DashboardProps {
  data: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'histogram'>('bar');
  const [activeView, setActiveView] = useState<'chart' | 'table' | 'analysis'>('chart');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['month', 'revenue', 'profit']);
  const [chartSettings, setChartSettings] = useState({
    title: 'Data Visualization',
    colorScheme: 'blue',
    showLegend: true,
    showGrid: true,
    animation: true,
    chartSize: 'medium'
  });

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, color: 'blue' },
    { id: 'line', name: 'Line Chart', icon: TrendingUp, color: 'green' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, color: 'purple' },
    { id: 'area', name: 'Area Chart', icon: TrendingUp, color: 'orange' },
    { id: 'scatter', name: 'Scatter Plot', icon: BarChart3, color: 'teal' },
    { id: 'histogram', name: 'Histogram', icon: BarChart3, color: 'pink' },
  ];

  const availableColumns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const exportChart = (format: 'png' | 'svg' | 'pdf') => {
    // PLACEHOLDER: Add your chart export logic here
    console.log(`Exporting chart as ${format.toUpperCase()}...`);
    alert(`Export functionality will be implemented here. Format: ${format.toUpperCase()}`);
  };

  const handleSettingChange = (setting: string, value: any) => {
    setChartSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Analysis Dashboard</h1>
          <p className="text-xl text-gray-600">
            Explore your data with advanced visualizations and statistical analysis tools.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('chart')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'chart'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Visualizations</span>
              </button>
              <button
                onClick={() => setActiveView('table')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Table className="h-4 w-4" />
                <span>Data Table</span>
              </button>
              <button
                onClick={() => setActiveView('analysis')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'analysis'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Analysis</span>
              </button>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportChart('png')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>PNG</span>
              </button>
              <button
                onClick={() => exportChart('svg')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>SVG</span>
              </button>
              <button
                onClick={() => exportChart('pdf')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Chart Types */}
            {activeView === 'chart' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Chart Types</span>
                </h3>
                <div className="space-y-2">
                  {chartTypes.map((chart) => {
                    const Icon = chart.icon;
                    return (
                      <button
                        key={chart.id}
                        onClick={() => setActiveChart(chart.id as any)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                          activeChart === chart.id
                            ? `bg-${chart.color}-50 text-${chart.color}-600 border-2 border-${chart.color}-200`
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{chart.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Column Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Data Columns</span>
              </h3>
              <div className="space-y-2">
                {availableColumns.map((column) => (
                  <label key={column} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => handleColumnToggle(column)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 capitalize">{column}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chart Settings */}
            {activeView === 'chart' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Sliders className="h-5 w-5" />
                  <span>Customization</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      value={chartSettings.title}
                      onChange={(e) => handleSettingChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Scheme
                    </label>
                    <select 
                      value={chartSettings.colorScheme}
                      onChange={(e) => handleSettingChange('colorScheme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="blue">Blue Gradient</option>
                      <option value="purple">Purple Gradient</option>
                      <option value="green">Green Gradient</option>
                      <option value="orange">Orange Gradient</option>
                      <option value="rainbow">Rainbow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chart Size
                    </label>
                    <select 
                      value={chartSettings.chartSize}
                      onChange={(e) => handleSettingChange('chartSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.showLegend}
                        onChange={(e) => handleSettingChange('showLegend', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Show Legend</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.showGrid}
                        onChange={(e) => handleSettingChange('showGrid', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Show Grid</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.animation}
                        onChange={(e) => handleSettingChange('animation', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable Animations</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Code Integration Notice */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Code className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">Integration Ready</h3>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                This dashboard is prepared for your custom visualization and analysis code. 
                Check the component files for integration placeholders.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeView === 'chart' && (
              <ChartDisplay
                data={data}
                chartType={activeChart}
                selectedColumns={selectedColumns}
                settings={chartSettings}
              />
            )}
            {activeView === 'table' && (
              <DataTable data={data} selectedColumns={selectedColumns} />
            )}
            {activeView === 'analysis' && (
              <AnalysisPanel data={data} selectedColumns={selectedColumns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;