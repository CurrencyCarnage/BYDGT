interface SilhouetteProps {
  bodyColor: string;
}

export default function YuanUpSilhouette({ bodyColor }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="yuan-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a3a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2a3a4a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="yuan-highlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="yuan-wheel" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="60%" stopColor="#333" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        <linearGradient id="yuan-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="400" cy="278" rx="280" ry="11" fill="url(#yuan-shadow)" />

      {/* === BODY SHELL — compact, rounded SUV === */}
      <path
        d={`
          M 125,240
          L 108,236
          Q 92,230 90,216
          L 90,198
          Q 90,184 102,178
          L 138,168
          L 210,152
          Q 245,144 275,136
          L 300,128
          Q 325,114 350,100
          L 378,90
          Q 398,83 425,80
          L 505,76
          Q 540,76 575,82
          L 610,92
          Q 628,100 640,115
          L 658,142
          Q 668,156 675,170
          L 685,188
          Q 690,198 690,208
          L 690,222
          Q 688,236 680,240
          L 645,246
          Q 628,248 612,248
          L 600,248
          Q 585,268 560,268
          Q 535,268 520,248
          L 275,248
          Q 260,268 235,268
          Q 210,268 195,248
          L 155,246
          L 130,243
          Z
        `}
        fill={bodyColor}
        stroke="none"
      />

      {/* Body highlight overlay */}
      <path
        d={`
          M 125,240
          L 108,236
          Q 92,230 90,216
          L 90,198
          Q 90,184 102,178
          L 138,168
          L 210,152
          Q 245,144 275,136
          L 300,128
          Q 325,114 350,100
          L 378,90
          Q 398,83 425,80
          L 505,76
          Q 540,76 575,82
          L 610,92
          Q 628,100 640,115
          L 658,142
          Q 668,156 675,170
          L 685,188
          Q 690,198 690,208
          L 690,222
          Q 688,236 680,240
          L 645,246
          Q 628,248 612,248
          L 600,248
          Q 585,268 560,268
          Q 535,268 520,248
          L 275,248
          Q 260,268 235,268
          Q 210,268 195,248
          L 155,246
          L 130,243
          Z
        `}
        fill="url(#yuan-highlight)"
      />

      {/* === WINDOWS — taller, more upright === */}
      {/* Windshield */}
      <path
        d={`
          M 305,132
          Q 330,116 355,103
          L 382,93
          Q 400,86 425,84
          L 440,83
          L 440,134
          L 318,138
          Z
        `}
        fill="url(#yuan-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Side window front */}
      <path
        d={`
          M 443,83
          L 510,80
          L 510,134
          L 443,134
          Z
        `}
        fill="url(#yuan-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Side window rear */}
      <path
        d={`
          M 514,80
          L 572,85
          Q 595,92 610,108
          L 618,120
          L 618,134
          L 514,134
          Z
        `}
        fill="url(#yuan-glass)"
        stroke="#888"
        strokeWidth="0.5"
      />

      {/* Window chrome trim */}
      <path
        d={`
          M 305,132
          Q 330,116 355,103
          L 382,93
          Q 400,86 425,84
          L 510,80
          L 572,85
          Q 595,92 610,108
          L 618,120
        `}
        fill="none"
        stroke="#aaa"
        strokeWidth="1.5"
      />

      {/* === DETAILS === */}
      {/* Headlight — rounded */}
      <path
        d={`
          M 98,190
          L 90,198
          L 90,212
          L 100,214
          L 118,204
          L 118,184
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
          M 680,178
          L 690,188
          L 690,210
          L 680,214
          L 676,206
          L 676,186
          Z
        `}
        fill="#cc2233"
        stroke="#aa1122"
        strokeWidth="0.5"
        opacity="0.9"
      />

      {/* Front lower accent */}
      <line x1="92" y1="216" x2="118" y2="218" stroke="#444" strokeWidth="1" />

      {/* Door lines */}
      <line x1="360" y1="138" x2="360" y2="244" stroke="#000" strokeWidth="0.5" opacity="0.15" />
      <line x1="510" y1="134" x2="510" y2="244" stroke="#000" strokeWidth="0.5" opacity="0.15" />

      {/* Character line */}
      <path
        d="M 118,198 Q 220,188 400,185 Q 560,183 680,196"
        fill="none"
        stroke="#000"
        strokeWidth="0.6"
        opacity="0.1"
      />

      {/* Lower trim */}
      <path
        d="M 155,246 L 195,248 L 275,248 L 520,248 L 600,248 L 645,246"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Side mirror */}
      <path
        d={`
          M 300,132
          L 288,134
          L 286,143
          L 292,147
          L 302,143
          Z
        `}
        fill={bodyColor}
        stroke="#333"
        strokeWidth="0.5"
      />

      {/* Roof rails */}
      <path
        d="M 410,78 L 585,84"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* === WHEELS === */}
      {/* Front wheel */}
      <circle cx="235" cy="256" r="38" fill="#1a1a1a" />
      <circle cx="235" cy="256" r="33" fill="url(#yuan-wheel)" />
      <circle cx="235" cy="256" r="26" fill="#444" stroke="#555" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={`fw-${angle}`}
          x1="235"
          y1="256"
          x2={235 + 24 * Math.cos((angle * Math.PI) / 180)}
          y2={256 + 24 * Math.sin((angle * Math.PI) / 180)}
          stroke="#666"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="235" cy="256" r="7" fill="#555" stroke="#666" strokeWidth="1" />
      <circle cx="235" cy="256" r="3" fill="#777" />

      {/* Rear wheel */}
      <circle cx="560" cy="256" r="38" fill="#1a1a1a" />
      <circle cx="560" cy="256" r="33" fill="url(#yuan-wheel)" />
      <circle cx="560" cy="256" r="26" fill="#444" stroke="#555" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={`rw-${angle}`}
          x1="560"
          y1="256"
          x2={560 + 24 * Math.cos((angle * Math.PI) / 180)}
          y2={256 + 24 * Math.sin((angle * Math.PI) / 180)}
          stroke="#666"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="560" cy="256" r="7" fill="#555" stroke="#666" strokeWidth="1" />
      <circle cx="560" cy="256" r="3" fill="#777" />
    </svg>
  );
}
