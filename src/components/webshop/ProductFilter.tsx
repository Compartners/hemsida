import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const categories = [
  "Alla",
  "Mobiler",
  "Surfplattor",
  "Tillbehör",
];

type ProductFilterProps = {
  category: string;
  query: string;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
};

export default function ProductFilter({
  category,
  query,
  onCategoryChange,
  onQueryChange,
}: ProductFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={category === item ? "default" : "outline"}
            onClick={() => onCategoryChange(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Sök produkt…"
        className="w-full sm:w-56 text-foreground"
        aria-label="Sök produkt"
      />
    </div>
  );
}