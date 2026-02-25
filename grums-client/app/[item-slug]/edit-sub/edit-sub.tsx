// app/[item-slug]/components/sub-customizer.tsx
'use client';

import { useState, useEffect } from 'react';
import SizeVariant from './size-variant';
import {Item} from "@/app/components/menu/interfaces/item.interface";
import { IModifierGroup } from "./interfaces/modifier.interface"
import { getModifierGroups, getModifiers }  from "./actions/get-modifiers"
import  ModifierGroup  from "./modifier-group"
import { DEFAULT_INGREDIENTS } from './recepies';
import ModifierGroupSkeleton from './modifier-group-skeleton';

export default function SubCustomizer({ itemGroupName, variations }: { itemGroupName: string, variations: Item[] }) {
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [modifierGroups, setModifierGroups] = useState<IModifierGroup[]>([]);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  
  
  useEffect(() => {
    if(!activeItem) return;

    //Set default modifier ids, if none return empty array.
    const defaultIds = DEFAULT_INGREDIENTS[activeItem.id] ?? [];
    setSelectedModifierIds(defaultIds);
    setQuantity(1);
    setIsLoading(true);

    getModifierGroups(activeItem.id).then(async (groups) => {
      const groupsWithModifiers = await Promise.all(
        groups.map(async (group: IModifierGroup) => {
          const modifiers = await getModifiers(group.id);
          return { ...group, modifiers: { elements: modifiers } };
        })
      );
      setModifierGroups(groupsWithModifiers);
      setIsLoading(false);
    });
  }, [activeItem]);


//Checks if ID is already in the array -> if true removes, or else adds.
  function handleToggle(id: string) {
    setSelectedModifierIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const allModifiers = modifierGroups.flatMap(group =>
    group.modifiers?.elements ?? []);
  const selectedModifiers = allModifiers.filter(mod => selectedModifierIds.includes(mod.id));
  const totalPrice = (((activeItem?.price ?? 0) + selectedModifiers.reduce((sum, mod) => sum + (mod.price ?? 0), 0)) / 100) * quantity;
  return (
    <div className="flex flex-col lg:flex-row gap-20 lg:gap-50">


        
      <div className="lg:order-2 flex-grow min-w-0">
        <SizeVariant 
          variations={variations} 
          selectedItemId={activeItem?.id} 
          onSelect={(item) => setActiveItem(item)} 
        />
      {isLoading || !activeItem
        ? <>
            <ModifierGroupSkeleton />
            <ModifierGroupSkeleton />
          </>
        : modifierGroups.map((group) => (
          <ModifierGroup
          key={group.id}
          group={group}
          selectedIds={selectedModifierIds}
          defaultIds={activeItem ? DEFAULT_INGREDIENTS[activeItem.id] ?? []: []}
          onToggle={handleToggle}
        />
    ))
}

      </div>

    {/* SUB SIDEBAR */}
    <div className="lg:order-1 w-full lg:w-110 bg-gray-100 p-6 rounded-[2rem] h-fit shadow-md sticky top-10 shrink-0">
      <h2 className="text-center text-2xl font-bold mb-6">Your Sub</h2>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
      {/* Sub name + base price */}
        
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        {quantity > 1 ? (
          <span className="text-md font-semibold ">{`${quantity}x`}</span>
        ):<></>}
        {quantity > 1 ? (
          <span className="text-lg font-semibold -ml-45">{activeItem?.name ?? "No size selected"}</span>
        ): <span className="text-lg font-semibold">{activeItem?.name ?? "No size selected"}</span>}
          <span className="text-lg font-bold">
            {activeItem ? `$${(activeItem.price / 100).toFixed(2)}`: ""}
          </span>
        </div>

        {/* Selected modifiers list */}
        {selectedModifiers.length > 0 ?(
          <ul className="space-y-1">
            {selectedModifiers.map(mod => (
              <li key={mod.id} className="flex justify-between text-sm text-gray-600">
                <span>{mod.name}</span>
                <span>{mod.price > 0 
                ? `+$${(mod.price / 100).toFixed(2)}` 
                : (DEFAULT_INGREDIENTS[activeItem!.id] ?? []).includes(mod.id)
                ? "Included"
                : `+$${(mod.price / 100).toFixed(2)}`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          
          <p className="text-sm text-gray-400 text-center">No toppings selected</p>
        )}
      </div>

      {/* Total price */}
      <div className="flex justify-between items-center px-1 mb-4">
        <span className="font-semibold text-gray-700">Total</span>
        <span className="text-xl font-bold">{activeItem ? `$${totalPrice.toFixed(2)}` : "--.--"}</span>
      </div>

        {/* Quantity */}
      {activeItem ?(
      <div className="flex justify-between items-center px-2 mb-4 w-full h-12 rounded-full bg-gray-300">
        <span className="font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center gap-3">
          {quantity > 1 && (
          <button
          onClick={() => setQuantity(q => q - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 font-bold text-lg flex items-center justify-center"
          >
            −
          </button>
        )}

          <span className="text-lg font-semibold w-4 text-center">{quantity}</span>
          <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-full bg-gray-200  cursor-pointer hover:bg-gray-300 font-bold text-lg flex items-center justify-center"
          >
          +
          </button>
        </div>
      </div>
      ): <div></div>}

      <button
        disabled={!activeItem}
        className="w-full bg-black text-white py-4 rounded-full font-bold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
      >
        {activeItem ? "Add to Cart" : "Select a Size"}
      </button>
    </div>
  </div>
  );
}