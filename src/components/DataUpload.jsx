import React, { useState, useRef } from 'react';

const DataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ status: null, message: '' });
  const [uploadedDatasets, setUploadedDatasets] = useState([]);
  const fileInputRef = useRef(null);

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  // Common file selection handler
  const handleFileSelection = (file) => {
    // Check file type (allow JSON and CSV)
    const allowedTypes = ['application/json', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        status: 'error',
        message: 'Invalid file type. Please upload JSON or CSV files only.'
      });
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadStatus({
        status: 'error',
        message: 'File size exceeds 10MB limit.'
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ status: null, message: '' });
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setUploadStatus({ status: null, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload file to server
  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus({ status: null, message: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('dataType', selectedFile.type.includes('json') ? 'json' : 'csv');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          status: 'success',
          message: result.message || 'File uploaded successfully!'
        });
        clearFile();
        
        // Refresh the list of uploaded datasets
        fetchUploadedDatasets();
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus({
        status: 'error',
        message: `Upload failed: ${error.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch the list of uploaded datasets
  const fetchUploadedDatasets = async () => {
    try {
      const response = await fetch('/api/uploads');
      if (response.ok) {
        const data = await response.json();
        setUploadedDatasets(data.uploads);
      } else {
        console.error('Failed to fetch uploads');
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  // Initialize component by fetching existing uploads
  React.useEffect(() => {
    fetchUploadedDatasets();
  }, []);

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2>Data Upload</h2>
        <div className="card-header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={fetchUploadedDatasets}
            title="Refresh uploads list"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-12 mb-4">
            <p>
              Upload JSON or CSV files to populate your dashboard with custom data.
              Maximum file size is 10MB.
            </p>
          </div>
          
          <div className="col-12">
            <div className="data-upload-container">
              {/* File upload area */}
              <div 
                className={`file-upload-area ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!selectedFile ? (
                  <div className="file-upload-content">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop your file here, or</p>
                    <button 
                      className="browse-button" 
                      onClick={triggerFileInput}
                    >
                      Browse Files
                    </button>
                    <input 
                      type="file" 
                      className="file-input" 
                      onChange={handleFileChange}
                      accept=".json,.csv"
                      ref={fileInputRef}
                    />
                  </div>
                ) : (
                  <div className="selected-file">
                    <div className="file-info">
                      <i className={selectedFile.type.includes('json') ? 'fas fa-file-code' : 'fas fa-file-csv'}></i>
                      <div>
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={uploadFile}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Uploading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload"></i> Upload
                          </>
                        )}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={clearFile}
                        disabled={isUploading}
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload status alerts */}
              {uploadStatus.status && (
                <div className={`alert alert-${uploadStatus.status === 'success' ? 'success' : 'danger'}`}>
                  <i className={`fas fa-${uploadStatus.status === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2`}></i>
                  {uploadStatus.message}
                </div>
              )}
            </div>
          </div>

          {/* List of uploaded datasets */}
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-header">
                <h3>Uploaded Datasets</h3>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Filename</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedDatasets && uploadedDatasets.length > 0 ? (
                        uploadedDatasets.map((dataset, index) => (
                          <tr key={index}>
                            <td>{dataset.file_name}</td>
                            <td>{dataset.file_type}</td>
                            <td>{formatFileSize(dataset.file_size)}</td>
                            <td>{new Date(dataset.upload_date).toLocaleString()}</td>
                            <td>
                              <span className={`status status-${(dataset.status || 'Processed').toLowerCase()}`}>
                                {dataset.status || 'Processed'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="action-icon" 
                                  title="Download"
                                  onClick={() => window.open(`/api/download/${dataset.id}`, '_blank')}
                                >
                                  <i className="fas fa-download"></i>
                                </button>
                                <button 
                                  className="action-icon" 
                                  title="Apply to Dashboard"
                                  onClick={async () => {
                                    if (window.confirm('Apply this data to the dashboard? This may update existing records.')) {
                                      try {
                                        setIsUploading(true); // Reuse the loading state
                                        const response = await fetch(`/api/uploads/${dataset.id}/apply`, {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify({ sections: [] }) // Apply all sections
                                        });
                                        
                                        if (response.ok) {
                                          const result = await response.json();
                                          setUploadStatus({
                                            status: 'success',
                                            message: `Data successfully applied to dashboard. ${result.affected_records} records updated.`
                                          });
                                          fetchUploadedDatasets();
                                        } else {
                                          const error = await response.json();
                                          throw new Error(error.message || 'Failed to apply data');
                                        }
                                      } catch (error) {
                                        console.error('Error applying data:', error);
                                        setUploadStatus({
                                          status: 'error',
                                          message: `Failed to apply data: ${error.message}`
                                        });
                                      } finally {
                                        setIsUploading(false);
                                      }
                                    }
                                  }}
                                >
                                  <i className="fas fa-sync-alt"></i>
                                </button>
                                <button 
                                  className="action-icon" 
                                  title="Delete"
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this file?')) {
                                      try {
                                        const response = await fetch(`/api/upload/${dataset.id}`, {
                                          method: 'DELETE'
                                        });
                                        if (response.ok) {
                                          fetchUploadedDatasets();
                                        }
                                      } catch (error) {
                                        console.error('Error deleting file:', error);
                                      }
                                    }
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No datasets uploaded yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;