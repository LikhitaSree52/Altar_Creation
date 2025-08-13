import React from "react";

const Profile = ({ user, onLogout }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        background: "var(--modal-bg)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px var(--modal-shadow, rgba(0,0,0,0.1))",
        border: "1px solid var(--modal-text)",
        zIndex: 1000,
        minWidth: "220px",
        padding: "12px",
        animation: "fadeIn 0.2s ease-out"
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          marginBottom: "8px"
        }}
      >
        <p style={{ 
          margin: 0, 
          fontWeight: "600", 
          color: "#334155",
          fontSize: "16px"
        }}>
          {user.firstName || user.username}
        </p>
        <p style={{ 
          margin: "4px 0 0", 
          color: "#475569", 
          fontSize: "14px" 
        }}>
          {user.email}
        </p>
      </div>
      <button
        onClick={onLogout}
        style={{
          background: "var(--danger-bg, rgba(220,53,69,0.05))",
          border: "none",
          width: "100%",
          padding: "12px 16px",
          textAlign: "left",
          color: "var(--danger-text, #dc3545)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "8px",
          transition: "all 0.2s",
          ":hover": {
            background: "var(--danger-bg-hover, rgba(220,53,69,0.1))"
          }
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile; 