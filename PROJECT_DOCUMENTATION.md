# 3D Room Designing - Altar Builder Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure & Architecture](#file-structure--architecture)
3. [Component Breakdown](#component-breakdown)
4. [Feature Implementation Guide](#feature-implementation-guide)
5. [State Management](#state-management)
6. [How to Make Changes](#how-to-make-changes)
7. [Technical Details](#technical-details)
8. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🎯 Project Overview

### What is this project?
A React-based web application that allows users to create digital altar designs. Users can:
- Upload photos of deceased loved ones
- Choose different frame styles for photos
- Add decorative items (candles, flowers, etc.)
- Customize wall colors
- Drag, resize, and arrange everything
- Download the final design as an image

### Key Technologies Used
- **React**: Main framework for building the user interface
- **JavaScript**: Programming language
- **CSS**: Styling and layout
- **HTML5 Canvas**: For downloading images
- **html2canvas**: Library for converting DOM to images

---

## 🏗️ File Structure & Architecture

```
Altar_Creation/
├── frontend/                    # Main React application
│   ├── public/
│   │   ├── images/             # All altar items (candles, flowers, etc.)
│   │   └── index.html          # Main HTML file
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AltarBuilder.jsx    # Main component (1000+ lines)
│   │   │   ├── AltarCanvas.jsx     # Canvas area component
│   │   │   ├── ItemPalette.jsx     # Sidebar with items
│   │   │   └── WelcomePage.jsx     # Landing page
│   │   ├── App.js              # App entry point
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Dependencies
└── backend/                    # Future backend (not used yet)
```

### How the App Works
1. **Entry Point**: `index.js` → `App.js` → `WelcomePage.jsx`
2. **Main App**: `WelcomePage.jsx` → `AltarBuilder.jsx`
3. **Altar Builder**: Contains all the main logic and renders `ItemPalette.jsx` and `AltarCanvas.jsx`

---

## 🧩 Component Breakdown

### 1. WelcomePage.jsx
**Purpose**: Landing page that users see first

**What it does**:
- Shows a welcome message
- Has a "Start Building" button
- When clicked, takes user to the main altar builder

**Key Code**:
```javascript
// When "Start Building" is clicked
const handleStartBuilding = () => {
  setShowBuilder(true);
};
```

**Where to find**: `src/components/WelcomePage.jsx`

---

### 2. AltarBuilder.jsx (MAIN COMPONENT)
**Purpose**: The heart of the application - contains all the main logic

**What it does**:
- Manages all the state (data) for the altar
- Handles photo uploads
- Manages drag and drop
- Handles resizing
- Controls the download functionality
- Renders the main interface

**Key Sections**:

#### State Management (Lines 5-30)
```javascript
// All the data the app needs to remember
const [altarName, setAltarName] = useState('');
const [items, setItems] = useState([]);           // All altar items
const [deceasedPhoto, setDeceasedPhoto] = useState(null);  // Uploaded photo
const [frameStyle, setFrameStyle] = useState('classic');   // Frame type
const [wallBgColor, setWallBgColor] = useState('#f5f3ef'); // Wall color
```

#### Photo Upload Handler (Lines 100-110)
```javascript
const handleDeceasedPhotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => setDeceasedPhoto(ev.target.result);
  reader.readAsDataURL(file);
};
```

#### Drag and Drop Logic (Lines 120-140)
```javascript
const handleDrop = (e) => {
  e.preventDefault();
  const canvasRect = e.target.getBoundingClientRect();
  const item = JSON.parse(e.dataTransfer.getData('item'));
  // Calculate position and add item to altar
  const x = e.clientX - canvasRect.left - stickerWidth / 2;
  const y = e.clientY - canvasRect.top - stickerHeight / 2;
  setItems((prev) => [...prev, { ...item, x, y }]);
};
```

#### Download Functionality (Lines 60-90)
```javascript
const handleDownload = async () => {
  const canvas = document.getElementById('altar-canvas');
  const html2canvas = (await import('html2canvas')).default;
  const canvasImage = await html2canvas(canvas, {
    backgroundColor: null,
    scale: 2, // Higher quality
  });
  // Create download link and trigger download
};
```

**Where to find**: `src/components/AltarBuilder.jsx`

---

### 3. ItemPalette.jsx
**Purpose**: The sidebar that shows all available items and controls

**What it does**:
- Shows wall color picker
- Shows photo upload button
- Displays all available altar items (candles, flowers, etc.)
- Shows custom sticker upload
- Handles item selection

**Key Features**:
- **Wall Color Section**: Color picker for background
- **Photo Upload Section**: File input for deceased photo
- **Frame Style Selection**: Dropdown for frame types
- **Item Grid**: 2-column layout of all available items
- **Custom Sticker Upload**: File input for custom images

**Key Code**:
```javascript
// Wall color change
const handleWallColorChange = (color) => {
  onWallColorChange(color);
};

// Photo upload
const handlePhotoUpload = (e) => {
  onPhotoUpload(e);
};
```

**Where to find**: `src/components/ItemPalette.jsx`

---

### 4. AltarCanvas.jsx
**Purpose**: The main canvas area where users build their altar

**What it does**:
- Displays the altar background
- Shows the uploaded photo with frame
- Renders all altar items
- Handles drag and drop zones
- Manages the visual layout

**Key Features**:
- **Background**: Shows wall color or image
- **Photo Display**: Renders uploaded photo with selected frame
- **Item Rendering**: Shows all placed items
- **Drop Zone**: Accepts dragged items from palette

**Where to find**: `src/components/AltarCanvas.jsx`

---

## ⚙️ Feature Implementation Guide

### 1. Photo Upload Feature
**How it works**:
1. User clicks "Upload Photo" in ItemPalette
2. File input opens
3. Selected file is read as data URL
4. Photo is stored in `deceasedPhoto` state
5. Photo is displayed in AltarCanvas with selected frame

**Code Location**:
- Upload handler: `AltarBuilder.jsx` lines 100-110
- UI: `ItemPalette.jsx` photo upload section
- Display: `AltarCanvas.jsx` photo rendering

**To modify**: Change the upload handler in `AltarBuilder.jsx`

---

### 2. Frame Styles Feature
**How it works**:
1. User selects frame style from dropdown
2. `frameStyle` state is updated
3. Photo is re-rendered with new frame style
4. Three options: classic, ornate, modern

**Code Location**:
- State: `AltarBuilder.jsx` line 12
- UI: `ItemPalette.jsx` frame style dropdown
- Rendering: `AltarBuilder.jsx` renderDeceasedPhotoWithFrame function

**To modify**: Change the frame rendering logic in `AltarBuilder.jsx`

---

### 3. Drag and Drop Feature
**How it works**:
1. User drags item from palette
2. Item data is stored in drag event
3. On drop, position is calculated
4. Item is added to `items` array with x,y coordinates

**Code Location**:
- Drag start: `ItemPalette.jsx` drag handlers
- Drop logic: `AltarBuilder.jsx` lines 120-140
- Item dragging: `AltarBuilder.jsx` lines 370-410

**To modify**: Change drop calculation in `AltarBuilder.jsx`

---

### 4. Resize Feature
**How it works**:
1. User hovers over item corners/edges
2. Cursor changes to resize cursor
3. Mouse down starts resize
4. Mouse move calculates new size
5. Mouse up ends resize

**Code Location**:
- Photo resize: `AltarBuilder.jsx` lines 200-270
- Item resize: `AltarBuilder.jsx` lines 270-350
- Resize zones: Invisible areas around items

**To modify**: Change resize calculation logic in `AltarBuilder.jsx`

---

### 5. Download Feature
**How it works**:
1. User clicks download button
2. html2canvas captures the altar canvas
3. Canvas is converted to image data
4. Download link is created and triggered

**Code Location**:
- Download handler: `AltarBuilder.jsx` lines 60-90
- UI: Download button in AltarBuilder

**To modify**: Change image quality or format in download handler

---

### 6. Delete Feature
**How it works**:
1. User hovers over item → red "×" appears
2. User clicks "×" or presses Delete key
3. Item is removed from `items` array
4. Selection is cleared

**Code Location**:
- Delete handler: `AltarBuilder.jsx` lines 50-60
- Keyboard delete: `AltarBuilder.jsx` lines 350-370
- UI: Delete buttons on hover

**To modify**: Change delete logic in `AltarBuilder.jsx`

---

## 🗂️ State Management

### Main State Variables (AltarBuilder.jsx)

| State Variable | Purpose | Type | Default |
|---|---|---|---|
| `altarName` | Name of the altar | string | '' |
| `items` | All altar items | array | [] |
| `deceasedPhoto` | Uploaded photo | string/null | null |
| `frameStyle` | Frame type | string | 'classic' |
| `wallBgColor` | Wall color | string | '#f5f3ef' |
| `deceasedPhotoPos` | Photo position | object | {x: null, y: null, dragging: false} |
| `frameDimensions` | Photo size | object | {width: 180, height: 220} |
| `draggingItem` | Item being dragged | object | {idx: null, offsetX: 0, offsetY: 0} |
| `selectedItem` | Currently selected item | number/null | null |
| `customStickers` | Custom uploaded stickers | array | [] |

### How State Flows
1. **User Action** → **State Update** → **UI Re-render**
2. Example: User uploads photo → `deceasedPhoto` state changes → Photo appears on canvas

---

## 🔧 How to Make Changes

### Adding New Features

#### 1. Add New Altar Item
**Steps**:
1. Add image to `public/images/` folder
2. Add item data to `ItemPalette.jsx` items array
3. Item will automatically appear in palette

**Code to modify**: `ItemPalette.jsx` items array

#### 2. Add New Frame Style
**Steps**:
1. Add frame style option to dropdown in `ItemPalette.jsx`
2. Add frame rendering logic in `AltarBuilder.jsx` renderDeceasedPhotoWithFrame function

**Code to modify**: 
- `ItemPalette.jsx` frame style dropdown
- `AltarBuilder.jsx` renderDeceasedPhotoWithFrame function

#### 3. Add New Wall Color
**Steps**:
1. Add color option to color picker in `ItemPalette.jsx`
2. Color will automatically work with existing wall color logic

**Code to modify**: `ItemPalette.jsx` wall color section

### Modifying Existing Features

#### 1. Change Photo Size
**Location**: `AltarBuilder.jsx` line 18
```javascript
const [frameDimensions, setFrameDimensions] = useState({ width: 180, height: 220 });
```

#### 2. Change Default Wall Color
**Location**: `AltarBuilder.jsx` line 15
```javascript
const [wallBgColor, setWallBgColor] = useState('#f5f3ef');
```

#### 3. Change Download Quality
**Location**: `AltarBuilder.jsx` lines 70-75
```javascript
const canvasImage = await html2canvas(canvas, {
  backgroundColor: null,
  scale: 2, // Change this number for quality
  useCORS: true,
  allowTaint: true,
});
```

#### 4. Change Item Size
**Location**: `AltarBuilder.jsx` lines 125-130
```javascript
const stickerWidth = 48;  // Change these values
const stickerHeight = 48;
```

### Common Change Locations

| What to Change | File | Line Range |
|---|---|---|
| Photo upload logic | AltarBuilder.jsx | 100-110 |
| Drag and drop behavior | AltarBuilder.jsx | 120-140 |
| Resize functionality | AltarBuilder.jsx | 200-350 |
| Download settings | AltarBuilder.jsx | 60-90 |
| Wall colors | ItemPalette.jsx | Wall color section |
| Altar items | ItemPalette.jsx | Items array |
| Frame styles | ItemPalette.jsx | Frame dropdown |
| Visual styling | AltarCanvas.jsx | Rendering functions |

---

## 🔍 Technical Details

### Key Functions Explained

#### 1. Mouse Event Handlers
```javascript
// These handle all the dragging and resizing
handleDeceasedPhotoMouseDown()  // Start dragging photo
handleDeceasedPhotoMouseMove()  // Move photo while dragging
handleDeceasedPhotoMouseUp()    // Stop dragging photo
handleItemMouseDown()           // Start dragging item
handleItemMouseMove()           // Move item while dragging
handleItemMouseUp()             // Stop dragging item
```

#### 2. Resize Handlers
```javascript
handleResizeStart()    // Start resizing photo
handleResizeMove()     // Resize photo while dragging
handleResizeEnd()      // Stop resizing photo
handleItemResizeStart() // Start resizing item
handleItemResizeMove()  // Resize item while dragging
handleItemResizeEnd()   // Stop resizing item
```

#### 3. Utility Functions
```javascript
renderDeceasedPhotoWithFrame()  // Renders photo with selected frame
handleDeleteItem()              // Removes item from altar
handleDownload()                // Saves altar as image
handleCustomStickerUpload()     // Adds custom sticker
```

### CSS Classes Used
- `.altar-builder`: Main container
- `.control-panel`: Top control area
- `.palette`: Sidebar with items
- `.canvas`: Main altar area
- `.item`: Individual altar items
- `.photo-frame`: Photo container
- `.resize-handle`: Invisible resize areas

---

## 🚨 Troubleshooting Guide

### Common Issues and Solutions

#### 1. "Module not found" Error
**Problem**: Missing import or dependency
**Solution**: Check import statements and install missing packages

#### 2. Items Not Dragging
**Problem**: Mouse event handlers not working
**Solution**: Check `handleItemMouseDown`, `handleItemMouseMove`, `handleItemMouseUp` functions

#### 3. Photo Not Uploading
**Problem**: File reader not working
**Solution**: Check `handleDeceasedPhotoUpload` function in `AltarBuilder.jsx`

#### 4. Download Not Working
**Problem**: html2canvas not capturing properly
**Solution**: Check canvas ID and html2canvas configuration

#### 5. Items Not Resizing
**Problem**: Resize handlers not working
**Solution**: Check resize event handlers and resize zones

### Debug Tips
1. **Check Console**: Look for JavaScript errors
2. **Check State**: Use React DevTools to see state values
3. **Check Elements**: Inspect DOM to see if elements are rendering
4. **Check Network**: Look for failed requests

---

## 📚 Learning Resources

### React Concepts Used
- **useState**: Managing component state
- **useEffect**: Handling side effects
- **Event Handlers**: Mouse and keyboard events
- **Props**: Passing data between components
- **Conditional Rendering**: Showing/hiding elements

### JavaScript Concepts Used
- **Array Methods**: map, filter, spread operator
- **Object Destructuring**: Extracting values from objects
- **Async/Await**: Handling file uploads and downloads
- **Event Handling**: Mouse and keyboard events
- **DOM Manipulation**: Working with HTML elements

### CSS Concepts Used
- **Flexbox**: Layout management
- **Grid**: Item organization
- **Positioning**: Absolute and relative positioning
- **Transforms**: Scaling and rotating elements
- **Transitions**: Smooth animations

---

## 🎯 Quick Reference

### File Purposes
- **AltarBuilder.jsx**: Main logic and state management
- **ItemPalette.jsx**: Sidebar with controls and items
- **AltarCanvas.jsx**: Main canvas area
- **WelcomePage.jsx**: Landing page

### Key Functions
- **Photo Upload**: `handleDeceasedPhotoUpload`
- **Drag & Drop**: `handleDrop`, `handleItemMouseDown`
- **Resize**: `handleResizeStart`, `handleItemResizeStart`
- **Download**: `handleDownload`
- **Delete**: `handleDeleteItem`

### State Variables
- **Photo**: `deceasedPhoto`, `frameStyle`, `frameDimensions`
- **Items**: `items`, `draggingItem`, `selectedItem`
- **UI**: `showPalette`, `wallBgColor`, `altarName`

This documentation should give you a complete understanding of the project and help you explain it to your manager confidently! 🚀 