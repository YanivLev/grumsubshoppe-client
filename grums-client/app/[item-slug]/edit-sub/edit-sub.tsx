// app/[item-slug]/components/sub-customizer.tsx
'use client';

import { useState, useEffect } from 'react';
import SizeVariant from './size-variant';
import {Item} from "@/app/components/menu/interfaces/item.interface";
import { IModifierGroup } from "./interfaces/modifier.interface"
import { getModifierGroups, getModifiers }  from "./actions/get-modifiers"
import  ModifierGroup  from "./modifier-group"

export default function SubCustomizer({ itemGroupName, variations }: { itemGroupName: string, variations: Item[] }) {
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [sumPrices, setSumPrices] = useState<number>(0);
  const [modifierGroups, setModifierGroups] = useState<IModifierGroup[]>([]);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);

  useEffect(() => {
    if(!activeItem) return;
    getModifierGroups(activeItem.id).then(async (groups) => {
      const groupsWithModifiers = await Promise.all(
        groups.map(async (group: IModifierGroup) => {
          const modifiers = await getModifiers(group.id);
          return { ...group, modifiers: { elements: modifiers } };
        })
      );
      setModifierGroups(groupsWithModifiers);
    });
  }, [activeItem]);


//Checks if ID is already in the array -> if true removes, or else adds.
  function handleToggle(id: string) {
    setSelectedModifierIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-50">

      {/* THE CART SIDEBAR */}
      <div className="w-full lg:w-110 bg-gray-100 p-6 rounded-[2rem] h-fIt shadow-md sticky top-10">
        <h2 className="flex justify-center text-2xl font-bold mb-6">Your Cart</h2>
        <div className="bg-white shadow-inner text-center mb-4 rounded-md w-full">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
            <span className="text-lg font-medium ">{activeItem?.name}</span>
            <span className="text-lg font-bold">
                {activeItem ? `${(activeItem.price/100).toFixed(2)}$` : "--.--"}
            </span>
            </div>
        </div>
        
        <button 
          disabled={!activeItem}
          className="w-full mt-8 bg-black text-white py-4 rounded-full font-bold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {activeItem ? "Add to Cart" : "Select a Size"}
        </button>
      </div>
        
      <div className="flex-grow">
        {/* Your Size selection component */}
        <SizeVariant 
          variations={variations} 
          selectedItemId={activeItem?.id} 
          onSelect={(item) => setActiveItem(item)} 
        />

        {modifierGroups.map((group) => (
          <ModifierGroup
            key={group.id}
            group={group}
            selectedIds={selectedModifierIds}
            defaultIds={[]}
            onToggle={handleToggle}
          />
        ))}

        

      </div>
    </div>
  );
}