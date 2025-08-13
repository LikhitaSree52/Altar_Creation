import { useState, useRef } from "react";
import Profile from "./Profile";
import logo from "../assets/images/logo.png";

export default function AltarBuilder({ user, onLogout }) {
  const [altarName, setAltarName] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Add state to track which deceased photo is being resized and hovered
  const [resizingDeceased, setResizingDeceased] = useState({
    idx: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });
  const [hoveredDeceased, setHoveredDeceased] = useState(null);

  // Add state to track which deceased photo is being resized and hovered
  const [resizingDeceased, setResizingDeceased] = useState({
    idx: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });
  const [hoveredDeceased, setHoveredDeceased] = useState(null);

  const handleShare = async () => {
    // Share logic is now handled by ShareModal
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#f5f3ef",
        fontFamily: "Segoe UI, Arial, sans-serif",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Redesigned Header */}
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderBottom: "1px solid #e0ddd7",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(80,60,20,0.04)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="SoulNest Logo" style={{ height: "40px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5a4a2c",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Instructions
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5a4a2c",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Help
          </button>
          {user && (
            <div
              className="profile-container"
              ref={profileRef}
              style={{ position: "relative" }}
            >
              <button
                onClick={() => setShowProfile(!showProfile)}
                style={{
                  background: "#e0ddd7",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  color: "#5a4a2c",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Profile
              </button>
              {showProfile && <Profile user={user} onLogout={onLogout} />}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left block (1/4) */}
        <div
          style={{
            background: "#fff",
            borderRight: "1px solid #e0ddd7",
            padding: "24px 8px",
            boxShadow: "2px 0 8px rgba(80,60,20,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            gap: 24,
            position: "relative",
            transition: "width 0.2s",
          }}
        >
          <div
            style={{ fontWeight: 600, color: "#5a4a2c", marginBottom: 8 }}
          >
            Wall Dimensions
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <label style={{ color: "#7a6f57", fontSize: 14 }}>
              Width (ft)
            </label>
            <input
              type="number"
              min={4}
              max={40}
              value={wallWidth / 30}
              onChange={(e) => setWallWidth(Number(e.target.value) * 30)}
              style={{
                width: 60,
                padding: 4,
                borderRadius: 6,
                border: "1px solid #e0ddd7",
              }}
            />
            <label style={{ color: "#7a6f57", fontSize: 14 }}>
              Height (ft)
            </label>
            <input
              type="number"
              min={4}
              max={20}
              value={wallHeight / 30}
              onChange={(e) => setWallHeight(Number(e.target.value) * 30)}
              style={{
                width: 60,
                padding: 4,
                borderRadius: 6,
                border: "1px solid #e0ddd7",
              }}
            />
          </div>

          <div
            style={{ fontWeight: 600, color: "#5a4a2c", marginBottom: 8 }}
          >
            Wall Image
          </div>
          <button
            style={{
              background: "#f8f6f2",
              border: "1px solid #e0ddd7",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#5a4a2c",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 8,
            }}
            onClick={() => document.getElementById("wall-image-input").click()}
          >
            Upload Wall Image
          </button>
          <input
            id="wall-image-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleWallBgImageUpload}
          />
          {wallBgImage && (
            <button
              onClick={handleResetWallBg}
              style={{
                background: "#e0ddd7",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                color: "#5a4a2c",
                fontWeight: 600,
              }}
            >
              Remove Image
            </button>
          )}

          <div
            style={{
              fontWeight: 600,
              color: "#5a4a2c",
              marginBottom: 8,
              marginTop: 24,
            }}
          >
            Deceased Photos
          </div>
          <button
            style={{
              background: "#f8f6f2",
              border: "1px solid #e0ddd7",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#5a4a2c",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 8,
            }}
            onClick={() =>
              document.getElementById("deceased-photo-input").click()
            }
          >
            Add Photo(s)
          </button>
          <input
            id="deceased-photo-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleDeceasedPhotoUpload}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {deceasedPhotos.map((photo, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={photo.src}
                  alt={`Deceased ${idx + 1}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <button
                  onClick={() => handleDeleteDeceasedPhoto(idx)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 16,
                    height: 16,
                    background: "#ff4444",
                    border: "1px solid #fff",
                    borderRadius: "50%",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                    cursor: "pointer",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                  title="Delete photo"
                >
                  ×
                </button>
                <select
                  value={photo.frameStyle || "classic"}
                  onChange={(e) =>
                    setDeceasedPhotos((prev) =>
                      prev.map((p, i) =>
                        i === idx ? { ...p, frameStyle: e.target.value } : p
                      )
                    )
                  }
                  style={{
                    marginTop: 4,
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid #e0ddd7",
                    fontSize: 13,
                    background: "#fff",
                  }}
                >
                  <option value="classic">Classic</option>
                  <option value="ornate">Ornate</option>
                  <option value="modern">Modern</option>
                </select>
              </div>
            ))}
          </div>

          <ItemPalette
            onDragStart={handleDragStart}
            customItems={customStickers}
            onCustomStickerUpload={handleCustomStickerUpload}
          />
        </div>
        <div
          style={{
            flex: 1,
            position: "relative",
            background: "#f5f3ef",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            padding: "20px",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={(e) => {
            if (e.target.id === "altar-canvas" || e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <div
            style={{
              width: "100%",
              paddingBottom: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Altar Name"
              value={altarName}
              onChange={(e) => setAltarName(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #e0ddd7",
                fontSize: 16,
                minWidth: 120,
                maxWidth: 200,
              }}
            />
            <button
              onClick={handleSaveDesign}
              disabled={saveLoading}
              style={{
                background: saveLoading ? "#ccc" : "#4caf50",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: saveLoading ? "not-allowed" : "pointer",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              {saveLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setShowDesignManager(true)}
              style={{
                background: "#2196f3",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              Load
            </button>
            <div
              style={{
                position: "relative",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  background: isDownloading ? "#ccc" : "#e0ddd7",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  color: "#5a4a2c",
                  fontWeight: 600,
                  fontSize: 13,
                  opacity: isDownloading ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {isDownloading ? "Generating..." : "Download"}
              </button>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                style={{
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "1px solid #e0ddd7",
                  fontSize: 12,
                  background: "#fff",
                }}
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
              <button
                onClick={() => setShowShareModal(true)}
                style={{
                  background: "#ffe082",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: "#5a4a2c",
                  fontWeight: 600,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                }}
              >
                Share
              </button>
            </div>
          </div>
          <div
            id="altar-canvas"
            style={{
              width: wallWidth,
              height: wallHeight,
              backgroundImage: wallBgImage ? `url(${wallBgImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* Deceased photos and stickers */}
            {deceasedPhotos.map((photo, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: photo.y,
                  left: photo.x,
                  width: photo.width,
                  height: photo.height,
                  transform: `rotate(${photo.rotation}deg)`,
                  zIndex: 1,
                }}
              >
                <img
                  src={photo.src}
                  alt={`Deceased ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                    border: photo.frameStyle === "ornate" ? "4px solid #5a4a2c" : "none",
                    boxShadow: photo.frameStyle === "ornate" ? "0 0 10px rgba(0,0,0,0.2)" : "none",
                  }}
                  onMouseEnter={() => setHoveredDeceased(idx)}
                  onMouseLeave={() => setHoveredDeceased(null)}
                />
                {hoveredDeceased === idx && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "bold",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                    onClick={() => handleDeleteDeceasedPhoto(idx)}
                  >
                    ×
                  </div>
                )}
              </div>
            ))}
            {customStickers.map((sticker, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: sticker.y,
                  left: sticker.x,
                  width: sticker.width,
                  height: sticker.height,
                  transform: `rotate(${sticker.rotation}deg)`,
                  zIndex: 1,
                }}
              >
                <img
                  src={sticker.src}
                  alt={`Sticker ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                  onMouseEnter={() => setHoveredSticker(idx)}
                  onMouseLeave={() => setHoveredSticker(null)}
                />
                {hoveredSticker === idx && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "bold",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                    onClick={() => handleDeleteCustomSticker(idx)}
                  >
                    ×
                  </div>
                )}
              </div>
            ))}
            {selectedItem && (
              <div
                style={{
                  position: "absolute",
                  top: selectedItem.y,
                  left: selectedItem.x,
                  width: selectedItem.width,
                  height: selectedItem.height,
                  transform: `rotate(${selectedItem.rotation}deg)`,
                  zIndex: 2,
                  border: "2px dashed #2196f3",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                }}
              >
                <img
                  src={selectedItem.src}
                  alt={selectedItem.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 