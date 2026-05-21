import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

const MiniEarth = ({ onGlobeClick }) => {
  const globeEl = useRef();

  useEffect(() => {
    // Configure globe controls
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.enableZoom = false;
    }
  }, []);

  return (
    <div className="mini-earth-container">
      <Globe
        ref={globeEl}
        height={300}
        width={300}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        onGlobeClick={(obj) => onGlobeClick(obj.lat, obj.lng)}
      />
      <div className="globe-hint">✨ Click anywhere on Earth for live weather!</div>
    </div>
  );
};

export default MiniEarth;
