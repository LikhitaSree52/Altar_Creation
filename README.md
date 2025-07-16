# Altar Designing - Altar Builder

A React-based web application for creating and customizing 3D altar designs with an intuitive drag-and-drop interface.

## 🏗️ Project Structure

```
Altar_Designing/
├── Altar_Creation/
│   ├── frontend/          # React frontend application
│   │   ├── public/
│   │   │   ├── images/    # Altar items and stickers
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AltarBuilder.jsx    # Main altar builder component
│   │   │   │   ├── ItemPalette.jsx     # Sidebar with items and controls
│   │   │   │   ├── DesignManager.jsx   # Modal for loading/saving designs
│   │   │   │   ├── WelcomePage.jsx     # Landing page
│   │   │   │   ├── Register.jsx        # Registration form
│   │   │   │   └── Login.jsx           # Login form
│   │   │   ├── services/
│   │   │   │   └── designService.js    # API service for design operations
│   │   │   ├── context/
│   │   │   │   └── AuthContext.js      # Authentication context
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   └── index.css
│   │   └── package.json
│   └── backend/           # Node.js backend
│       ├── src/
│       │   ├── models/
│       │   │   ├── Design.js
│       │   │   └── User.js
│       │   ├── routes/
│       │   │   ├── designs.js
│       │   │   └── auth.js
│       │   ├── middleware/
│       │   │   └── auth.js
│       │   └── index.js
│       └── package.json
└── README.md
```

*All unnecessary files and unused models have been removed for a clean, maintainable codebase.*

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
- MongoDB (for backend functionality)

### Quick Start (Recommended)

**Windows Users:**
```bash
# Double-click the start-servers.bat file
# OR run from command line:
start-servers.bat
```

**Linux/Mac Users:**
```bash
# Make the script executable and run:
chmod +x start-servers.sh
./start-servers.sh
```

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Altar_Designing
   ```

2. **Install backend dependencies**
   ```bash
   cd Altar_Creation/backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up MongoDB**
   - Install MongoDB on your system
   - Start MongoDB service
   - Create a `.env` file in the backend directory with:
     ```
     MONGO_URI=mongodb://localhost:27017/altar_db
     JWT_SECRET=your_jwt_secret_here
     ```

5. **Start the servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd Altar_Creation/backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd Altar_Creation/frontend
   npm start
   ```

6. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🛠️ Technologies Used

### Frontend
- **React**: UI framework
- **CSS3**: Styling and animations
- **HTML5 Canvas**: For download functionality
- **html2canvas**: Canvas to image conversion

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework
- **MongoDB**: Database
- **JWT**: Authentication
- **bcryptjs**: Password hashing

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
- **ItemPalette.jsx**: Manages sidebar items and controls
- **DesignManager.jsx**: Modal for loading/saving designs
- **WelcomePage.jsx**: Landing page component
- **Register.jsx / Login.jsx**: Authentication forms

### State Management
The app uses React's built-in state management with hooks:
- `useState` for local component state
- `useEffect` for side effects
- Custom hooks for complex logic

### File Structure
- **Components**: Modular React components (no unused files)
- **Public/Images**: Static assets for altar items
- **CSS**: Component-specific styling

## 🛠️ Clean Codebase

- All unused files, models, and configs have been removed.
- Only essential files for frontend and backend remain.
- Easy to navigate, maintain, and extend.

## ✨ New Features (v2.0)

### 🔐 User Authentication
- **User Registration**: Create accounts with email and password
- **User Login**: Secure authentication with JWT tokens
- **User Profiles**: Manage personal information
- **Logout**: Secure session management

### 💾 Design Management
- **Save Designs**: Save altar designs to your account
- **Load Designs**: Access and edit your saved designs
- **Design Library**: Browse all your created designs
- **Design Categories**: Organize designs by type (memorial, religious, etc.)
- **Public/Private**: Choose to share designs publicly or keep them private
- **Design Tags**: Add tags for better organization
- **Download Tracking**: Track how many times designs are downloaded

### 🎨 Enhanced UI/UX
- **Design Manager Modal**: Easy access to saved designs
- **Top Navigation Bar**: Quick access to save, load, and download features
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Responsive Design**: Works on all screen sizes

## 🎯 Future Enhancements

- [ ] More altar item categories
- [ ] 3D perspective views
- [ ] Template library
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Design collaboration
- [ ] Advanced image editing tools

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