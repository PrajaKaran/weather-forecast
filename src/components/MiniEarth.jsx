import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const MiniEarth = ({ onGlobeClick }) => {
  const globeEl = useRef();

  useEffect(() => {
    // Configure globe controls and lighting
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      controls.enableZoom = false;

      // Make the earth bright and realistic
      const scene = globeEl.current.scene();
      
      // Remove any existing lights to prevent duplicate lights on re-renders
      const lights = scene.children.filter(c => c.isLight);
      lights.forEach(l => scene.remove(l));

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Balanced ambient light
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);
    }
  }, []);

  return (
    <div className="mini-earth-container">
      <Globe
        ref={globeEl}
        height={300}
        width={300}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.15}
        onGlobeClick={(obj) => onGlobeClick(obj.lat, obj.lng)}
      />
    </div>
  );
};

export default MiniEarth;
