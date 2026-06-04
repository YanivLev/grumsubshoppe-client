'use client';

import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import PillButton from "@/app/components/atoms/PillButton";
import { IItem } from '@/app/common/interfaces/item.interface';
import { IItemGroup } from '@/app/common/interfaces/item-group.interface';
import { ICategory } from '@/app/common/interfaces/category.interface';
import ItemCard from '@/app/components/molecules/ItemCard';
import Search from '../../molecules/SearchBar';
import getItemsByCategory  from '@/app/actions/menu/get-items-by-category';
import getItemGroups from '@/app/actions/menu/get-item-groups';
import getItemGroupById from '@/app/actions/item/get-item-group';
import MenuItemSkeleton from '../../molecules/MenuItemSkeleton';

export default function MenuManager({ initialCategories }: {
  initialCategories: ICategory[]}) {

    interface IDisplayItemGroup {
      type: string;
      data: IItem | IItemGroup;
    }

    const [searchValue, setSearchValue] = useState('');
    const [activeCategory, setActiveCategory] = useState(initialCategories[0]);
    const [displayItems, setDisplayItems] = useState<IDisplayItemGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      if (!activeCategory?.id) return;
      setIsLoading(true);
      getItemsByCategory(activeCategory.id).then(async (fetchedItems: IItem[]) => {
        const seenGroupIds = new Set<string>();
        const result: IDisplayItemGroup[] = [];

        for (const item of fetchedItems) {
          if (!item.itemGroup) {
            result.push({ type: 'StandAloneItem', data: item });
          } else {
            if (!seenGroupIds.has(item.itemGroup.id)) {
              seenGroupIds.add(item.itemGroup.id);
              const itemGroup = await getItemGroupById(item.itemGroup.id);
              result.push({ type: 'ItemGroup', data: itemGroup });
            }
          }
        }

        setIsLoading(false);
        setDisplayItems(result);
      });
    }, [activeCategory]);

    const searchedItems = displayItems.filter(item => 
      item.data.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <div>
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

          {!isLoading ? 
            <div>
              <div className="flex justify-center">
                <Stack spacing={4}>
                  {searchedItems.map((item) => (
                    <ItemCard key={item.data.id} item={item.data} />
                    
                  ))}
                </Stack>
              </div>
            </div>
          : <Stack>
            <MenuItemSkeleton/>
            <MenuItemSkeleton/>
            <MenuItemSkeleton/>
            </Stack>}
        </div>


      </div>
    );
  }