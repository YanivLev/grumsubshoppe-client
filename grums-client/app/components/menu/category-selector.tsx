'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Item from './item-card';
import { List, Stack } from '@mui/material';

// 1. Master Order: Define the sequence exactly as it appears in your Figma
const categoryOrder = ["Cold Subs", "Hot Subs", "Salads", "Sides", "Specialties"];

export default function MenuManager({ initialItemGroups = [] }: { initialItemGroups: any[] }) {
  
  // Get category names from the item groups
  const categories = Array.from(
    new Set(
      initialItemGroups
        ?.map((group) => group.items?.elements?.[0]?.categories?.elements?.[0]?.name)
        .filter(Boolean)
    )
  ).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a as string);
    const indexB = categoryOrder.indexOf(b as string);
    return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB;
  }) as string[];

  const [activeCategory, setActiveCategory] = useState(categories[0] || "");

  // Filter logic: Show the item group if its first item matches the category
  const filteredGroups = initialItemGroups.filter((group) => {
    const groupCat = group.items?.elements?.[0]?.categories?.elements?.[0]?.name;
    return groupCat === activeCategory;
  });

  return (
    <div>
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-5 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full cursor-pointer font-bold hover:scale-105 duration-300 transition-all ${
              activeCategory === cat ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map over Groups */}
      <div className="flex justify-center">
        <Stack spacing={4}>
          {filteredGroups.map((group) => (
            <Item key={group.id} itemGroup={group} /> 
          ))}
        </Stack>
      </div>
    </div>
  );
}