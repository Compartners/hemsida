const companies = [
  "Tuna Entreprenad",
  "Kronans Apotek",
  "Kylenkrysset",
  "Varubud Åkeri",
  "RMS Lagerinredning",
];

const TrustStrip = () => {
  return (
    <section className="border-b border-[#E3E9EF] bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-10 md:px-8 md:py-12">
        
        <p className="mb-8 text-center font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#363b41]">
          Företag som valt Compartners
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14 lg:justify-between">
          {companies.map((company) => (
            <span
              key={company}
              className="
                whitespace-nowrap
                text-[17px]
                font-semibold
                tracking-[-0.025em]
                text-[#171C25]/60

                transition-colors
                duration-300

                hover:text-[#171C25]
                
                md:text-[19px]
              "
            >
              {company}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustStrip;