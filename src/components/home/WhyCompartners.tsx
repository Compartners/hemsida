type ValueType = "independent" | "personal" | "simple";

type Value = {
  number: string;
  title: string;
  text: string;
  type: ValueType;
};

const values: Value[] = [
  {
    number: "01",
    title: "Oberoende",
    text: "Vi är inte knutna till någon leverantör. Vi rekommenderar det som passar er verksamhet, inte det som passar oss bäst.",
    type: "independent",
  },
  {
    number: "02",
    title: "Personligt",
    text: "En fast kontaktperson som lär känna er verksamhet. Ni ringer en person, inte ett supportnummer.",
    type: "personal",
  },
  {
    number: "03",
    title: "Enkelt",
    text: "Ett avtal, en faktura, en kontakt. Vi samlar delarna och tar ansvar för att det fungerar i vardagen.",
    type: "simple",
  },
];

type SignalDotProps = {
  path: string;
  duration?: string;
  points?: string;
  times?: string;
  opacity?: string;
  opacityTimes?: string;
  colors?: string;
  colorTimes?: string;
};

const SignalDot = ({
  path,
  duration = "6s",
  points = "0;1;1",
  times = "0;0.85;1",
  opacity = "0;1;1;0;0",
  opacityTimes = "0;0.08;0.78;0.88;1",
  colors = "#1694FC;#1694FC;#3BBBA0;#3BBBA0",
  colorTimes = "0;0.35;0.6;1",
}: SignalDotProps) => (
  <g className="why-signal-motion" opacity="0">
    <animateMotion
      path={path}
      keyPoints={points}
      keyTimes={times}
      calcMode="linear"
      dur={duration}
      repeatCount="indefinite"
    />

    <animate
      attributeName="opacity"
      values={opacity}
      keyTimes={opacityTimes}
      dur={duration}
      repeatCount="indefinite"
    />

    {/* En svag aura runt pricken */}
    <circle r="7" opacity=".1" fill="#1694FC">
      <animate
        attributeName="fill"
        values={colors}
        keyTimes={colorTimes}
        dur={duration}
        repeatCount="indefinite"
      />
    </circle>

    <circle r="2.7" fill="#1694FC">
      <animate
        attributeName="fill"
        values={colors}
        keyTimes={colorTimes}
        dur={duration}
        repeatCount="indefinite"
      />
    </circle>
  </g>
);

const SignalGraphic = ({ type }: { type: ValueType }) => (
  <svg
    viewBox="0 0 260 100"
    fill="none"
    className="mb-[18px] block h-[60px] w-[156px] max-w-full overflow-visible text-[#6C8195] min-[761px]:mb-[22px]"
    aria-hidden="true"
    focusable="false"
  >
    <g
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "independent" && (
        <>
          <path
            d="M36 22h46c25 0 22 28 48 28M36 50h94M36 78h46c25 0 22-28 48-28"
            opacity=".22"
          />
          <path d="M36 50h178" opacity=".65" />

          {[22, 50, 78].map((y) => (
            <circle
              key={y}
              cx="36"
              cy={y}
              r="5"
              fill="#FCFDFE"
              opacity={y === 50 ? 1 : 0.4}
            />
          ))}

          <circle
            cx="130"
            cy="50"
            r="15"
            fill="#FCFDFE"
            strokeOpacity=".35"
          />
          <path d="m124 50 4 4 8-9" />

          <circle cx="214" cy="50" r="6" fill="#FCFDFE" />
          <circle cx="214" cy="50" r="13" opacity=".16" />
        </>
      )}

      {type === "personal" && (
        <>
          <path d="M92 50h76" opacity=".45" />

          <circle
            cx="68"
            cy="50"
            r="24"
            fill="#FCFDFE"
            strokeOpacity=".35"
          />
          <circle
            cx="192"
            cy="50"
            r="24"
            fill="#FCFDFE"
            strokeOpacity=".35"
          />

          <circle cx="68" cy="43" r="6" />
          <path d="M57 61c0-12 22-12 22 0" />

          <circle cx="192" cy="43" r="6" />
          <path d="M181 61c0-12 22-12 22 0" />

          <circle cx="130" cy="50" r="12" opacity=".12" />
        </>
      )}

      {type === "simple" && (
        <>
          <path
            d="M35 22h43c30 0 24 28 52 28M35 78h43c30 0 24-28 52-28M35 50h95"
            opacity=".25"
          />

          {[22, 50, 78].map((y) => (
            <circle
              key={y}
              cx="35"
              cy={y}
              r="4"
              fill="#FCFDFE"
              strokeOpacity=".4"
            />
          ))}

          <path d="M130 50h62" opacity=".65" />

          <rect
            x="192"
            y="28"
            width="40"
            height="44"
            rx="12"
            fill="#FCFDFE"
            strokeOpacity=".4"
          />

          <path d="m202 50 7 7 13-15" />
        </>
      )}
    </g>

    {/* Oberoende: signalen passerar kontrollpunkten */}
    {type === "independent" && (
      <SignalDot
        path="M36 50H214"
        points="0;0.53;0.53;1;1"
        times="0;0.36;0.48;0.85;1"
        colorTimes="0;0.36;0.48;1"
      />
    )}

    {/* Personligt: en signal går fram och tillbaka */}
    {type === "personal" && (
      <SignalDot
        path="M94 50H166H94"
        duration="7s"
        points="0;0.5;0.5;1;1"
        times="0;0.34;0.48;0.85;1"
        colors="#1694FC;#1694FC;#3BBBA0;#3BBBA0;#1694FC"
        colorTimes="0;0.3;0.48;0.8;1"
      />
    )}

    {/* Enkelt: tre inkommande signaler blir en */}
    {type === "simple" && (
      <>
        {[
          "M35 22h43c30 0 24 28 52 28",
          "M35 50h95",
          "M35 78h43c30 0 24-28 52-28",
        ].map((path) => (
          <SignalDot
            key={path}
            path={path}
            duration="6.5s"
            points="0;1;1"
            times="0;0.46;1"
            opacity="0;1;1;0;0"
            opacityTimes="0;0.06;0.43;0.47;1"
            colorTimes="0;0.3;0.46;1"
          />
        ))}

        <SignalDot
          path="M130 50H192"
          duration="6.5s"
          points="0;0;1;1"
          times="0;0.46;0.84;1"
          opacity="0;0;1;1;0;0"
          opacityTimes="0;0.44;0.48;0.8;0.88;1"
          colors="#3BBBA0;#3BBBA0"
          colorTimes="0;1"
        />
      </>
    )}
  </svg>
);

const WhyCompartners = () => (
  <section
    id="varfor"
    aria-labelledby="why-compartners-title"
    className="bg-white text-[#171C25]"
  >
    <style>
      {`
        @media (prefers-reduced-motion: reduce) {
          #varfor .why-signal-motion {
            display: none;
          }
        }
      `}
    </style>

    <div className="m-5 min-h-max rounded-lg bg-gray-100 bg-[url('/images/why-compartners-bg.jpg')]">
      <div className="mx-auto w-full max-w-[1240px] p-5 min-[761px]:px-8">
        <div>
          <h2
            id="why-compartners-title"
            className="m-0 text-[clamp(42px,5.3vw,68px)] font-semibold leading-[1.04] tracking-[-0.055em]"
          >
            En partner för
            <br />
            <span className="text-[#6B7788]">
              er kommunikation.
            </span>
          </h2>

          <p className="mb-0 mt-[22px] max-w-[540px] text-[16px] leading-[1.85] text-[#556070]">
            Vi börjar inte i produkten. Vi börjar i er verksamhet: hur ni
            arbetar, vem som ringer vem och var det skaver idag.
          </p>
        </div>

        <div className="mt-[30px] grid grid-cols-1 gap-[14px] min-[761px]:mt-10 min-[761px]:grid-cols-3 min-[901px]:gap-[18px]">
          {values.map((value) => (
            <article
              key={value.number}
              className="min-w-0 rounded-[20px] border border-[#E7ECF0] bg-[#FCFDFE] p-6 transition-[border-color,background-color] duration-300 min-[761px]:px-[22px] min-[901px]:px-[26px] min-[901px]:pb-7 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:border-[#CDD7DF] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#F9FBFC]"
            >
              <SignalGraphic type={value.type} />

              <h3 className="m-0 text-[26px] font-semibold leading-[1.15] tracking-[-0.04em]">
                {value.title}
              </h3>

              <p className="mb-0 mt-[13px] text-[15px] leading-[1.85] text-[#556070]">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyCompartners;