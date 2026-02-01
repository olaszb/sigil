import './glitch.css';
import SigilSVG from './SigilSVG';

const GlitchSigil = ({expanded}) => {
  const size = expanded ? 80 : 0;
  return (
    <div className={`logo-container transition-all duration-300 ${expanded ? "w-20 opacity-100" : "w-0 opacity-0"}`}>
      <div className={`glitch-wrapper transition-transform duration-500 ${expanded ? "scale-100" : "scale-0"}`}>
        {/* Layer 1*/}
        <div className="sigil-layer base">
          <SigilSVG size={size} />
        </div>
        
        {/* Layer 2 */}
        <div className="sigil-layer red-shift">
          <SigilSVG size={size}/>
        </div>
        
        {/* Layer 3 */}
        <div className="sigil-layer blue-shift">
          <SigilSVG size={size} />
        </div>
      </div>
    </div>
  );
};

export default GlitchSigil;