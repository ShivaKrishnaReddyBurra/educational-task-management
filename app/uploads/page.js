// app/uploads/page.js (App Router)
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PDFViewer = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPDFFiles();
  }, []);

  const fetchPDFFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pdf-files');
      if (!response.ok) {
        throw new Error('Failed to fetch PDF files');
      }
      const files = await response.json();
      setPdfFiles(files);
      
      // Auto-select first PDF if available
      if (files.length > 0) {
        setSelectedPdf(files[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSelect = (pdfFile) => {
    setSelectedPdf(pdfFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PDF files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading PDFs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPDFFiles}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">PDF Viewer</h1>
            <button
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {pdfFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No PDF files found</h3>
            <p className="text-gray-500">Upload some PDF files to view them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* PDF List Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    PDF Files ({pdfFiles.length})
                  </h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {pdfFiles.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => handlePdfSelect(file)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPdf?.name === file.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-red-500 text-xl">📄</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.displayName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(file.modified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="lg:col-span-3">
              {selectedPdf ? (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {selectedPdf.displayName}
                    </h3>
                    <div className="flex space-x-2">
                      <a
                        href={`/uploads/${selectedPdf.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Open in New Tab
                      </a>
                      <a
                        href={`/uploads/${selectedPdf.name}`}
                        download
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  
                  {/* PDF Embed */}
                  <div className="p-4">
                    <div className="w-full h-screen max-h-[800px] border rounded">
                      <iframe
                        src={`/uploads/${selectedPdf.name}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                        className="w-full h-full rounded"
                        title={selectedPdf.displayName}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a PDF to view</h3>
                  <p className="text-gray-500">Choose a PDF from the list to display it here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;