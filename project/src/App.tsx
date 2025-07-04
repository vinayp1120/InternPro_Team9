import React, { useState } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import EDADashboard from './components/EDADashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'upload' | 'analysis'>('landing');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (data: any[], name: string) => {
    setUploadedData(data);
    setFileName(name);
    setCurrentPage('analysis');
  };

  const handleNavigate = (page: 'landing' | 'upload' | 'analysis') => {
    // Only allow navigation to analysis if data is uploaded
    if (page === 'analysis' && uploadedData.length === 0) {
      setCurrentPage('upload');
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        hasData={uploadedData.length > 0}
      />
      
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('upload')} />
      )}
      
      {currentPage === 'upload' && (
        <UploadPage onFileUpload={handleFileUpload} />
      )}
      
      {currentPage === 'analysis' && uploadedData.length > 0 && (
        <EDADashboard data={uploadedData} fileName={fileName} />
      )}
    </div>
  );
}

export default App;