import React, { useState, useEffect } from 'react';
import ItemPalette from './ItemPalette';
import DesignManager from './DesignManager';
import designService from '../services/designService';

export default function AltarBuilder({ user, onLogout }) {
  const [altarName, setAltarName] = useState('');
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [items, setItems] = useState([]);
  const [wallWidth, setWallWidth] = useState(600);
  const [wallHeight, setWallHeight] = useState(360);
  // Remove old frameShape state
  // Add new state for deceased photo and frame style
  const [deceasedPhoto, setDeceasedPhoto] = useState(null);
  const [frameStyle, setFrameStyle] = useState('classic'); // classic, ornate, modern
  const [showPalette, setShowPalette] = useState(true);
  const [frameImage, setFrameImage] = useState(null);
  const [wallBgColor, setWallBgColor] = useState('#f5f3ef');
  const [wallBgImage, setWallBgImage] = useState(null);
  // Add state for deceased photo position
  const [deceasedPhotoPos, setDeceasedPhotoPos] = useState({ x: null, y: null, dragging: false, offsetX: 0, offsetY: 0 });
  // Add state for frame dimensions and resize
  const [frameDimensions, setFrameDimensions] = useState({ width: 180, height: 220 });
  const [resizing, setResizing] = useState({ active: false, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
  // Add dragging state for items
  const [draggingItem, setDraggingItem] = useState({ idx: null, offsetX: 0, offsetY: 0 });
  // Add resize state for items
  const [itemResizing, setItemResizing] = useState({ active: false, itemIdx: null, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
  // Add topZIndex state
  const [topZIndex, setTopZIndex] = useState(10);
  // Add state for custom stickers
  const [customStickers, setCustomStickers] = useState([]);
  // Add download loading state
  const [isDownloading, setIsDownloading] = useState(false);
  // Add hover state for delete buttons
  const [hoveredItem, setHoveredItem] = useState(null);
  // Add selected item state for keyboard delete
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Add design management states
  const [showDesignManager, setShowDesignManager] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleFrameImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFrameImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleWallBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setWallBgImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleResetWallBg = () => setWallBgImage(null);

  // Handler for custom sticker uploads
  const handleCustomStickerUpload = (newSticker) => {
    setCustomStickers(prev => [...prev, newSticker]);
  };

  // Delete handler for removing items from altar
  const handleDeleteItem = (itemIdx) => {
    setItems(prev => prev.filter((_, idx) => idx !== itemIdx));
    setHoveredItem(null);
    // Clear selection if the deleted item was selected
    if (selectedItem === itemIdx) {
      setSelectedItem(null);
    } else if (selectedItem > itemIdx) {
      // Adjust selection index if we deleted an item before the selected one
      setSelectedItem(selectedItem - 1);
    }
  };

  // Design management handlers
  const handleSaveDesign = async () => {
    if (!altarName.trim()) {
      setSaveError('Please enter an altar name');
      return;
    }

    setSaveLoading(true);
    setSaveError('');

    try {
      const altarData = {
        wallBgColor,
        wallBgImage,
        deceasedPhoto,
        frameStyle,
        deceasedPhotoPos,
        frameDimensions,
        items,
        customStickers,
        canvasWidth: wallWidth,
        canvasHeight: wallHeight
      };

      const designData = {
        name: altarName.trim(),
        description: `Altar design: ${altarName}`,
        category: 'memorial',
        isPublic: false,
        tags: ['altar', 'memorial'],
        altarData
      };

      let result;
      if (currentDesign && currentDesign._id) {
        // Update existing design
        result = await designService.updateDesign(currentDesign._id, designData);
      } else {
        // Create new design
        result = await designService.createDesign(designData);
      }

      if (result.success) {
        setCurrentDesign(result.design);
        setSaveError('');
        alert('Design saved successfully!');
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveError('Failed to save design');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLoadDesign = (design) => {
    const { altarData } = design;
    
    // Load altar data
    setAltarName(design.name);
    setWallBgColor(altarData.wallBgColor || '#f5f3ef');
    setWallBgImage(altarData.wallBgImage || null);
    setDeceasedPhoto(altarData.deceasedPhoto || null);
    setFrameStyle(altarData.frameStyle || 'classic');
    setDeceasedPhotoPos(altarData.deceasedPhotoPos || { x: null, y: null, dragging: false, offsetX: 0, offsetY: 0 });
    setFrameDimensions(altarData.frameDimensions || { width: 180, height: 220 });
    setItems(altarData.items || []);
    setCustomStickers(altarData.customStickers || []);
    setWallWidth(altarData.canvasWidth || 600);
    setWallHeight(altarData.canvasHeight || 360);
    
    setCurrentDesign(design);
  };

  const handleDesignSaveSuccess = (design) => {
    setCurrentDesign(design);
    setSaveError('');
  };

  // Download handler for saving altar as image
  const handleDownload = async () => {
    const canvas = document.getElementById('altar-canvas');
    if (!canvas) {
      alert('Altar canvas not found!');
      return;
    }

    setIsDownloading(true);
    
    try {
      // Use html2canvas to capture the altar
      const html2canvas = (await import('html2canvas')).default;
      const canvasImage = await html2canvas(canvas, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      });

      // Create download link
      const link = document.createElement('a');
      const fileName = altarName ? `${altarName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}` : 'altar';
      
      if (downloadFormat === 'png') {
        link.download = `${fileName}.png`;
        link.href = canvasImage.toDataURL('image/png');
      } else {
        link.download = `${fileName}.jpg`;
        link.href = canvasImage.toDataURL('image/jpeg', 0.9);
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment download count if we have a current design
      if (currentDesign && currentDesign._id) {
        designService.incrementDownload(currentDesign._id);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download altar. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // New handler for deceased photo upload
  const handleDeceasedPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDeceasedPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const canvasRect = e.target.getBoundingClientRect();
    try {
    const item = JSON.parse(e.dataTransfer.getData('item'));
      if (typeof item.img !== 'string') {
        console.error('Dropped item.img is not a string!', item);
        return;
      }
      // Center the sticker/image on the cursor
      const stickerWidth = 48;
      const stickerHeight = 48;
      const x = e.clientX - canvasRect.left - stickerWidth / 2;
      const y = e.clientY - canvasRect.top - stickerHeight / 2;
    setItems((prev) => [...prev, { ...item, x, y }]);
    } catch (err) {
      console.error('Error parsing dropped item:', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Mouse event handlers for dragging deceased photo
  const handleDeceasedPhotoMouseDown = (e) => {
    if (!deceasedPhoto) return;
    const rect = e.target.getBoundingClientRect();
    setDeceasedPhotoPos(pos => ({
      ...pos,
      dragging: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }));
  };
  const handleDeceasedPhotoMouseMove = (e) => {
    if (!deceasedPhotoPos.dragging) return;
    const canvas = document.getElementById('altar-canvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    let x = e.clientX - canvasRect.left - deceasedPhotoPos.offsetX;
    let y = e.clientY - canvasRect.top - deceasedPhotoPos.offsetY;
    // Clamp within canvas
    x = Math.max(0, Math.min(x, canvasRect.width - 180));
    y = Math.max(0, Math.min(y, canvasRect.height - 220));
    setDeceasedPhotoPos(pos => ({ ...pos, x, y }));
  };
  const handleDeceasedPhotoMouseUp = () => {
    setDeceasedPhotoPos(pos => ({ ...pos, dragging: false }));
  };

  // Attach global mousemove/mouseup listeners when dragging
  useEffect(() => {
    if (deceasedPhotoPos.dragging) {
      window.addEventListener('mousemove', handleDeceasedPhotoMouseMove);
      window.addEventListener('mouseup', handleDeceasedPhotoMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleDeceasedPhotoMouseMove);
        window.removeEventListener('mouseup', handleDeceasedPhotoMouseUp);
      };
    }
  }, [deceasedPhotoPos.dragging]);

  // Resize event handlers for frame
  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    setResizing({
      active: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: frameDimensions.width,
      startHeight: frameDimensions.height,
    });
  };

  const handleResizeMove = (e) => {
    if (!resizing.active) return;
    
    const deltaX = e.clientX - resizing.startX;
    const deltaY = e.clientY - resizing.startY;
    
    let newWidth = resizing.startWidth;
    let newHeight = resizing.startHeight;
    
    // Handle different resize directions based on handle
    switch (resizing.handle) {
      case 'nw': // top-left
        newWidth = Math.max(60, resizing.startWidth - deltaX);
        newHeight = Math.max(80, resizing.startHeight - deltaY);
        break;
      case 'ne': // top-right
        newWidth = Math.max(60, resizing.startWidth + deltaX);
        newHeight = Math.max(80, resizing.startHeight - deltaY);
        break;
      case 'sw': // bottom-left
        newWidth = Math.max(60, resizing.startWidth - deltaX);
        newHeight = Math.max(80, resizing.startHeight + deltaY);
        break;
      case 'se': // bottom-right
        newWidth = Math.max(60, resizing.startWidth + deltaX);
        newHeight = Math.max(80, resizing.startHeight + deltaY);
        break;
      case 'n': // top
        newHeight = Math.max(80, resizing.startHeight - deltaY);
        break;
      case 's': // bottom
        newHeight = Math.max(80, resizing.startHeight + deltaY);
        break;
      case 'e': // right
        newWidth = Math.max(60, resizing.startWidth + deltaX);
        break;
      case 'w': // left
        newWidth = Math.max(60, resizing.startWidth - deltaX);
        break;
    }
    
    setFrameDimensions({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => {
    setResizing({ active: false, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
  };

  // Attach global resize listeners
  useEffect(() => {
    if (resizing.active) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing.active]);

  // Resize event handlers for items
  const handleItemResizeStart = (e, itemIdx, handle) => {
    e.stopPropagation();
    const item = items[itemIdx];
    setItemResizing({
      active: true,
      itemIdx,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: item.width || 48,
      startHeight: item.height || 48,
    });
  };

  const handleItemResizeMove = (e) => {
    if (!itemResizing.active) return;
    
    const deltaX = e.clientX - itemResizing.startX;
    const deltaY = e.clientY - itemResizing.startY;
    
    let newWidth = itemResizing.startWidth;
    let newHeight = itemResizing.startHeight;
    
    // Handle different resize directions based on handle
    switch (itemResizing.handle) {
      case 'nw': // top-left
        newWidth = Math.max(20, itemResizing.startWidth - deltaX);
        newHeight = Math.max(20, itemResizing.startHeight - deltaY);
        break;
      case 'ne': // top-right
        newWidth = Math.max(20, itemResizing.startWidth + deltaX);
        newHeight = Math.max(20, itemResizing.startHeight - deltaY);
        break;
      case 'sw': // bottom-left
        newWidth = Math.max(20, itemResizing.startWidth - deltaX);
        newHeight = Math.max(20, itemResizing.startHeight + deltaY);
        break;
      case 'se': // bottom-right
        newWidth = Math.max(20, itemResizing.startWidth + deltaX);
        newHeight = Math.max(20, itemResizing.startHeight + deltaY);
        break;
      case 'n': // top
        newHeight = Math.max(20, itemResizing.startHeight - deltaY);
        break;
      case 's': // bottom
        newHeight = Math.max(20, itemResizing.startHeight + deltaY);
        break;
      case 'e': // right
        newWidth = Math.max(20, itemResizing.startWidth + deltaX);
        break;
      case 'w': // left
        newWidth = Math.max(20, itemResizing.startWidth - deltaX);
        break;
    }
    
    setItems(prev => prev.map((item, idx) => 
      idx === itemResizing.itemIdx 
        ? { ...item, width: newWidth, height: newHeight }
        : item
    ));
  };

  const handleItemResizeEnd = () => {
    setItemResizing({ active: false, itemIdx: null, handle: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
  };

  // Attach global item resize listeners
  useEffect(() => {
    if (itemResizing.active) {
      window.addEventListener('mousemove', handleItemResizeMove);
      window.addEventListener('mouseup', handleItemResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleItemResizeMove);
        window.removeEventListener('mouseup', handleItemResizeEnd);
      };
    }
  }, [itemResizing.active]);

  // Keyboard event handler for delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItem !== null) {
          handleDeleteItem(selectedItem);
          setSelectedItem(null);
        }
      }
      // Escape key to deselect
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem]);

  // Mouse event handlers for dragging items
  const handleItemMouseDown = (e, idx) => {
    const rect = e.target.getBoundingClientRect();
    setDraggingItem({
      idx,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    // Select this item
    setSelectedItem(idx);
    // Bring this item to front
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, zIndex: topZIndex + 1 } : it));
    setTopZIndex(z => z + 1);
  };
  const handleItemMouseMove = (e) => {
    if (draggingItem.idx === null) return;
    const canvas = document.getElementById('altar-canvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    let x = e.clientX - canvasRect.left - draggingItem.offsetX;
    let y = e.clientY - canvasRect.top - draggingItem.offsetY;
    // Clamp within canvas
    x = Math.max(0, Math.min(x, canvasRect.width - 48));
    y = Math.max(0, Math.min(y, canvasRect.height - 48));
    setItems(prev => prev.map((it, i) => i === draggingItem.idx ? { ...it, x, y } : it));
  };
  const handleItemMouseUp = () => {
    setDraggingItem({ idx: null, offsetX: 0, offsetY: 0 });
  };

  // Attach global mousemove/mouseup listeners for items
  useEffect(() => {
    if (draggingItem.idx !== null) {
      window.addEventListener('mousemove', handleItemMouseMove);
      window.addEventListener('mouseup', handleItemMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleItemMouseMove);
        window.removeEventListener('mouseup', handleItemMouseUp);
      };
    }
  }, [draggingItem.idx]);

  // Remove old renderFrame and frameShape logic

  // New renderDeceasedPhotoWithFrame function
  const renderDeceasedPhotoWithFrame = () => {
    if (!deceasedPhoto) return null;
    // Frame style presets
    let frameBorder, frameBg, frameRadius, frameImgOverlay = null;
    if (frameStyle === 'classic') {
      frameBorder = '8px solid #b09a7a';
      frameBg = '#fffbe9';
      frameRadius = '18px';
    } else if (frameStyle === 'ornate') {
      frameBorder = '12px double #a67c52';
      frameBg = '#f8f4e3';
      frameRadius = '50%/40%';
      // Optionally, you could overlay a PNG frame image here
    } else if (frameStyle === 'modern') {
      frameBorder = '6px solid #333';
      frameBg = '#fff';
      frameRadius = '50%';
    } else {
      frameBorder = '8px solid #b09a7a';
      frameBg = '#fffbe9';
      frameRadius = '18px';
    }
    return (
        <div style={{
        position: 'absolute',
        left: '50%',
        top: '30%',
        transform: 'translate(-50%, 0)',
        width: 180,
        height: 220,
        background: frameBg,
        border: frameBorder,
        borderRadius: frameRadius,
          boxShadow: '0 4px 24px rgba(80,60,20,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        zIndex: 5,
      }}>
        <img src={deceasedPhoto} alt="Deceased" style={{
          width: '90%',
          height: '90%',
          objectFit: 'cover',
          borderRadius: frameRadius,
          boxShadow: '0 2px 8px rgba(80,60,20,0.10)'
        }} />
        {frameImgOverlay}
        </div>
    );
  };

  return (
    <div style={{ height: '100vh', background: '#f5f3ef', fontFamily: 'Segoe UI, Arial, sans-serif', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar with design management and logout */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderBottom: '1px solid #e0ddd7',
        padding: '12px 72px 12px 32px', // Even more right padding
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(80,60,20,0.04)',
        position: 'relative',
        boxSizing: 'border-box', // Ensure padding is included in width
      }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
          <input
            type="text"
            placeholder="Altar Name"
            value={altarName}
            onChange={e => setAltarName(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #e0ddd7',
              fontSize: 16,
              minWidth: 120,
              maxWidth: 200,
            }}
          />
          
          {/* Design management buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveDesign}
              disabled={saveLoading}
              style={{
                background: saveLoading ? '#ccc' : '#4caf50',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: saveLoading ? 'not-allowed' : 'pointer',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              {saveLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowDesignManager(true)}
              style={{
                background: '#2196f3',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              Load
            </button>
            
            {/* Download button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  background: isDownloading ? '#ccc' : '#e0ddd7',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 12px',
                  cursor: isDownloading ? 'not-allowed' : 'pointer',
                  color: '#5a4a2c',
                  fontWeight: 600,
                  fontSize: 13,
                  opacity: isDownloading ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {isDownloading ? 'Generating...' : 'Download'}
              </button>
              <select
                value={downloadFormat}
                onChange={e => setDownloadFormat(e.target.value)}
                style={{
                  position: 'absolute',
                  right: -70,
                  top: 0,
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: '1px solid #e0ddd7',
                  fontSize: 12,
                  background: '#fff',
                }}
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right side - User info and logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexShrink: 0, marginLeft: 'auto' }}>
          {user && (
            <span style={{ color: '#5a4a2c', fontSize: 14, whiteSpace: 'nowrap' }}>
              Welcome, {user.firstName || user.username}
            </span>
          )}
          <button
            onClick={onLogout}
            style={{
              background: '#f44336',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              marginLeft: 8,
              marginRight: 8, // Added right margin
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Main layout: palette/sidebar on the left, builder/canvas on the right */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Sidebar/Palette on the left */}
        <div style={{
          width: 220,
          background: '#fff',
          borderRight: '1px solid #e0ddd7',
          padding: '24px 8px',
          boxShadow: '2px 0 8px rgba(80,60,20,0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          gap: 24,
        }}>
            <div style={{ fontWeight: 600, color: '#5a4a2c', marginBottom: 8 }}>
              Wall Dimensions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <label style={{ color: '#7a6f57', fontSize: 14 }}>Width (ft)</label>
              <input
                type="number"
                min={4}
                max={40}
                value={wallWidth / 30}
                onChange={e => setWallWidth(Number(e.target.value) * 30)}
                style={{ width: 60, padding: 4, borderRadius: 6, border: '1px solid #e0ddd7' }}
              />
              <label style={{ color: '#7a6f57', fontSize: 14 }}>Height (ft)</label>
              <input
                type="number"
                min={4}
                max={20}
                value={wallHeight / 30}
                onChange={e => setWallHeight(Number(e.target.value) * 30)}
                style={{ width: 60, padding: 4, borderRadius: 6, border: '1px solid #e0ddd7' }}
              />
            </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <label style={{ color: '#5a4a2c', fontWeight: 600 }}>
              Wall Color
              <input type="color" value={wallBgColor} onChange={e => setWallBgColor(e.target.value)} style={{ marginLeft: 8 }} />
            </label>
            <label style={{ color: '#5a4a2c', fontWeight: 600, cursor: 'pointer' }}>
              Upload Wall Image
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleWallBgImageUpload} />
            </label>
            {wallBgImage && (
              <button onClick={handleResetWallBg} style={{ background: '#e0ddd7', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#5a4a2c', fontWeight: 600 }}>
                Remove Image
              </button>
            )}
            </div>

          {/* Deceased photo upload and frame style selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <label style={{ color: '#5a4a2c', fontWeight: 600, cursor: 'pointer' }}>
              Upload Deceased Photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleDeceasedPhotoUpload} />
            </label>
            {deceasedPhoto && (
              <>
                <img src={deceasedPhoto} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, margin: '0 auto' }} />
                <button
                  onClick={() => setDeceasedPhoto(null)}
                  style={{
                    marginTop: 4,
                    background: '#e0ddd7',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer',
                    color: '#5a4a2c',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Delete Photo
                </button>
              </>
            )}
            <label style={{ color: '#5a4a2c', fontWeight: 600 }}>Frame Style</label>
            <select
              value={frameStyle}
              onChange={e => setFrameStyle(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #e0ddd7',
                fontSize: 15,
                background: '#fff',
              }}
            >
              <option value="classic">Classic Rectangle</option>
              <option value="ornate">Ornate Oval</option>
              <option value="modern">Modern Circle</option>
            </select>
          </div>

          <ItemPalette 
            onDragStart={handleDragStart} 
            customItems={customStickers}
            onCustomStickerUpload={handleCustomStickerUpload}
                />
              </div>
        {/* Builder/canvas area on the right */}
        <div 
          style={{ 
            flex: 1, 
            position: 'relative', 
            background: '#f5f3ef', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '400px' // Ensure minimum height
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={(e) => {
            // Deselect items when clicking on empty canvas
            if (e.target.id === 'altar-canvas' || e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <div
            id="altar-canvas"
            style={{
              width: wallWidth,
              height: wallHeight,
              background: wallBgImage
                ? `url(${wallBgImage}) center/cover no-repeat`
                : wallBgColor,
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(80,60,20,0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Render deceased photo with drag and resize */}
            {deceasedPhoto && (
              <div
                style={{
                  position: 'absolute',
                  left: deceasedPhotoPos.x !== null ? deceasedPhotoPos.x : '50%',
                  top: deceasedPhotoPos.y !== null ? deceasedPhotoPos.y : '30%',
                  transform: deceasedPhotoPos.x === null && deceasedPhotoPos.y === null ? 'translate(-50%, 0)' : 'none',
                  width: frameDimensions.width,
                  height: frameDimensions.height,
                  background: frameStyle === 'classic' ? '#fffbe9' : frameStyle === 'ornate' ? '#f8f4e3' : '#fff',
                  border: frameStyle === 'classic' ? '8px solid #b09a7a' : frameStyle === 'ornate' ? '12px double #a67c52' : '6px solid #333',
                  borderRadius: frameStyle === 'classic' ? '18px' : frameStyle === 'ornate' ? '50%/40%' : '50%',
                  boxShadow: '0 4px 24px rgba(80,60,20,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  zIndex: 5,
                  cursor: 'grab',
                }}
                onMouseDown={handleDeceasedPhotoMouseDown}
              >
                <img src={deceasedPhoto} alt="Deceased" style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'cover',
                  borderRadius: frameStyle === 'classic' ? '18px' : frameStyle === 'ornate' ? '50%/40%' : '50%',
                  boxShadow: '0 2px 8px rgba(80,60,20,0.10)'
                }} />
                
                {/* Invisible resize areas - no visual dots */}
                <div
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    width: 16,
                    height: 16,
                    cursor: 'nw-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'nw')}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 16,
                    height: 16,
                    cursor: 'ne-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'ne')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    left: -8,
                    width: 16,
                    height: 16,
                    cursor: 'sw-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'sw')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    width: 16,
                    height: 16,
                    cursor: 'se-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'se')}
                />
                
                {/* Edge resize areas */}
                <div
                  style={{
                    position: 'absolute',
                    top: -6,
                    left: 0,
                    right: 0,
                    height: 12,
                    cursor: 'n-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'n')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    right: 0,
                    height: 12,
                    cursor: 's-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 's')}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: -6,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    cursor: 'w-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'w')}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    cursor: 'e-resize',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'e')}
                />
              </div>
            )}
            {items.map((item, idx) => {
              if (typeof item.img === 'string') {
                const isHovered = hoveredItem === idx;
                const isSelected = selectedItem === idx;
                
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: item.x,
                      top: item.y,
                      width: item.width || 48,
                      height: item.height || 48,
                      zIndex: item.zIndex || 3,
                      outline: isSelected ? '2px solid #4a90e2' : 'none',
                    }}
                    onMouseEnter={() => setHoveredItem(idx)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onMouseDown={e => handleItemMouseDown(e, idx)}
                  >
                    <img
                      src={item.img}
                      alt={typeof item.label === 'string' ? item.label : ''}
                  style={{
                    width: '100%',
                    height: '100%',
                        cursor: 'grab',
                        userSelect: 'none',
                      }}
                      draggable={false}
                    />
                    
                    {/* Delete button - appears on hover */}
                    {isHovered && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(idx);
                        }}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 16,
                          height: 16,
                          background: '#ff4444',
                          border: '1px solid #fff',
                          borderRadius: '50%',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          zIndex: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                        title="Delete item"
                      >
                        ×
                      </button>
                    )}
                    
                    {/* Invisible resize areas for items */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        width: 12,
                        height: 12,
                        cursor: 'nw-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'nw')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 12,
                        height: 12,
                        cursor: 'ne-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'ne')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        left: -6,
                        width: 12,
                        height: 12,
                        cursor: 'sw-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'sw')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        right: -6,
                        width: 12,
                        height: 12,
                        cursor: 'se-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'se')}
                    />
                    
                    {/* Edge resize areas for items */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -4,
                        left: 0,
                        right: 0,
                        height: 8,
                        cursor: 'n-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'n')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: 8,
                        cursor: 's-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 's')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: -4,
                        top: 0,
                        bottom: 0,
                        width: 8,
                        cursor: 'w-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'w')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        right: -4,
                        top: 0,
                        bottom: 0,
                        width: 8,
                        cursor: 'e-resize',
                        zIndex: 10,
                      }}
                      onMouseDown={(e) => handleItemResizeStart(e, idx, 'e')}
                    />
                </div>
                );
              } else {
                console.warn('Skipping invalid item:', item);
                return null;
              }
            })}
          </div>
        </div>
      </div>

      {/* Design Manager Modal */}
      <DesignManager
        isOpen={showDesignManager}
        onClose={() => setShowDesignManager(false)}
        onLoadDesign={handleLoadDesign}
      />

      {/* Error message for save errors */}
      {saveError && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#f44336',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1001,
          maxWidth: 300,
        }}>
          {saveError}
        </div>
      )}
    </div>
  );
} 
