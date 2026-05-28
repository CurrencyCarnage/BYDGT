interface SilhouetteProps {
  bodyColor: string;
}

export default function SealSilhouette({ bodyColor }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="seal-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a3a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2a3a4a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="seal-highlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="seal-wheel" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="60%" stopColor="#333" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        <linearGradient id="seal-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="400" cy="278" rx="310" ry="12" fill="url(#seal-shadow)" />

      {/* === BODY SHELL — sleeker coupe-SUV profile === */}
      <path
        d={`
          M 95,242
          L 78,238
          Q 62,232 60,218
          L 60,198
          Q 60,182 72,176
          L 110,166
          L 185,150
          Q 220,143 260,133
          L 285,126
          Q 310,112 340,98
          L 365,88
          Q 390,80 415,76
          L 500,72
          Q 545,72 590,78
          L 640,92
          Q 660,102 672,118
          L 690,148
          Q 700,165 708,178
          L 718,195
          Q 722,205 722,215
          L 722,228
          Q 720,240 712,244
          L 668,248
          Q 645,250 625,250
          L 615,250
          Q 600,270 575,270
          Q 550,270 535,250
          L 258,250
          Q 243,270 218,270
          Q 193,270 178,250
          L 125,248
          L 100,245
          Z
        `}
        fill={bodyColor}
        stroke="none"
      />

      {/* Body highlight overlay */}
      <path
        d={`
          M 95,242
          L 78,238
          Q 62,232 60,218
          L 60,198
          Q 60,182 72,176
          L 110,166
          L 185,150
          Q 220,143 260,133
          L 285,126
          Q 310,112 340,98
          L 365,88
          Q 390,80 415,76
          L 500,72
          Q 545,72 590,78
          L 640,92
          Q 660,102 672,118
          L 690,148
          Q 700,165 708,178
          L 718,195
          Q 722,205 722,215
          L 722,228
          Q 720,240 712,244
          L 668,248
          Q 645,250 625,250
          L 615,250
          Q 600,270 575,270
          Q 550,270 535,250
          L 258,250
          Q 243,270 218,270
          Q 193,270 178,250
          L 125,248
          L 100,245
          Z
        `}
        fill="url(#seal-highlight)"
      />

      {/* === WINDOWS — more raked/sportier === */}
      {/* Windshield */}
      <path
        d={`
          M 290,130
          Q 315,114 345,100
          L 370,90
          Q 392,82 420,80
          L 432,79
          L 432,132
          L 305,136
          Z
        `}
        fill="url(#seal-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Side window front */}
      <path
        d={`
          M 435,79
          L 518,76
          L 518,132
          L 435,132
          Z
        `}
        fill="url(#seal-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Side window rear — coupe taper */}
      <path
        d={`
          M 522,76
          L 590,82
          Q 615,90 632,105
          L 642,118
          L 642,132
          L 522,132
          Z
        `}
        fill="url(#seal-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Window chrome trim */}
      <path
        d={`
          M 290,130
          Q 315,114 345,100
          L 370,90
          Q 392,82 420,80
          L 518,76
          L 590,82
          Q 615,90 632,105
          L 642,118
        `}
        fill="none"
        stroke="#aaa"
        strokeWidth="1.5"
      />

      {/* === DETAILS === */}
      {/* Headlight — slimmer/sportier */}
      <path
        d={`
          M 70,188
          L 60,198
          L 60,212
          L 72,214
          L 95,202
          L 95,182
          Z
        `}
        fill="#e8e8f0"
        stroke="#ccc"
        strokeWidth="0.5"
        opacity="0.9"
      />

      {/* Taillight — slim strip */}
      <path
        d={`
          M 712,180
          L 722,190
          L 722,218
          L 712,222
          L 708,212
          L 708,190
          Z
        `}
        fill="#cc2233"
        stroke="#aa1122"
        strokeWidth="0.5"
        opacity="0.9"
      />

      {/* Front grille accent */}
      <line x1="62" y1="215" x2="92" y2="218" stroke="#444" strokeWidth="1" />

      {/* Door lines */}
      <line x1="345" y1="136" x2="345" y2="246" stroke="#000" strokeWidth="0.5" opacity="0.15" />
      <line x1="518" y1="132" x2="518" y2="246" stroke="#000" strokeWidth="0.5" opacity="0.15" />

      {/* Character line — sweeping */}
      <path
        d="M 90,198 Q 200,186 400,183 Q 580,181 710,198"
        fill="none"
        stroke="#000"
        strokeWidth="0.6"
        opacity="0.1"
      />

      {/* Lower trim */}
      <path
        d="M 125,248 L 178,250 L 258,250 L 535,250 L 615,250 L 668,248"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Side mirror */}
      <path
        d={`
          M 284,130
          L 272,132
          L 270,142
          L 276,146
          L 286,142
          Z
        `}
        fill={bodyColor}
        stroke="#333"
        strokeWidth="0.5"
      />

      {/* === WHEELS === */}
      {/* Front wheel */}
      <circle cx="218" cy="258" r="40" fill="#1a1a1a" />
      <circle cx="218" cy="258" r="35" fill="url(#seal-wheel)" />
      <circle cx="218" cy="258" r="28" fill="#444" stroke="#555" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={`fw-${angle}`}
          x1="218"
          y1="258"
          x2={218 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={258 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#666"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <circle cx="218" cy="258" r="8" fill="#555" stroke="#666" strokeWidth="1" />
      <circle cx="218" cy="258" r="3" fill="#777" />

      {/* Rear wheel */}
      <circle cx="575" cy="258" r="40" fill="#1a1a1a" />
      <circle cx="575" cy="258" r="35" fill="url(#seal-wheel)" />
      <circle cx="575" cy="258" r="28" fill="#444" stroke="#555" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={`rw-${angle}`}
          x1="575"
          y1="258"
          x2={575 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={258 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#666"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <circle cx="575" cy="258" r="8" fill="#555" stroke="#666" strokeWidth="1" />
      <circle cx="575" cy="258" r="3" fill="#777" />
    </svg>
  );
}
