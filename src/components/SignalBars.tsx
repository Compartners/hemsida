import React from "react";

type BrandSignalBarsProps = {
  /**
   * Storlek på hela signalmotivet.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Horisontell grundplacering.
   */
  align?: "left" | "center" | "right";

  /**
   * Visa subtil glow bakom staplarna.
   */
  glow?: boolean;

  /**
   * Extra classes på hela overlay-containern.
   */
  className?: string;

  /**
   * Extra classes direkt på gruppen med staplar.
   * Bra för sektion-specifik positionering/transform.
   */
  barsClassName?: string;
};

const SIZE_STYLES = {
  sm: {
    wrapper: "gap-3",
    first: "h-[150px] w-[48px]",
    second: "h-[210px] w-[52px]",
    third: "h-[270px] w-[58px]",
    bottom: "-bottom-[95px]",
  },

  md: {
    wrapper: "gap-4 md:gap-5",
    first: "h-[210px] w-[64px] md:h-[240px] md:w-[74px]",
    second: "h-[290px] w-[70px] md:h-[320px] md:w-[82px]",
    third: "h-[370px] w-[76px] md:h-[410px] md:w-[90px]",
    bottom: "-bottom-[125px]",
  },

  lg: {
    wrapper: "gap-5 md:gap-7",
    first: "h-[250px] w-[76px] md:w-[92px]",
    second: "h-[340px] w-[82px] md:w-[100px]",
    third: "h-[440px] w-[90px] md:w-[110px]",
    bottom: "-bottom-[145px]",
  },
};

const ALIGN_STYLES = {
  left: "left-[4%] md:left-[8%]",
  center: "left-1/2 -translate-x-1/2",
  right: "right-[4%] md:right-[8%]",
};

const BrandSignalBars = ({
  size = "lg",
  align = "left",
  glow = true,
  className = "",
  barsClassName = "",
}: BrandSignalBarsProps) => {
  const styles = SIZE_STYLES[size];

  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
        ${className}
      `}
    >
      {glow && (
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-secondary/5
            blur-[120px]
          "
        />
      )}

      <div
        className={`
          absolute
          ${styles.bottom}
          ${ALIGN_STYLES[align]}
          ${styles.wrapper}

          flex
          items-end

          ${barsClassName}
        `}
      >
        {/* Signal Blue */}
        <div
          className={`
            shrink-0
            rounded-full
            bg-primary
            transition-transform
            duration-700

            ${styles.first}
          `}
        />

        {/* Electric Cyan */}
        <div
          className={`
            shrink-0
            rounded-full
            bg-secondary/80
            transition-transform
            duration-700

            ${styles.second}
          `}
        />

        {/* AI Teal */}
        <div
          className={`
            shrink-0
            rounded-full
            bg-accent/60
            transition-transform
            duration-700

            ${styles.third}
          `}
        />
      </div>
    </div>
  );
};

export default BrandSignalBars;