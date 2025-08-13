// Helper function to import all images from a directory
const importAll = (r) => {
  return r.keys().map((key) => ({
    key,
    file: r(key),
    name: key.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '')
  }));
};

// Import all assets from different categories
export const importAssets = () => {
  try {
    // Import all images from the assets directory
    const candleImports = require.context(
      '../assets/images/candles',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );
    
    const bouquetImports = require.context(
      '../assets/images/bouquets',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );
    
    const lampImports = require.context(
      '../assets/images/lamps',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );
    
    const incenseImports = require.context(
      '../assets/images/incense',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );
    
    const wallStickerImports = require.context(
      '../assets/images/wall-stickers',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );
    
    const backgroundImports = require.context(
      '../assets/images/backgrounds',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );
    
    const frameImports = require.context(
      '../assets/images/frames',
      false,
      /\.(png|jpe?g|gif|svg)$/
    );

    return {
      candles: importAll(candleImports),
      bouquets: importAll(bouquetImports),
      lamps: importAll(lampImports),
      incense: importAll(incenseImports),
      wallStickers: importAll(wallStickerImports),
      backgrounds: importAll(backgroundImports),
      frames: importAll(frameImports)
    };
  } catch (error) {
    console.error('Error importing assets:', error);
    return {
      candles: [],
      bouquets: [],
      lamps: [],
      incense: [],
      wallStickers: [],
      backgrounds: [],
      frames: []
    };
  }
};

// Export a default instance for easy importing
export default importAssets();
