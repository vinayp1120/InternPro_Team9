import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Database } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface UploadPageProps {
  onFileUpload: (data: any[], fileName: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileProcessing(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
  };

  const handleFileProcessing = async (file: File) => {
    setFileName(file.name);
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      let data: any[] = [];
      
      if (file.name.endsWith('.csv')) {
        // Parse CSV file
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        
        if (result.errors.length > 0) {
          throw new Error('CSV parsing error: ' + result.errors[0].message);
        }
        
        data = result.data;
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('Unsupported file format. Please upload .xlsx, .xls, or .csv files.');
      }

      if (data.length === 0) {
        throw new Error('The file appears to be empty or has no valid data.');
      }

      // Validate data structure
      if (Object.keys(data[0]).length === 0) {
        throw new Error('No columns detected. Please ensure your file has proper headers.');
      }

      setUploadStatus('success');
      setTimeout(() => {
        onFileUpload(data, file.name);
      }, 1000);

    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const loadSampleData = () => {
    const sampleData = [
      { month: 'January', revenue: 45000, expenses: 32000, profit: 13000, customers: 1200, region: 'North' },
      { month: 'February', revenue: 52000, expenses: 35000, profit: 17000, customers: 1350, region: 'North' },
      { month: 'March', revenue: 48000, expenses: 33000, profit: 15000, customers: 1280, region: 'South' },
      { month: 'April', revenue: 61000, expenses: 38000, profit: 23000, customers: 1450, region: 'East' },
      { month: 'May', revenue: 55000, expenses: 36000, profit: 19000, customers: 1380, region: 'West' },
      { month: 'June', revenue: 67000, expenses: 41000, profit: 26000, customers: 1520, region: 'North' },
      { month: 'July', revenue: 72000, expenses: 43000, profit: 29000, customers: 1600, region: 'South' },
      { month: 'August', revenue: 69000, expenses: 42000, profit: 27000, customers: 1580, region: 'East' },
      { month: 'September', revenue: 64000, expenses: 39000, profit: 25000, customers: 1480, region: 'West' },
      { month: 'October', revenue: 58000, expenses: 37000, profit: 21000, customers: 1420, region: 'North' },
      { month: 'November', revenue: 71000, expenses: 44000, profit: 27000, customers: 1550, region: 'South' },
      { month: 'December', revenue: 78000, expenses: 47000, profit: 31000, customers: 1650, region: 'East' },
    ];
    
    setFileName('sample-business-data.xlsx');
    setUploadStatus('success');
    setTimeout(() => {
      onFileUpload(sampleData, 'sample-business-data.xlsx');
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your Data for Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload Excel or CSV files to perform comprehensive exploratory data analysis. 
            Get instant insights with distribution analysis, correlation matrices, and outlier detection.
          </p>
        </div>

        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : uploadStatus === 'success'
                ? 'border-green-400 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadStatus === 'uploading'}
            />
            
            <div className="space-y-4">
              {uploadStatus === 'idle' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Drop your data file here
                    </h3>
                    <p className="text-gray-600">
                      or <span className="text-blue-600 font-medium">click to browse</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports .xlsx, .xls, and .csv files up to 10MB
                    </p>
                  </div>
                </>
              )}
              
              {uploadStatus === 'uploading' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <FileSpreadsheet className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Processing {fileName}...
                    </h3>
                    <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Parsing data and detecting column types...
                    </p>
                  </div>
                </>
              )}
              
              {uploadStatus === 'success' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      File uploaded successfully!
                    </h3>
                    <p className="text-gray-600">
                      Redirecting to analysis dashboard...
                    </p>
                  </div>
                </>
              )}
              
              {uploadStatus === 'error' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">
                      Upload failed
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {errorMessage}
                    </p>
                    <button
                      onClick={() => setUploadStatus('idle')}
                      className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sample Data Option */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">Don't have data ready? Try our sample dataset:</p>
          <button
            onClick={loadSampleData}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Database className="h-5 w-5" />
            <span>Load Sample Business Data</span>
          </button>
        </div>

        {/* File Format Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported File Formats</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">.xlsx</p>
                <p className="text-sm text-gray-600">Excel 2007+</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">.xls</p>
                <p className="text-sm text-gray-600">Excel 97-2003</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">.csv</p>
                <p className="text-sm text-gray-600">Comma Separated</p>
              </div>
            </div>
          </div>
        </div>

        {/* EDA Features Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get After Upload</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Automatic distribution detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Outlier identification</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Correlation heatmaps</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Missing data analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Interactive visualizations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Data dictionary generation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;