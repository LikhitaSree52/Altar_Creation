# Altar Designing - Altar Builder Project Documentation

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
│   │   │   ├── AltarBuilder.jsx    # Main component
│   │   │   ├── ItemPalette.jsx     # Sidebar with items
│   │   │   ├── DesignManager.jsx   # Modal for loading/saving designs
│   │   │   ├── WelcomePage.jsx     # Landing page
│   │   │   ├── Register.jsx        # Registration form
│   │   │   └── Login.jsx           # Login form
│   │   ├── services/
│   │   │   └── designService.js    # API service for design operations
│   │   ├── context/
│   │   │   └── AuthContext.js      # Authentication context
│   │   ├── App.js              # App entry point
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Dependencies
└── backend/                    # Node.js backend
    ├── src/
    │   ├── models/
    │   │   ├── Design.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── designs.js
    │   │   └── auth.js
    │   ├── middleware/
    │   │   └── auth.js
    │   └── index.js
    └── package.json
```

*All unnecessary files and unused models have been removed for a clean, maintainable codebase.*

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

### 4. DesignManager.jsx
**Purpose**: Modal for loading and saving user altar designs

**What it does**:
- Shows a list of saved designs
- Allows searching and loading designs
- Allows deleting designs
- No category dropdown (as per latest update)

**Where to find**: `src/components/DesignManager.jsx`

### 5. Register.jsx / Login.jsx
**Purpose**: User authentication forms

**What they do**:
- Register.jsx: Handles user registration
- Login.jsx: Handles user login

**Where to find**: `src/components/Register.jsx`, `src/components/Login.jsx`

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
| `