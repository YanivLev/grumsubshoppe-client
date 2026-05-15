'use client';

import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import PillButton from "@/app/components/atoms/PillButton";
import { IItem } from '@/app/common/interfaces/item.interface';
import { ICategory } from '@/app/common/interfaces/category.interface';
import ItemCard from '@/app/components/molecules/ItemCard';
import Search from '../../molecules/SearchBar';
import getItemsByCategory  from '@/app/actions/menu/get-items-by-category';

export default function MenuManager({ initialCategories }: {
  initialCategories: ICategory[]}) {

    const [searchValue, setSearchValue] = useState('');
    const [items, setItems] = useState<IItem[]>([]);
    const [activeCategory, setActiveCategory] = useState(initialCategories[0]);

    useEffect(() => {
      if (!activeCategory?.id) return;
      getItemsByCategory(activeCategory.id).then(setItems);
    }, [activeCategory]);

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-5 mb-8">
          {initialCategories.map((cat) => (
            <PillButton
              key={cat.id}
              active={activeCategory?.id === cat.id}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.name}
            </PillButton>
          ))}
        </div>
        <div className="mb-8">
          <Search onSearch={(v) => setSearchValue(v)} />
        </div>
        <div className="flex justify-center">
          <Stack spacing={4}>
            {filteredItems.map((item) => (
              <ItemCard key={item.id} itemGroup={item} description="" />

            ))}
          </Stack>
        </div>
      </div>
    );
  }