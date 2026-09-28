import {
  Search,
  X,
  SlidersHorizontal,
  PackageCheck,
} from "lucide-react";

import type {
  ProductTypeFilter,
  SortOption,
} from "./types";


type ProductFiltersProps = {
  query: string;

  onQueryChange: (
    query: string
  ) => void;

  productType:
    ProductTypeFilter;

  onProductTypeChange: (
    type: ProductTypeFilter
  ) => void;

  brand: string;

  onBrandChange: (
    brand: string
  ) => void;

  brands: string[];

  modelFamily: string;

  onModelFamilyChange: (
    model: string
  ) => void;

  models: string[];

  inStockOnly: boolean;

  onInStockOnlyChange: (
    value: boolean
  ) => void;

  sortBy: SortOption;

  onSortChange: (
    sort: SortOption
  ) => void;
};


export function ProductFilters({
  query,
  onQueryChange,

  productType,
  onProductTypeChange,

  brand,
  onBrandChange,
  brands = [],

  modelFamily,
  onModelFamilyChange,
  models = [],

  inStockOnly,
  onInStockOnlyChange,

  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-5">

      {/* =====================================================
          TOP ROW
      ===================================================== */}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        {/* Product type */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              value: "all",
              label: "Alla produkter",
            },
            {
              value: "phone",
              label: "Telefoner",
            },
            {
              value: "accessory",
              label: "Tillbehör",
            },
          ].map((item) => {
            const active =
              productType === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  onProductTypeChange(
                    item.value as ProductTypeFilter
                  )
                }
                className={`
                  min-h-[40px]
                  rounded-full
                  border
                  px-4
                  text-xs
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    active
                      ? `
                        border-[#171C25]
                        bg-[#171C25]
                        text-white
                      `
                      : `
                        border-[#E3E9EF]
                        bg-white
                        text-[#667181]
                        hover:border-[#CBD6DE]
                        hover:text-[#171C25]
                      `
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>


        {/* Search */}
        <div className="relative w-full xl:max-w-[360px]">
          <Search
            size={16}
            strokeWidth={1.7}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#8A96A3]
            "
          />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              onQueryChange(
                event.target.value
              )
            }
            placeholder="Sök produkt, modell, art.nr eller EAN…"
            aria-label="Sök produkt"
            className="
              h-[44px]
              w-full
              rounded-full
              border
              border-[#E3E9EF]
              bg-[#F8FAFB]
              pl-11
              pr-10
              text-sm
              text-[#171C25]
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
              onClick={() =>
                onQueryChange("")
              }
              aria-label="Rensa sökning"
              className="
                absolute
                right-3
                top-1/2
                grid
                h-7
                w-7
                -translate-y-1/2
                place-items-center
                rounded-full
                text-[#8A96A3]
                transition

                hover:bg-[#EEF2F5]
                hover:text-[#171C25]
              "
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>


      {/* =====================================================
          ADVANCED FILTERS
      ===================================================== */}

      <div
        className="
          border-t
          border-[#EDF1F4]
          pt-4
        "
      >
        <div
          className="
            mb-3
            flex
            items-center
            gap-2
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-[#8A96A3]
          "
        >
          <SlidersHorizontal
            size={14}
          />

          Filtrera
        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >

          {/* BRAND */}
          <FilterSelect
            label="Varumärke"
            value={brand}
            onChange={onBrandChange}
          >
            <option value="all">
              Alla varumärken
            </option>

            {brands.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </FilterSelect>


          {/* MODEL */}
          <FilterSelect
            label="Modell"
            value={modelFamily}
            onChange={
              onModelFamilyChange
            }
            disabled={
              models.length === 0
            }
          >
            <option value="all">
              Alla modeller
            </option>

            {models.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </FilterSelect>


          {/* SORT */}
          <FilterSelect
            label="Sortera"
            value={sortBy}
            onChange={(value) =>
              onSortChange(
                value as SortOption
              )
            }
          >
            <option value="recommended">
              Rekommenderat
            </option>

            <option value="price-asc">
              Pris: lägst först
            </option>

            <option value="price-desc">
              Pris: högst först
            </option>

            <option value="name-asc">
              Namn: A–Ö
            </option>
          </FilterSelect>
        </div>


        {/* STOCK */}
        <div className="mt-4">
          <label
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-2.5
              text-sm
              text-[#667181]
            "
          >
            <input
              type="checkbox"
              checked={
                inStockOnly
              }
              onChange={(event) =>
                onInStockOnlyChange(
                  event.target.checked
                )
              }
              className="
                h-4
                w-4
                rounded
                border-[#CBD6DE]
                accent-[#0B72FE]
              "
            />

            <PackageCheck
              size={16}
              className="text-[#2CCEC2]"
            />

            Endast produkter i lager
          </label>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   SELECT HELPER
   ============================================================ */

type FilterSelectProps = {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  disabled?: boolean;

  children:
    React.ReactNode;
};


function FilterSelect({
  label,
  value,
  onChange,
  disabled = false,
  children,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span
        className="
          mb-1.5
          block
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-[#8A96A3]
        "
      >
        {label}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-[42px]
          w-full
          rounded-[12px]
          border
          border-[#E3E9EF]
          bg-[#F8FAFB]
          px-3
          text-sm
          text-[#171C25]
          outline-none
          transition

          focus:border-[#12B4F0]/50
          focus:bg-white

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {children}
      </select>
    </label>
  );
}