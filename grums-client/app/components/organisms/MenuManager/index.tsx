'use client';

import { useState } from 'react';
import { Stack } from '@mui/material';
import PillButton from "@/app/components/atoms/PillButton"
import { DEFAULT_INGREDIENTS } from '@/app/common/util/recepies';
import { IItemGroup } from '@/app/common/interfaces/item-group.interface';
import { IItem } from '@/app/common/interfaces/item.interface';
import ItemCard from '@/app/components/molecules/ItemCard';

// 1. Master Order: Define the sequence exactly as it appears in your Figma
const categoryOrder = ["Cold Subs", "Hot Subs", "Salads", "Sides", "Specialties"];

export default function MenuManager({ initialItemGroups = [], initialItems = [] }: {
  initialItemGroups: IItemGroup[],
  initialItems: IItem[]}) {

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

  const groupItemIds = new Set(
    initialItemGroups.flatMap((group: IItemGroup) =>
      group.items?.elements?.map((item: IItem) => item.id) ?? []
    )
  );

  const standaloneItems = initialItems.filter((item: IItem) => !groupItemIds.has(item.id));

  const itemCategories = standaloneItems
  .map((item: IItem) => item.categories?.elements?.[0]?.name)
  .filter(Boolean);

  const allCategories = Array.from(new Set([...categories, ...itemCategories]))
    .sort((a, b) => {
      const indexA = categoryOrder.indexOf(a as string);
      const indexB = categoryOrder.indexOf(b as string);
      return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB;
    }) as string[];

  const [activeCategory, setActiveCategory] = useState(allCategories[0] || "");

  const filteredGroups = initialItemGroups.filter((group) => {
    const groupCat = group.items?.elements?.[0]?.categories?.elements?.[0]?.name;
    return groupCat === activeCategory;
  });

  const filteredItems = standaloneItems.filter((item: IItem) =>
    item.categories?.elements?.[0]?.name === activeCategory
  );

  return (
    <div>
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-5 mb-10">
        {allCategories.map((cat) => (
          <PillButton
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </PillButton>
        ))}
      </div>

      {/* Map over Groups */}
      <div className="flex justify-center">
        <Stack spacing={4}>
        {filteredGroups.map((group) => {
          const firstItemId = group.items?.elements?.[0]?.id;
          const description = (DEFAULT_INGREDIENTS[firstItemId] ?? [])
          .map(mod => mod.name).join(', ');
          return <ItemCard key={group.id} itemGroup={group} description={description} />;
        })}
        {filteredItems.map((item: IItem) => (
          <ItemCard key={item.id} itemGroup={item} description="" />
        ))}
        </Stack>
      </div>
    </div>
  );
}
