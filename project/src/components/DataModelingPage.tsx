import React, { useState } from 'react';
import { Database, Plus, Link, Calculator, Table, ArrowRight, Edit3, Trash2, Save } from 'lucide-react';
import { DataModel } from '../App';

interface DataModelingPageProps {
  dataModel: DataModel;
  onModelUpdate: (model: DataModel) => void;
  onProceedToDashboard: () => void;
}

const DataModelingPage: React.FC<DataModelingPageProps> = ({ 
  dataModel, 
  onModelUpdate, 
  onProceedToDashboard 
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'relationships' | 'measures'>('tables');
  const [newMeasure, setNewMeasure] = useState({ name: '', formula: '', table: '' });
  const [showMeasureForm, setShowMeasureForm] = useState(false);

  const tableNames = Object.keys(dataModel.tables);
  const firstTable = tableNames[0];
  const sampleData = firstTable ? dataModel.tables[firstTable] : [];

  const getColumnInfo = (tableName: string) => {
    const table = dataModel.tables[tableName];
    if (!table || table.length === 0) return [];
    
    const firstRow = table[0];
    return Object.keys(firstRow).map(column => ({
      name: column,
      type: typeof firstRow[column] === 'number' ? 'Number' : 
            typeof firstRow[column] === 'boolean' ? 'Boolean' : 'Text',
      sample: firstRow[column]
    }));
  };

  const addMeasure = () => {
    if (newMeasure.name && newMeasure.formula && newMeasure.table) {
      onModelUpdate({
        ...dataModel,
        measures: [...dataModel.measures, { ...newMeasure }]
      });
      setNewMeasure({ name: '', formula: '', table: '' });
      setShowMeasureForm(false);
    }
  };

  const deleteMeasure = (index: number) => {
    const updatedMeasures = dataModel.measures.filter((_, i) => i !== index);
    onModelUpdate({
      ...dataModel,
      measures: updatedMeasures
    });
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Model</h1>
          <p className="text-xl text-gray-600">
            Define relationships, create measures, and prepare your data for analysis.
          </p>
        </div>

        {/* Model Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Model Overview</h2>
            <button
              onClick={onProceedToDashboard}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Build Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Table className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Tables</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{tableNames.length}</p>
              <p className="text-sm text-gray-600">Data sources imported</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Link className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Relationships</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">{dataModel.relationships.length}</p>
              <p className="text-sm text-gray-600">Table connections</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Calculator className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Measures</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{dataModel.measures.length}</p>
              <p className="text-sm text-gray-600">Calculated fields</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'tables', name: 'Tables & Columns', icon: Table },
                { id: 'relationships', name: 'Relationships', icon: Link },
                { id: 'measures', name: 'Measures & Calculations', icon: Calculator }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Tables Tab */}
            {activeTab === 'tables' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Data Tables</h3>
                  <div className="text-sm text-gray-600">
                    {sampleData.length} rows in {firstTable}
                  </div>
                </div>
                
                {tableNames.map((tableName) => (
                  <div key={tableName} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900">{tableName}</h4>
                      <p className="text-sm text-gray-600">
                        {dataModel.tables[tableName].length} rows, {getColumnInfo(tableName).length} columns
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getColumnInfo(tableName).map((column, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{column.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  column.type === 'Number' ? 'bg-blue-100 text-blue-800' :
                                  column.type === 'Boolean' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {column.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{String(column.sample)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Relationships Tab */}
            {activeTab === 'relationships' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Table Relationships</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Relationship</span>
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl text-center">
                  <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Relationship Builder</h4>
                  <p className="text-gray-600 mb-4">
                    PLACEHOLDER: Implement visual relationship builder similar to Power BI
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Integration point for drag-and-drop relationship creation, 
                      cardinality detection, and cross-filter direction settings.
                    </p>
                  </div>
                </div>

                {dataModel.relationships.length > 0 && (
                  <div className="space-y-4">
                    {dataModel.relationships.map((rel, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">{rel.from.table}.{rel.from.column}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{rel.to.table}.{rel.to.column}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {rel.type}
                            </span>
                          </div>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Measures Tab */}
            {activeTab === 'measures' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Calculated Measures</h3>
                  <button
                    onClick={() => setShowMeasureForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Measure</span>
                  </button>
                </div>

                {showMeasureForm && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Measure</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Measure Name</label>
                        <input
                          type="text"
                          value={newMeasure.name}
                          onChange={(e) => setNewMeasure(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Total Revenue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Table</label>
                        <select
                          value={newMeasure.table}
                          onChange={(e) => setNewMeasure(prev => ({ ...prev, table: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select table...</option>
                          {tableNames.map(table => (
                            <option key={table} value={table}>{table}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">DAX Formula</label>
                      <textarea
                        value={newMeasure.formula}
                        onChange={(e) => setNewMeasure(prev => ({ ...prev, formula: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                        placeholder="e.g., SUM(Sales[Amount])"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={addMeasure}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Measure</span>
                      </button>
                      <button
                        onClick={() => setShowMeasureForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {dataModel.measures.map((measure, index) => (
                    <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{measure.name}</h4>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              {measure.table}
                            </span>
                          </div>
                          <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {measure.formula}
                          </code>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteMeasure(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {dataModel.measures.length === 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl text-center">
                    <Calculator className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Measures Created</h4>
                    <p className="text-gray-600 mb-4">
                      Create calculated measures to perform advanced analytics and aggregations.
                    </p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Common measure examples:</strong>
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Total Sales = SUM(Sales[Amount])</li>
                        <li>• Average Order Value = AVERAGE(Orders[Value])</li>
                        <li>• Growth Rate = (Current - Previous) / Previous</li>
                        <li>• Running Total = CALCULATE(SUM(Sales[Amount]), FILTER(ALL(Date), Date[Date] &lt;= MAX(Date[Date])))</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModelingPage;