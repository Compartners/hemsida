import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "outline"}
            onClick={() => onSelectCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Sök produkt…"
        className="w-full sm:w-56 text-foreground"
        aria-label="Sök produkt"
      />
    </div>
  );
}