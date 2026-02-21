function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function RollerCoasterIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 30}, ${cy - 20})`}>
      <path d="M0 40 Q10 0 20 25 Q30 50 40 10 Q50 -10 60 30" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="5" cy="38" r="4" fill={color} opacity="0.8" />
      <circle cx="10" cy="35" r="4" fill={color} opacity="0.8" />
      <rect x="3" y="30" width="10" height="6" rx="2" fill={color} opacity="0.9" />
    </g>
  );
}

function DarkRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 20}, ${cy - 22})`}>
      <path d="M20 0 L25 15 L40 15 L28 24 L32 40 L20 30 L8 40 L12 24 L0 15 L15 15 Z" fill={color} opacity="0.85" />
      <circle cx="20" cy="18" r="5" fill="rgba(0,0,0,0.3)" />
    </g>
  );
}

function SimulatorIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 22}, ${cy - 22})`}>
      <rect x="4" y="4" width="36" height="28" rx="4" fill="none" stroke={color} strokeWidth="2.5" />
      <rect x="8" y="8" width="28" height="20" rx="2" fill={color} opacity="0.25" />
      <polygon points="18,14 18,24 28,19" fill={color} opacity="0.9" />
      <rect x="14" y="34" width="16" height="3" rx="1" fill={color} opacity="0.6" />
    </g>
  );
}

function WaterRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 28}, ${cy - 16})`}>
      <path d="M0 16 Q7 8 14 16 Q21 24 28 16 Q35 8 42 16 Q49 24 56 16" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M4 26 Q11 18 18 26 Q25 34 32 26 Q39 18 46 26" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="28" cy="6" r="3" fill={color} opacity="0.6" />
      <circle cx="20" cy="4" r="2" fill={color} opacity="0.4" />
    </g>
  );
}

function WaterSlideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 22}, ${cy - 24})`}>
      <path d="M5 0 L5 12 Q5 20 15 24 Q25 28 25 36 Q25 44 35 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="5" cy="0" r="4" fill={color} opacity="0.7" />
      <path d="M28 42 Q32 38 36 42 Q40 46 44 42" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
    </g>
  );
}

function BoatRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 22}, ${cy - 16})`}>
      <path d="M0 20 L8 8 L36 8 L44 20 Z" fill={color} opacity="0.7" />
      <rect x="18" y="0" width="3" height="10" fill={color} opacity="0.9" />
      <path d="M21 2 L34 7 L21 7 Z" fill={color} opacity="0.6" />
      <path d="M-2 24 Q8 18 18 24 Q28 30 38 24 Q44 20 48 24" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
    </g>
  );
}

function InteractiveRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 20}, ${cy - 20})`}>
      <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="20" cy="20" r="12" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <circle cx="20" cy="20" r="5" fill={color} opacity="0.8" />
      <line x1="20" y1="0" x2="20" y2="6" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="20" y1="34" x2="20" y2="40" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="0" y1="20" x2="6" y2="20" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="34" y1="20" x2="40" y2="20" stroke={color} strokeWidth="2" opacity="0.5" />
    </g>
  );
}

function SpinnerIcon({ cx, cy, color }) {
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle cx="0" cy="0" r="18" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 14;
        const y = Math.sin(rad) * 14;
        return <circle key={i} cx={x} cy={y} r="4" fill={color} opacity={0.5 + (i % 3) * 0.15} />;
      })}
      <circle cx="0" cy="0" r="4" fill={color} opacity="0.9" />
    </g>
  );
}

function DropRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 12}, ${cy - 24})`}>
      <rect x="4" y="0" width="16" height="44" rx="3" fill={color} opacity="0.3" />
      <rect x="6" y="30" width="12" height="8" rx="2" fill={color} opacity="0.8" />
      <path d="M12 42 L6 48 L18 48 Z" fill={color} opacity="0.7" />
      <path d="M12 18 L8 22 L16 22 Z" fill={color} opacity="0.6" />
      <path d="M12 12 L10 15 L14 15 Z" fill={color} opacity="0.4" />
    </g>
  );
}

function TrackRideIcon({ cx, cy, color }) {
  const ties = [4, 12, 20, 28, 36, 44];
  return (
    <g transform={`translate(${cx - 24}, ${cy - 12})`}>
      <line x1="0" y1="20" x2="48" y2="20" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="0" y1="24" x2="48" y2="24" stroke={color} strokeWidth="2" opacity="0.5" />
      {ties.map((x, i) => (
        <line key={i} x1={x} y1="20" x2={x} y2="24" stroke={color} strokeWidth="1.5" opacity="0.4" />
      ))}
      <rect x="16" y="12" width="16" height="10" rx="3" fill={color} opacity="0.75" />
      <circle cx="18" cy="24" r="3" fill={color} opacity="0.6" />
      <circle cx="30" cy="24" r="3" fill={color} opacity="0.6" />
    </g>
  );
}

function CarouselIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <ellipse cx="0" cy="8" rx="22" ry="8" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="0" y1="-20" x2="0" y2="8" stroke={color} strokeWidth="2.5" />
      <ellipse cx="0" cy="-20" rx="16" ry="4" fill={color} opacity="0.3" />
      <line x1="-12" y1="-13.6" x2="-14.4" y2="6" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="0" y1="-16" x2="0" y2="6" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="12" y1="-13.6" x2="14.4" y2="6" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="-16.8" cy="6" rx="3" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="0" cy="6" rx="3" ry="5" fill={color} opacity="0.7" />
      <ellipse cx="16.8" cy="6" rx="3" ry="5" fill={color} opacity="0.8" />
    </g>
  );
}

function TheaterRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 22}, ${cy - 18})`}>
      <path d="M0 36 L0 8 Q22 -6 44 8 L44 36 Z" fill={color} opacity="0.2" />
      <path d="M0 8 Q22 -6 44 8" fill="none" stroke={color} strokeWidth="2.5" />
      <rect x="8" y="14" width="28" height="18" rx="2" fill={color} opacity="0.15" />
      <circle cx="22" cy="22" r="6" fill={color} opacity="0.5" />
      <polygon points="20,19 20,25 26,22" fill="rgba(255,255,255,0.8)" />
    </g>
  );
}

function TrainIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 26}, ${cy - 12})`}>
      <rect x="0" y="4" width="20" height="16" rx="3" fill={color} opacity="0.7" />
      <rect x="22" y="8" width="14" height="12" rx="2" fill={color} opacity="0.5" />
      <rect x="38" y="8" width="14" height="12" rx="2" fill={color} opacity="0.4" />
      <circle cx="6" cy="22" r="3" fill={color} opacity="0.8" />
      <circle cx="16" cy="22" r="3" fill={color} opacity="0.8" />
      <circle cx="29" cy="22" r="2.5" fill={color} opacity="0.6" />
      <circle cx="45" cy="22" r="2.5" fill={color} opacity="0.6" />
      <rect x="2" y="0" width="6" height="6" rx="1" fill={color} opacity="0.5" />
    </g>
  );
}

function SafariIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 24}, ${cy - 18})`}>
      <circle cx="24" cy="12" r="10" fill={color} opacity="0.2" />
      <path d="M24 2 L26 8 L24 6 L22 8 Z" fill={color} opacity="0.6" />
      <ellipse cx="24" cy="28" rx="20" ry="6" fill={color} opacity="0.15" />
      <path d="M12 18 L12 28" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M8 14 L12 18 L16 16" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M36 16 L36 28" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M32 12 L36 16 L40 14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="36" cy="10" r="3" fill={color} opacity="0.5" />
    </g>
  );
}

function WalkThroughIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 18}, ${cy - 22})`}>
      <circle cx="18" cy="6" r="5" fill={color} opacity="0.7" />
      <line x1="18" y1="11" x2="18" y2="28" stroke={color} strokeWidth="2.5" />
      <line x1="18" y1="16" x2="8" y2="22" stroke={color} strokeWidth="2" />
      <line x1="18" y1="16" x2="28" y2="22" stroke={color} strokeWidth="2" />
      <line x1="18" y1="28" x2="10" y2="40" stroke={color} strokeWidth="2" />
      <line x1="18" y1="28" x2="26" y2="40" stroke={color} strokeWidth="2" />
      <path d="M30 36 L34 32 L38 36" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <path d="M32 30 L36 26 L40 30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
    </g>
  );
}

function SuspendedRideIcon({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx - 24}, ${cy - 20})`}>
      <line x1="0" y1="0" x2="48" y2="0" stroke={color} strokeWidth="3" opacity="0.5" />
      <line x1="12" y1="0" x2="16" y2="14" stroke={color} strokeWidth="2" opacity="0.6" />
      <line x1="36" y1="0" x2="32" y2="14" stroke={color} strokeWidth="2" opacity="0.6" />
      <ellipse cx="24" cy="18" rx="12" ry="6" fill={color} opacity="0.3" />
      <path d="M14 22 Q24 36 34 22" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      <circle cx="18" cy="16" r="2" fill={color} opacity="0.7" />
      <circle cx="30" cy="16" r="2" fill={color} opacity="0.7" />
    </g>
  );
}

const iconComponents = {
  "Roller Coaster": RollerCoasterIcon,
  "Dark Ride": DarkRideIcon,
  "Simulator": SimulatorIcon,
  "Water Ride": WaterRideIcon,
  "Water Slide": WaterSlideIcon,
  "Boat Ride": BoatRideIcon,
  "Interactive Ride": InteractiveRideIcon,
  "Spinner": SpinnerIcon,
  "Drop Ride": DropRideIcon,
  "Track Ride": TrackRideIcon,
  "Carousel": CarouselIcon,
  "Theater Ride": TheaterRideIcon,
  "Train": TrainIcon,
  "Safari": SafariIcon,
  "Walk-Through": WalkThroughIcon,
  "Suspended Ride": SuspendedRideIcon,
};

const parkGradients = {
  "Magic Kingdom":             { from: [250, 60, 28], to: [280, 65, 18] },
  "EPCOT":                     { from: [210, 70, 25], to: [240, 60, 18] },
  "Hollywood Studios":         { from: [340, 60, 25], to: [320, 55, 18] },
  "Animal Kingdom":            { from: [140, 50, 22], to: [160, 45, 15] },
  "Universal Studios Florida": { from: [35, 70, 25],  to: [20, 65, 18] },
  "Islands of Adventure":      { from: [170, 60, 22], to: [190, 55, 15] },
  "Volcano Bay":               { from: [15, 75, 28],  to: [0, 70, 20] },
  "Epic Universe":             { from: [270, 65, 28], to: [290, 60, 20] },
};

export default function RideImage({ ride, large }) {
  const seed = hashStr(ride.name);
  const grad = parkGradients[ride.park] || { from: [220, 50, 25], to: [240, 50, 18] };

  const hueShift = (seed % 30) - 15;
  const fromH = grad.from[0] + hueShift;
  const toH = grad.to[0] + hueShift;

  const bgFrom = hsl(fromH, grad.from[1], grad.from[2]);
  const bgTo = hsl(toH, grad.to[1], grad.to[2]);

  const accentHue = (fromH + 40 + (seed % 60)) % 360;
  const iconColor = hsl(accentHue, 70, 70);

  const gradId = `bg-${ride.id}`;
  const IconComponent = iconComponents[ride.type] || DarkRideIcon;

  const viewH = large ? 200 : 140;
  const iconY = large ? 80 : 58;
  const iconScale = large ? 1.4 : 1;
  const displayName = ride.name.length > 35 ? ride.name.slice(0, 33) + "..." : ride.name;

  return (
    <svg
      className={large ? "ride-image-large" : "ride-image"}
      viewBox={`0 0 320 ${viewH}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${ride.type} illustration for ${ride.name}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bgFrom} />
          <stop offset="100%" stopColor={bgTo} />
        </linearGradient>
      </defs>

      <rect width="320" height={viewH} fill={`url(#${gradId})`} />

      <line x1="0" y1={viewH} x2="320" y2={viewH - 40} stroke="white" strokeWidth="0.5" opacity="0.04" />
      <line x1="0" y1={viewH - 20} x2="320" y2={viewH - 60} stroke="white" strokeWidth="0.5" opacity="0.03" />

      {large ? (
        <g transform={`translate(${160 - 160 * iconScale}, ${iconY - iconY * iconScale}) scale(${iconScale})`}>
          <IconComponent cx={160} cy={iconY} color={iconColor} />
        </g>
      ) : (
        <IconComponent cx={160} cy={iconY} color={iconColor} />
      )}

      {!large && <rect x="0" y="105" width="320" height="35" fill="rgba(0,0,0,0.35)" />}
      {!large && (
        <text
          x="16"
          y="128"
          fill="white"
          fontSize="13"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {displayName}
        </text>
      )}
    </svg>
  );
}
