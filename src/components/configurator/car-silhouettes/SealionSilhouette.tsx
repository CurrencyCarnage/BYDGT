interface SilhouetteProps {
  bodyColor: string;
}

export default function SealionSilhouette({ bodyColor }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        {/* Glass gradient */}
        <linearGradient id="sealion-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a3a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2a3a4a" stopOpacity="0.85" />
        </linearGradient>
        {/* Body highlight */}
        <linearGradient id="sealion-highlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
        {/* Wheel gradient */}
        <radialGradient id="sealion-wheel" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="60%" stopColor="#333" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        {/* Shadow */}
        <linearGradient id="sealion-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="400" cy="278" rx="320" ry="12" fill="url(#sealion-shadow)" />

      {/* === BODY SHELL === */}
      <path
        d={`
          M 100,240
          L 85,235
          Q 70,230 68,215
          L 68,195
          Q 68,180 80,175
          L 120,165
          L 200,148
          Q 240,140 270,130
          L 290,124
          Q 320,108 345,92
          L 370,82
          Q 390,75 420,72
          L 520,68
          Q 560,68 600,72
          L 640,80
          Q 660,86 675,100
          L 695,130
          Q 705,142 715,155
          L 725,175
          Q 730,185 730,195
          L 730,215
          Q 730,232 720,240
          L 715,245
          L 670,248
          Q 645,250 630,250
          L 620,250
          Q 605,270 580,270
          Q 555,270 540,250
          L 260,250
          Q 245,270 220,270
          Q 195,270 180,250
          L 130,248
          L 105,245
          Z
        `}
        fill={bodyColor}
        stroke="none"
      />

      {/* Body highlight overlay */}
      <path
        d={`
          M 100,240
          L 85,235
          Q 70,230 68,215
          L 68,195
          Q 68,180 80,175
          L 120,165
          L 200,148
          Q 240,140 270,130
          L 290,124
          Q 320,108 345,92
          L 370,82
          Q 390,75 420,72
          L 520,68
          Q 560,68 600,72
          L 640,80
          Q 660,86 675,100
          L 695,130
          Q 705,142 715,155
          L 725,175
          Q 730,185 730,195
          L 730,215
          Q 730,232 720,240
          L 715,245
          L 670,248
          Q 645,250 630,250
          L 620,250
          Q 605,270 580,270
          Q 555,270 540,250
          L 260,250
          Q 245,270 220,270
          Q 195,270 180,250
          L 130,248
          L 105,245
          Z
        `}
        fill="url(#sealion-highlight)"
      />

      {/* === WINDOWS === */}
      {/* Windshield */}
      <path
        d={`
          M 295,128
          Q 325,110 350,95
          L 375,85
          Q 395,78 420,76
          L 435,75
          L 435,130
          L 310,135
          Z
        `}
        fill="url(#sealion-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Side window front */}
      <path
        d={`
          M 438,75
          L 520,73
          L 520,132
          L 438,132
          Z
        `}
        fill="url(#sealion-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Side window rear */}
      <path
        d={`
          M 524,73
          L 600,76
          Q 620,80 635,90
          L 650,105
          L 650,132
          L 524,132
          Z
        `}
        fill="url(#sealion-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Window trim (chrome strip) */}
      <path
        d={`
          M 295,128
          Q 325,110 350,95
          L 375,85
          Q 395,78 420,76
          L 520,73
          L 600,76
          Q 620,80 635,90
          L 650,105
        `}
        fill="none"
        stroke="#aaa"
        strokeWidth="1.5"
      />

      {/* === DETAILS === */}
      {/* Headlight */}
      <path
        d={`
          M 78,185
          L 68,195
          L 68,210
          L 80,212
          L 100,200
          L 100,180
          Z
        `}
        fill="#e8e8f0"
        stroke="#ccc"
        strokeWidth="0.5"
        opacity="0.9"
      />

      {/* Taillight */}
      <path
        d={`
          M 720,175
          L 730,185
          L 730,215
          L 720,220
          L 715,210
          L 715,185
          Z
        `}
        fill="#cc2233"
        stroke="#aa1122"
        strokeWidth="0.5"
        opacity="0.9"
      />

      {/* Front bumper accent */}
      <line x1="70" y1="218" x2="100" y2="220" stroke="#444" strokeWidth="1" />

      {/* Door line 1 */}
      <line x1="350" y1="135" x2="350" y2="245" stroke="#000" strokeWidth="0.5" opacity="0.15" />

      {/* Door line 2 */}
      <line x1="520" y1="132" x2="520" y2="245" stroke="#000" strokeWidth="0.5" opacity="0.15" />

      {/* Side body line (character line) */}
      <path
        d="M 100,195 Q 200,185 400,182 Q 600,180 720,195"
        fill="none"
        stroke="#000"
        strokeWidth="0.6"
        opacity="0.1"
      />

      {/* Lower body trim */}
      <path
        d="M 130,248 L 180,250 L 260,250 L 540,250 L 620,250 L 670,248"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Side mirror */}
      <path
        d={`
          M 290,128
          L 278,130
          L 275,140
          L 282,145
          L 292,140
          Z
        `}
        fill={bodyColor}
        stroke="#333"
        strokeWidth="0.5"
      />

      {/* Roof rail */}
      <path
        d="M 400,70 L 610,75"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* === WHEELS === */}
      {/* Front wheel */}
      <circle cx="220" cy="258" r="40" fill="#1a1a1a" />
      <circle cx="220" cy="258" r="35" fill="url(#sealion-wheel)" />
      <circle cx="220" cy="258" r="28" fill="#444" stroke="#555" strokeWidth="1" />
      {/* Spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={`fw-${angle}`}
          x1="220"
          y1="258"
          x2={220 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={258 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#666"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="220" cy="258" r="8" fill="#555" stroke="#666" strokeWidth="1" />
      <circle cx="220" cy="258" r="3" fill="#777" />

      {/* Rear wheel */}
      <circle cx="580" cy="258" r="40" fill="#1a1a1a" />
      <circle cx="580" cy="258" r="35" fill="url(#sealion-wheel)" />
      <circle cx="580" cy="258" r="28" fill="#444" stroke="#555" strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={`rw-${angle}`}
          x1="580"
          y1="258"
          x2={580 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={258 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#666"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="580" cy="258" r="8" fill="#555" stroke="#666" strokeWidth="1" />
      <circle cx="580" cy="258" r="3" fill="#777" />
    </svg>
  );
}
