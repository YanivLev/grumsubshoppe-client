'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Item from './item-card';
import { List, Stack } from '@mui/material';

// 1. Master Order: Define the sequence exactly as it appears in your Figma
const categoryOrder = ["Cold Subs", "Hot Subs", "Salads", "Sides", "Specialties"];

export default function MenuManager({ initialItems = [] }: { initialItems: any[] }) {
  
  // 2. Extract and Sort Categories
  const categories = Array.from(
    new Set(
      initialItems
        ?.map((item) => item.categories?.elements?.[0]?.name || item.categories?.[0]?.name)
        .filter(Boolean)
    )
  ).sort((a, b) => {
    // Look up the position of the category names in our Master Order list
    const indexA = categoryOrder.indexOf(a as string);
    const indexB = categoryOrder.indexOf(b as string);

    // If a category from Clover isn't in our list, push it to the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    // Mathematical comparison to determine order
    return indexA - indexB;
  }) as string[];

  // 3. Set the default active category to the first one in our sorted list
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");

  // 4. Filter logic to show only items matching the selected category
  const filteredItems = initialItems.filter((item) => {
    const itemCat = item.categories?.elements?.[0]?.name || item.categories?.[0]?.name;
    return itemCat === activeCategory;
  });

  // Safety check: if the API returned nothing, show an error message
  if (!initialItems || initialItems.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500 font-medium">No items found. Check API connection.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-5 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold cursor-pointer transition-all transition duration-300 ease-in-out hover:scale-110 ${
              activeCategory === cat ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500 "
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

    <div className="flex justify-center">
      <Stack spacing={5}>
        {filteredItems.map((item) => (
            <div key={item.id}> {/* Adjust layout as needed */}
              <Item item={item} />
            </div>
          ))}
      </Stack>
    </div>
    </div>
  );
}