'use client';

interface FilterBarProps {
  onFilterChange?: (filters: { type?: string; minPrice?: number; maxPrice?: number }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white border-b">
      <select
        onChange={(e) => onFilterChange?.({ type: e.target.value })}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Types</option>
        <option value="housing">Housing</option>
        <option value="shop">Shop</option>
      </select>
      <input
        type="number"
        placeholder="Min price"
        className="border rounded-lg px-3 py-2 text-sm w-32"
        onChange={(e) => onFilterChange?.({ minPrice: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Max price"
        className="border rounded-lg px-3 py-2 text-sm w-32"
        onChange={(e) => onFilterChange?.({ maxPrice: Number(e.target.value) })}
      />
    </div>
  );
}
