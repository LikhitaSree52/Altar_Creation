import React, { useState, useEffect } from 'react';
import designService from '../services/designService';

const DesignManager = ({ 
  isOpen, 
  onClose, 
  onLoadDesign
}) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load user's designs
  const loadDesigns = async (page = 1, category = '', search = '') => {
    setLoading(true);
    setError('');
    
    try {
      const result = await designService.getUserDesigns(page, 10, category || null, search || null);
      
      if (result.success) {
        setDesigns(result.designs);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  // Load designs on component mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      loadDesigns();
    }
  }, [isOpen]);



  // Handle design load
  const handleLoadDesign = async (design) => {
    try {
      // Load the design directly from the list (no need to fetch again)
      onLoadDesign(design);
      onClose();
    } catch (err) {
      setError('Failed to load design');
    }
  };

  // Handle design delete
  const handleDeleteDesign = async (designId) => {
    if (!window.confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await designService.deleteDesign(designId);
      if (result.success) {
        loadDesigns(); // Reload the list
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete design');
    }
  };

  // Handle search
  const handleSearch = () => {
    loadDesigns(1, selectedCategory, searchTerm);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    loadDesigns(1, category, searchTerm);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        maxWidth: 800,
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          borderBottom: '1px solid #e0ddd7',
          paddingBottom: 16,
        }}>
          <h2 style={{ margin: 0, color: '#5a4a2c', fontSize: 24 }}>
            Load Your Designs
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#666',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Design List Section */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#5a4a2c' }}>
            Your Saved Designs
          </h3>

          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search designs..."
              style={{
                flex: 1,
                minWidth: 200,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #e0ddd7',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                background: 'linear-gradient(90deg, var(--primary-gradient-start, #ffb88c) 0%, var(--primary-gradient-end, #ea8d8d) 100%)',
                color: 'var(--modal-text)',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Search
            </button>
          </div>

          {error && (
            <div style={{ color: 'var(--danger, #d32f2f)', marginBottom: 12, fontSize: 14 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              Loading designs...
            </div>
          ) : designs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              No designs found. Save your first design using the "Save Design" button!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {designs.map((design) => (
                <div
                  key={design._id}
                  style={{
                    border: '1px solid #e0ddd7',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#5a4a2c' }}>
                        {design.name}
                        {design.isPublic && (
                          <span style={{
                            background: '#4caf50',
                            color: '#fff',
                            fontSize: 12,
                            padding: '2px 8px',
                            borderRadius: 12,
                            marginLeft: 8,
                          }}>
                            Public
                          </span>
                        )}
                      </h4>
                      {design.description && (
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: 14 }}>
                          {design.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888' }}>
                        <span>Category: {design.category}</span>
                        <span>Created: {new Date(design.createdAt).toLocaleDateString()}</span>
                        <span>Views: {design.views}</span>
                        <span>Downloads: {design.downloads}</span>
                      </div>
                      {design.tags && design.tags.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {design.tags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                background: '#f0f0f0',
                                color: '#666',
                                fontSize: 11,
                                padding: '2px 6px',
                                borderRadius: 4,
                                marginRight: 4,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleLoadDesign(design)}
                        style={{
                          background: '#4caf50',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteDesign(design._id)}
                        style={{
                          background: '#f44336',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 20,
            }}>
              <button
                onClick={() => loadDesigns(currentPage - 1, selectedCategory, searchTerm)}
                disabled={currentPage === 1}
                style={{
                  background: currentPage === 1 ? '#ccc' : '#5a4a2c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                }}
              >
                Previous
              </button>
              <span style={{ padding: '8px 12px', color: '#666' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => loadDesigns(currentPage + 1, selectedCategory, searchTerm)}
                disabled={currentPage === totalPages}
                style={{
                  background: currentPage === totalPages ? '#ccc' : '#5a4a2c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 12px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignManager; 