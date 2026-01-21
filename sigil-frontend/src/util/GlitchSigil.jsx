import React from 'react';
import './glitch.css';
import SigilSVG from './SigilSVG';

const GlitchSigil = () => {
  return (
    <div className="glitch-wrapper">
      {/* Layer 1*/}
      <div className="sigil-layer base">
        <SigilSVG />
      </div>
      
      {/* Layer 2 */}
      <div className="sigil-layer red-shift">
        <SigilSVG />
      </div>
      
      {/* Layer 3 */}
      <div className="sigil-layer blue-shift">
        <SigilSVG />
      </div>
    </div>
  );
};

export default GlitchSigil;