import React, { useState } from 'react';
import { Layout, Plus, BarChart3, PieChart, TrendingUp, Table, Filter, Settings, Eye, Download, Grid, Maximize2 } from 'lucide-react';
import { DataModel } from '../App';

interface DashboardBuilderProps {
  dataModel: DataModel;
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'card' | 'filter';
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  title: string;
  table: string;
  columns: string[];
  position: { x: number; y: number; w: number; h: number };
  settings: {
    colorScheme: string;
    showLegend: boolean;
    showGrid: boolean;
  };
}

const DashboardBuilder: React.FC<DashboardBuilderProps> = ({ dataModel }) => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showWidgetPanel, setShowWidgetPanel] = useState(true);

  const tableNames = Object.keys(dataModel.tables);
  const firstTable = tableNames[0] || '';

  const addWidget = (type: DashboardWidget['type'], chartType?: DashboardWidget['chartType']) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      chartType,
      title: `New ${type === 'chart' ? chartType : type}`,
      table: firstTable,
      columns: firstTable ? Object.keys(dataModel.tables[firstTable][0] || {}).slice(0, 2) : [],
      position: { x: 0, y: 0, w: 4, h: 3 },
      settings: {
        colorScheme: 'blue',
        showLegend: true,
        showGrid: true
      }
    };
    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidget(newWidget.id);
  };

  const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  };

  const deleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    setSelectedWidget(null);
  };

  const selectedWidgetData = selectedWidget ? widgets.find(w => w.id === selectedWidget) : null;

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Builder</h1>
              <p className="text-xl text-gray-600">
                Create interactive dashboards with drag-and-drop widgets.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isPreviewMode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Widget Panel */}
          {!isPreviewMode && showWidgetPanel && (
            <div className="w-80 bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Widgets</h3>
              
              {/* Chart Widgets */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Charts</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addWidget('chart', 'bar')}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-center"
                  >
                    <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Bar Chart</span>
                  </button>
                  <button
                    onClick={() => addWidget('chart', 'line')}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 text-center"
                  >
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Line Chart</span>
                  </button>
                  <button
                    onClick={() => addWidget('chart', 'pie')}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 text-center"
                  >
                    <PieChart className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Pie Chart</span>
                  </button>
                  <button
                    onClick={() => addWidget('chart', 'area')}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 text-center"
                  >
                    <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Area Chart</span>
                  </button>
                </div>
              </div>

              {/* Other Widgets */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Data Widgets</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => addWidget('table')}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3"
                  >
                    <Table className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Data Table</span>
                  </button>
                  <button
                    onClick={() => addWidget('card')}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3"
                  >
                    <Grid className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">KPI Card</span>
                  </button>
                  <button
                    onClick={() => addWidget('filter')}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3"
                  >
                    <Filter className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Filter Panel</span>
                  </button>
                </div>
              </div>

              {/* Widget Settings */}
              {selectedWidgetData && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Widget Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={selectedWidgetData.title}
                        onChange={(e) => updateWidget(selectedWidget!, { title: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Data Source</label>
                      <select
                        value={selectedWidgetData.table}
                        onChange={(e) => updateWidget(selectedWidget!, { table: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        {tableNames.map(table => (
                          <option key={table} value={table}>{table}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Color Scheme</label>
                      <select
                        value={selectedWidgetData.settings.colorScheme}
                        onChange={(e) => updateWidget(selectedWidget!, { 
                          settings: { ...selectedWidgetData.settings, colorScheme: e.target.value }
                        })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                    <button
                      onClick={() => deleteWidget(selectedWidget!)}
                      className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete Widget
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dashboard Canvas */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm min-h-[600px] p-6">
              {widgets.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Empty Dashboard</h3>
                    <p className="text-gray-600 mb-4">Add widgets from the panel to start building your dashboard.</p>
                    <button
                      onClick={() => addWidget('chart', 'bar')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add First Widget</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4 h-full">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`col-span-${widget.position.w} row-span-${widget.position.h} border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedWidget === widget.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedWidget(widget.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{widget.title}</h4>
                        {!isPreviewMode && (
                          <div className="flex items-center space-x-1">
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <Settings className="h-3 w-3 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <Maximize2 className="h-3 w-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                        {widget.type === 'chart' && (
                          <div className="text-center">
                            {widget.chartType === 'bar' && <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />}
                            {widget.chartType === 'line' && <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />}
                            {widget.chartType === 'pie' && <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />}
                            <p className="text-sm text-gray-600">
                              PLACEHOLDER: {widget.chartType} chart visualization
                            </p>
                          </div>
                        )}
                        {widget.type === 'table' && (
                          <div className="text-center">
                            <Table className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">PLACEHOLDER: Data table</p>
                          </div>
                        )}
                        {widget.type === 'card' && (
                          <div className="text-center">
                            <Grid className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">PLACEHOLDER: KPI card</p>
                          </div>
                        )}
                        {widget.type === 'filter' && (
                          <div className="text-center">
                            <Filter className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">PLACEHOLDER: Filter panel</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Dashboard Integration Points</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-1">Widget Rendering:</p>
              <p>Replace placeholder widgets with actual chart libraries (Chart.js, D3.js, etc.)</p>
            </div>
            <div>
              <p className="font-medium mb-1">Layout Engine:</p>
              <p>Implement react-grid-layout for drag-and-drop positioning and resizing</p>
            </div>
            <div>
              <p className="font-medium mb-1">Data Binding:</p>
              <p>Connect widgets to data model with real-time filtering and cross-filtering</p>
            </div>
            <div>
              <p className="font-medium mb-1">Export Functionality:</p>
              <p>Add PDF/PNG export capabilities and dashboard sharing features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilder;