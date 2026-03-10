// app/components/organisms/SubCustomizer/index.tsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import SizeVariant from '@/app/components/molecules/SizeVariant';
import { IItem } from "@/app/common/interfaces/item.interface";
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import { getModifierGroups, getModifiers } from "@/app/actions/item/get-modifiers";
import ModifierGroup from "@/app/components/organisms/ModifierGroup";
import { DEFAULT_INGREDIENTS } from '@/app/common/util/recepies';
import ModifierGroupSkeleton from '@/app/components/molecules/ModifierGroupSkeleton';

export default function SubCustomizer({ itemGroupName, itemName, variations, initialItem = null }: {
  itemGroupName?: string,
  itemName?: string,
  variations: IItem[],
  initialItem?: IItem | null
  }) {
  const [activeItem, setActiveItem] = useState<IItem | null>(initialItem);
  const [modifierGroups, setModifierGroups] = useState<IModifierGroup[]>([]);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [removedDefaultIds, setRemovedDefaultIds] = useState<string[]>([]);
  const [extraModifierIds, setExtraModifierIds] = useState<string[]>([]);
  const [lightModifierIds, setLightModifierIds] = useState<string[]>([]);
  const MAX_QUANTITY = 100;


  useEffect(() => {
    if(!activeItem) return;

    const defaultIds = activeItem ? (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data => data.id) : [];
    setSelectedModifierIds(defaultIds);

    setQuantity(1);
    setRemovedDefaultIds([]);
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


function handleToggle(id: string) {
  const isDefault = (activeItem ? (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data => data.id).includes(id) : false);
  setSelectedModifierIds((prev) => {
    if (prev.includes(id)) {
      if (isDefault) setRemovedDefaultIds(r => [...r, id]);
      setExtraModifierIds(e => e.filter(x => x !== id));
      setLightModifierIds(e => e.filter(x => x !== id));
      return prev.filter((x) => x !== id);
    } else {
      if (isDefault) setRemovedDefaultIds(r => r.filter(x => x !== id));
      return [...prev, id];
    }
  });
}


function handleExtra(id: string) {
  setLightModifierIds(prev => prev.filter(x => x !== id));
  setExtraModifierIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
}

function handleLight(id: string) {
  setExtraModifierIds(prev => prev.filter(x => x !== id));
  setLightModifierIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
}


  const allModifiers = modifierGroups.flatMap(group =>
    group.modifiers?.elements ?? []);
  const selectedModifiers = allModifiers.filter(mod => selectedModifierIds.includes(mod.id));
  const defaultIds = activeItem ? (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data=> data.id) : [];
  const removedDefaultModifiers = allModifiers.filter(mod => removedDefaultIds.includes(mod.id));
  const replacements = modifierGroups.flatMap(group => {
    const groupIds = group.modifiers?.elements?.map(m => m.id) ?? [];
    const removedInGroup = removedDefaultIds.filter(id => groupIds.includes(id));
    const addedInGroup = selectedModifiers.filter(mod =>
    groupIds.includes(mod.id) && !defaultIds.includes(mod.id)
    );
    return addedInGroup.slice(0, removedInGroup.length).map((mod, i) => ({
      addedId: mod.id,
      removedId: removedInGroup[i]
    }));
  });
  const replacementIds = replacements.map(r => r.addedId);
  const totalPrice = (((activeItem?.price ?? 0) + selectedModifiers.reduce((sum, mod) => {
    const isExtra = extraModifierIds.includes(mod.id);
    const isDefaultMod = defaultIds.includes(mod.id);
    const isReplacement = replacementIds.includes(mod.id);
    if (isReplacement && !isExtra) return sum;
    if (isReplacement && isExtra) return sum + (mod.price ?? 0);
    if (isDefaultMod && !isExtra) return sum;
    if (isDefaultMod && isExtra) return sum + (mod.price ?? 0);
    if (!isDefaultMod && isExtra) return sum + (mod.price ?? 0) * 2;
    return sum + (mod.price ?? 0);
  }, 0)) / 100) * quantity;


  return (
    <div className="flex flex-col lg:flex-row gap-20 lg:gap-50">
      <div className="lg:order-2 flex-grow min-w-0">
      {variations.length > 1 && (
        <SizeVariant
          variations={variations}
          selectedItemId={activeItem?.id}
          onSelect={(item) => setActiveItem(item)}
        />
      )}
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
          defaultIds={activeItem ? (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data => data.id):[]}
          onToggle={handleToggle}
          onExtra={handleExtra}
          extraIds={extraModifierIds}
          onLight={handleLight}
          lightIds={lightModifierIds}
        />
    ))
}

      </div>

    {/* SUB SIDEBAR */}
    <div className="sticky lg:order-1 w-full lg:w-110 bg-gray-100 p-6 rounded-[2rem] h-fit shadow-md top-32 shrink-0">
      <h2 className="text-center text-2xl font-bold mb-6">Your Sub</h2>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
      {/* Sub name + base price */}

      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
        {quantity > 1 && (
            <span className="text-md font-semibold">{`${quantity}x`}</span>
        )}
        <span className="text-lg font-semibold">{activeItem?.name ?? "No size selected"}</span>
      </div>
      <span className="text-lg font-bold">
        {activeItem ? `$${(activeItem.price / 100).toFixed(2)}` : ""}
      </span>
    </div>

        {/* Selected modifiers list */}
        {selectedModifiers.length > 0 ? (
          <ul className="space-y-1">
            {selectedModifiers.map(mod => {
              const replacement = replacements.find(r => r.addedId === mod.id);
              const removedMod = replacement ? allModifiers.find(m => m.id === replacement.removedId) : null;
              const isExtra = extraModifierIds.includes(mod.id);
              const isLight = lightModifierIds.includes(mod.id);
              const isDefault = defaultIds.includes(mod.id);

              return (
                <Fragment key={mod.id}>
                  <li className="flex justify-between text-sm text-gray-600">
                  <span>
                    {replacement
                      ? isExtra
                        ? `Extra ${mod.name} instead of ${removedMod?.name}`
                        : isLight
                        ? `Light ${mod.name} instead of ${removedMod?.name}`
                        : `${mod.name} instead of ${removedMod?.name}`
                      : isLight ? `Light ${mod.name}`
                      : isExtra ? `Extra ${mod.name}`
                      : mod.name}
                  </span>

                  <span>
                    {replacement && isExtra
                      ? `+$${(mod.price / 100).toFixed(2)}`
                      : replacement
                      ? ""
                      : isExtra
                        ? isDefault
                        ? `+$${(mod.price / 100).toFixed(2)}`
                        : `+$${((mod.price / 100) * 2).toFixed(2)}`
                      : defaultIds.includes(mod.id)
                      ? "Included"
                      : mod.price > 0
                      ? `+$${(mod.price / 100).toFixed(2)}`
                      : "$0.00"}
                  </span>
                  </li>
                </Fragment>
              );
            })}
            {removedDefaultModifiers.map(mod => (
              <li key={`removed-${mod.id}`} className="flex justify-between text-sm text-red-400">
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
            disabled={quantity >= MAX_QUANTITY}
            className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 font-bold text-lg flex items-center justify-center disabled:invisible disabled:cursor-not-allowed"
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
