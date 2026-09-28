// Side-by-side: light passes a bare nail to the sensor; a painted nail absorbs it.
export default function OximeterDiagram() {
  return (
    <figure className="paper p-5">
      <svg viewBox="0 0 320 190" className="w-full" role="img" aria-labelledby="oxi-title">
        <title id="oxi-title">血氧機光線穿透示意：素甲可正常量測，彩繪指甲會阻擋光線</title>
        {[
          { x: 20, painted: false, label: "素甲：光線順利穿透", ok: true },
          { x: 170, painted: true, label: "彩繪：光線被吸收", ok: false },
        ].map((f) => (
          <g key={f.x} transform={`translate(${f.x},0)`}>
            {/* clip top */}
            <rect x="15" y="18" width="100" height="26" rx="8" fill="var(--surface-2)" stroke="var(--border)" />
            <circle cx="65" cy="31" r="5" fill="#e0443e" />
            {/* finger */}
            <rect x="35" y="48" width="60" height="70" rx="28" fill="#f3d2bd" />
            <rect x="45" y="50" width="40" height="30" rx="12" fill={f.painted ? "#b0305c" : "#f8e4dc"} stroke={f.painted ? "#8a2248" : "#e3c3b5"} />
            {/* light beam */}
            <line x1="65" y1="38" x2="65" y2={f.painted ? 62 : 128} stroke="#e0443e" strokeWidth="3" strokeDasharray="5 4" />
            {/* clip bottom sensor */}
            <rect x="15" y="122" width="100" height="26" rx="8" fill="var(--surface-2)" stroke="var(--border)" />
            <rect x="55" y="126" width="20" height="8" rx="2" fill={f.ok ? "var(--brand)" : "var(--muted)"} />
            <text x="65" y="172" textAnchor="middle" fontSize="12.5" fill="var(--ink)" fontWeight="600">{f.label}</text>
            <text x="65" y="112" textAnchor="middle" fontSize="16" fill={f.ok ? "var(--brand)" : "var(--rush)"}>{f.ok ? "✓" : "✕"}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-center text-sm text-muted">血氧機靠紅光穿透指甲量測血氧</figcaption>
    </figure>
  );
}
