import { Search, X } from "lucide-react";
import { CATEGORIES } from "./utils";

type ProductFiltersProps = {
  category: string;
  onSelectCategory: (category: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export function ProductFilters({
  category,
  onSelectCategory,
  query,
  onQueryChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => {
          const active = category === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelectCategory(item)}
              className={`
                min-h-[40px] rounded-full border px-4
                text-xs font-semibold
                transition-all duration-200
                ${
                  active
                    ? "border-[#171C25] bg-[#171C25] text-white"
                    : "border-[#E3E9EF] bg-white text-[#667181] hover:border-[#CBD6DE] hover:text-[#171C25]"
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative w-full lg:max-w-[300px]">
        <Search
          size={16}
          strokeWidth={1.7}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96A3]"
        />

        <input
          type="search"
          value={query}
          onChange={(event) =>
            onQueryChange(event.target.value)
          }
          placeholder="Sök produkt…"
          aria-label="Sök produkt"
          className="
            h-[44px] w-full
            rounded-full
            border border-[#E3E9EF]
            bg-[#F8FAFB]
            pl-11 pr-10
            text-sm text-[#171C25]
            outline-none
            placeholder:text-[#9BA6B0]
            transition
            focus:border-[#12B4F0]/50
            focus:bg-white
          "
        />

        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Rensa sökning"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[#8A96A3] transition hover:bg-[#EEF2F5] hover:text-[#171C25]"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}