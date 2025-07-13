# 3D Room Designing - Altar Builder

A React-based web application for creating and customizing 3D altar designs with an intuitive drag-and-drop interface.

## 🏗️ Project Structure

```
3D_Room_Designing/
├── Altar_Creation/
│   ├── frontend/          # React frontend application
│   │   ├── public/
│   │   │   ├── images/    # Altar items and stickers
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AltarBuilder.jsx    # Main altar builder component
│   │   │   │   ├── AltarCanvas.jsx     # Canvas for altar design
│   │   │   │   ├── ItemPalette.jsx     # Sidebar with items and controls
│   │   │   │   └── WelcomePage.jsx     # Landing page
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   └── package.json
│   └── backend/           # Node.js backend (for future development)
│       ├── src/
│       │   ├── altar.model.js
│       │   └── index.js
│       └── package.json
└── README.md
```

## ✨ Features

### 🖼️ Photo Management
- **Deceased Photo Upload**: Upload and display photos of loved ones
- **Frame Styles**: Choose from classic rectangle, ornate oval, or modern circle frames
- **Drag & Drop**: Move photos anywhere on the canvas
- **Resize**: Resize photos using invisible resize handles at corners and edges

### 🎨 Wall Customization
- **Wall Color Selection**: Choose from a variety of wall colors
- **Background Control**: Customize the altar background

### 🕯️ Altar Items & Stickers
- **Pre-built Items**: Candles, flowers, fruits, garlands, and more
- **Custom Stickers**: Upload your own images as stickers
- **Drag & Drop**: Place items anywhere on the canvas
- **Resize**: Resize any item using invisible resize zones
- **Layering**: Items automatically layer properly when dragged

### 🎯 Interactive Features
- **Selection System**: Click to select items for editing
- **Delete Functionality**: 
  - Red "×" button appears on hover
  - Keyboard delete (Delete/Backspace keys) for selected items
- **Download**: Save your altar design as PNG or JPG
- **Responsive Design**: Works on different screen sizes

### 🎨 User Interface
- **Clean Design**: Modern, intuitive interface
- **Sidebar Palette**: Organized 2-column grid for items
- **Top Control Panel**: Essential controls for wall colors and photo upload
- **Canvas Area**: Large workspace for altar design

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 3D_Room_Designing
   ```

2. **Install frontend dependencies**
   ```bash
   cd Altar_Creation/frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Backend Setup (Optional)
The backend is included for future development. To set it up:

```bash
cd Altar_Creation/backend
npm install
npm start
```

## 🛠️ Technologies Used

### Frontend
- **React**: UI framework
- **CSS3**: Styling and animations
- **HTML5 Canvas**: For download functionality
- **html2canvas**: Canvas to image conversion

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework (planned)

## 📱 Usage Guide

### Creating an Altar Design

1. **Start with Welcome Page**: Click "Start Building" to begin
2. **Choose Wall Color**: Select from the color palette in the sidebar
3. **Upload Photo**: Click "Upload Photo" and select an image
4. **Choose Frame Style**: Select classic, ornate, or modern frame
5. **Add Items**: Drag items from the sidebar to the canvas
6. **Customize**: 
   - Drag items to reposition
   - Resize items using corner/edge handles
   - Upload custom stickers
7. **Save**: Click download to save your design

### Controls
- **Mouse Drag**: Move items around the canvas
- **Resize Handles**: Invisible zones at corners and edges for resizing
- **Click**: Select items for editing
- **Delete Key**: Remove selected items
- **Escape Key**: Deselect items

## 🔧 Development

### Key Components

- **AltarBuilder.jsx**: Main orchestrator component
- **AltarCanvas.jsx**: Handles canvas interactions and rendering
- **ItemPalette.jsx**: Manages sidebar items and controls
- **WelcomePage.jsx**: Landing page component

### State Management
The app uses React's built-in state management with hooks:
- `useState` for local component state
- `useEffect` for side effects
- Custom hooks for complex logic

### File Structure
- **Components**: Modular React components
- **Public/Images**: Static assets for altar items
- **CSS**: Component-specific styling

## 🎯 Future Enhancements

- [ ] Backend integration for saving designs
- [ ] User accounts and design history
- [ ] More altar item categories
- [ ] 3D perspective views
- [ ] Template library
- [ ] Social sharing features
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Community contributors for feedback and suggestions
- Users for valuable feature requests and bug reports

---

**Built with ❤️ for creating meaningful memorial spaces** 