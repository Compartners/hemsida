const inputs = [
  { label: "Människorna", y: 68 },
  { label: "Arbetssätten", y: 180 },
  { label: "Systemen", y: 292 },
];

const inputPaths = [
  "M152 68H174C210 68 190 180 236 180",
  "M152 180H236",
  "M152 292H174C210 292 190 180 236 180",
];

function NeedsAnalysisGraphic() {
  return (
    <svg
      viewBox="0 0 560 360"
      fill="none"
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label="Människorna, arbetssätten och systemen samlas i en behovsanalys som leder till rätt lösning."
    >
      {/* Kopplingar in till analysen */}
      <g
        stroke="white"
        strokeOpacity=".15"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {inputPaths.map((path) => (
          <path key={path} d={path} />
        ))}

        <path d="M344 180H414" />
      </g>

      {/* Inkommande signaler */}
      {inputPaths.map((path) => (
        <circle
          key={path}
          className="needs-analysis-motion"
          r="3"
          fill="#1694FC"
          opacity="0"
        >
          <animateMotion
            path={path}
            dur="7s"
            keyPoints="0;1;1"
            keyTimes="0;0.43;1"
            calcMode="linear"
            repeatCount="indefinite"
          />

          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0;0"
            keyTimes="0;0.08;0.36;0.44;1"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Tre områden att förstå */}
      {inputs.map(({ label, y }, index) => (
        <g key={label}>
          <rect
            x="12"
            y={y - 25}
            width="140"
            height="50"
            rx="14"
            fill="#0D1217"
            stroke="white"
            strokeOpacity=".12"
          />

          <circle
            cx="33"
            cy={y}
            r="3"
            fill="#1694FC"
            opacity=".8"
          />

          <text
            x="47"
            y={y + 4}
            fill="#D2D9E1"
            fontSize="12"
            fontFamily="inherit"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Behovsanalys */}
      <circle
        cx="290"
        cy="180"
        r="68"
        stroke="#12B4F0"
        strokeOpacity=".1"
      />

      <circle
        className="needs-analysis-motion"
        cx="290"
        cy="180"
        r="59"
        stroke="#12B4F0"
        strokeOpacity="0"
      >
        <animate
          attributeName="r"
          values="56;67;67"
          keyTimes="0;0.65;1"
          dur="7s"
          repeatCount="indefinite"
        />

        <animate
          attributeName="stroke-opacity"
          values="0;0;0.3;0;0"
          keyTimes="0;0.35;0.46;0.7;1"
          dur="7s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="290"
        cy="180"
        r="54"
        fill="#0C151D"
        stroke="#1694FC"
        strokeOpacity=".4"
      />

      {/* Samtalssymbol */}
      <g
        stroke="#5AC7D0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M280 153h20a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5h-11l-7 5v-5h-2a5 5 0 0 1-5-5v-10a5 5 0 0 1 5-5Z" />
        <path d="M283 161h14M283 166h9" />
      </g>

      <text
        x="290"
        y="199"
        textAnchor="middle"
        fill="#F2F5F8"
        fontSize="12"
        fontWeight="500"
        fontFamily="inherit"
      >
        Behovsanalys
      </text>

      {/* En gemensam väg vidare */}
      <g className="needs-analysis-motion" opacity="0">
        <animateMotion
          path="M344 180H414"
          dur="7s"
          keyPoints="0;0;1;1"
          keyTimes="0;0.5;0.78;1"
          calcMode="linear"
          repeatCount="indefinite"
        />

        <animate
          attributeName="opacity"
          values="0;0;1;1;0;0"
          keyTimes="0;0.48;0.53;0.73;0.8;1"
          dur="7s"
          repeatCount="indefinite"
        />

        <circle r="8" fill="#3BBBA0" opacity=".12" />
        <circle r="3" fill="#3BBBA0" />
      </g>

      {/* Resultatet */}
      <rect
        x="414"
        y="145"
        width="134"
        height="70"
        rx="16"
        fill="#0B1916"
        stroke="#3BBBA0"
        strokeOpacity=".3"
      />

      <circle
        cx="481"
        cy="167"
        r="9"
        fill="#3BBBA0"
        fillOpacity=".12"
      />

      <path
        d="m477 167 3 3 5-6"
        stroke="#61CFAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="481"
        y="197"
        textAnchor="middle"
        fill="#D9EEE7"
        fontSize="12"
        fontWeight="500"
        fontFamily="inherit"
      >
        Rätt lösning
      </text>

      <text
        x="290"
        y="280"
        textAnchor="middle"
        fill="#8B99A7"
        fontSize="11"
        fontFamily="inherit"
      >
        Era behov styr. Inte leverantören.
      </text>
    </svg>
  );
}

export default function MethodSection() {
  return (
    <section
      aria-labelledby="method-title"
      className="bg-white text-white"
    >
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .needs-analysis-motion {
              display: none;
            }
          }
        `}
      </style>

      <div className="relative isolate m-5 overflow-hidden rounded-lg bg-[#050607] px-5 py-14 md:px-8 md:py-24 lg:py-28">
        {/* Mjukt bakgrundsljus */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[180px] top-[20%] -z-10 h-[520px] w-[520px] rounded-full bg-[#12B4F0]/10 blur-[130px]"
        />

        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Vänster */}
          <div>
            <h2
              id="method-title"
              className="m-0 text-[48px] font-semibold leading-[0.94] tracking-[-0.06em] sm:text-[58px] md:text-[72px] lg:text-[88px]"
            >
              Koppla ihop.
              <br />
              Förenkla.
              <br />

              <span className="bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2] bg-clip-text text-transparent">
                Förstärk.
              </span>
            </h2>
          </div>

          {/* Höger */}
          <div className="min-w-0">
   

            <NeedsAnalysisGraphic />

            <p className="mb-0 mt-3 max-w-[440px] text-sm leading-7 text-white/55">
              Vi lär känna er verksamhet och tar reda på vad som
              fungerar, vad som skaver och vad ni behöver framåt.
              Sedan formar vi lösningen tillsammans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}