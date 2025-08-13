import React, { useState, useCallback, useEffect } from 'react';
import useSound from 'use-sound';

const AMBIENT_TRACKS = [
  { 
    label: 'Gentle Piano', 
    url: 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa8c96.mp3',
    volume: 0.5
  },
  { 
    label: 'Soft Chimes', 
    url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12c2f3c3c8.mp3',
    volume: 0.4
  },
  { 
    label: 'Nature Stream', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b6a3e4b.mp3',
    volume: 0.6
  },
  { label: 'No Music', url: null },
];

const UI_SOUNDS = [
  { 
    label: 'Classic Click', 
    url: 'https://cdn.pixabay.com/audio/2022/02/23/audio_115b8b7f0c.mp3',
    volume: 0.3
  },
  { 
    label: 'Soft Bell', 
    url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12c2f3c3c8.mp3',
    volume: 0.4
  },
  { label: 'None', url: null },
];

export default function SoundManager({
  ambientIndex = 0,
  uiSoundIndex = 0,
  volume = 0.5,
  onAmbientChange,
  onUISoundChange,
  onMuteToggle,
  muted = false,
  style = {},
}) {
  const [currentAmbient, setCurrentAmbient] = useState(ambientIndex);
  const [currentUISound, setCurrentUISound] = useState(uiSoundIndex);
  const [isMuted, setIsMuted] = useState(muted);
  
  // Load ambient sound
  const [playAmbient, { stop: stopAmbient, sound: ambientSound }] = useSound(
    AMBIENT_TRACKS[currentAmbient]?.url || null,
    { 
      volume: volume * (AMBIENT_TRACKS[currentAmbient]?.volume || 1),
      loop: true,
      soundEnabled: !isMuted && !!AMBIENT_TRACKS[currentAmbient]?.url
    }
  );

  // Load UI sound
  const [playUISound, { stop: stopUISound }] = useSound(
    UI_SOUNDS[currentUISound]?.url || null,
    { 
      volume: volume * (UI_SOUNDS[currentUISound]?.volume || 1),
      soundEnabled: !isMuted && !!UI_SOUNDS[currentUISound]?.url,
      interrupt: true
    }
  );

  // Update UI sound when selection changes
  useEffect(() => {
    return () => {
      stopUISound();
    };
  }, [currentUISound, stopUISound]);

  // Handle ambient sound changes
  useEffect(() => {
    if (isMuted || !AMBIENT_TRACKS[currentAmbient]?.url) {
      stopAmbient();
    } else {
      playAmbient();
    }
    
    return () => {
      stopAmbient();
    };
  }, [currentAmbient, isMuted, playAmbient, stopAmbient]);
  
  // Update volume when it changes
  useEffect(() => {
    if (ambientSound) {
      ambientSound.volume(volume * (AMBIENT_TRACKS[currentAmbient]?.volume || 1));
    }
  }, [volume, currentAmbient, ambientSound]);

  const handleAmbientChange = idx => {
    setCurrentAmbient(idx);
    if (onAmbientChange) onAmbientChange(idx);
  };
  const handleUISoundChange = idx => {
    setCurrentUISound(idx);
    if (onUISoundChange) onUISoundChange(idx);
  };
  const handleMuteToggle = () => {
    setIsMuted(m => !m);
    if (onMuteToggle) onMuteToggle(!isMuted);
  };

  // Expose playUISound method for global use
  useEffect(() => {
    window.playAltarUISound = () => {
      if (!isMuted && UI_SOUNDS[currentUISound]?.url) {
        playUISound();
      }
    };
    
    return () => { 
      delete window.playAltarUISound; 
      stopUISound();
    };
  }, [currentUISound, isMuted, playUISound, stopUISound]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 22,
      right: 28,
      zIndex: 50,
      background: 'rgba(255,255,255,0.8)',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(80,60,20,0.08)',
      padding: '12px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start',
      ...style,
    }}>

      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Ambient Music</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {AMBIENT_TRACKS.map((track, idx) => (
          <button
            key={track.label}
            onClick={() => handleAmbientChange(idx)}
            style={{
              background: idx === currentAmbient ? '#e0e7ff' : 'transparent',
              border: 'none',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: idx === currentAmbient ? 700 : 400,
              transition: 'background 0.2s',
            }}
          >{track.label}</button>
        ))}
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, marginTop: 8 }}>UI Sound</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {UI_SOUNDS.map((sound, idx) => (
          <button
            key={sound.label}
            onClick={() => handleUISoundChange(idx)}
            style={{
              background: idx === currentUISound ? '#ffe3ef' : 'transparent',
              border: 'none',
              borderRadius: 8,
              padding: '4px 12px',
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: idx === currentUISound ? 700 : 400,
              transition: 'background 0.2s',
            }}
          >{sound.label}</button>
        ))}
      </div>
      <button
        onClick={handleMuteToggle}
        style={{
          marginTop: 10,
          background: isMuted ? '#f8d7da' : '#e0ffe3',
          border: 'none',
          borderRadius: 8,
          padding: '6px 18px',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        title={isMuted ? 'Unmute' : 'Mute'}
      >{isMuted ? '🔇 Muted' : '🔊 Sound On'}</button>
    </div>
  );
}
