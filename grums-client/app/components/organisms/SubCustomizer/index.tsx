'use client';

import { useState, useEffect, Fragment, useRef } from 'react';
import SizeVariant from '@/app/components/molecules/SizeVariant';
import { IItem } from "@/app/common/interfaces/item.interface";
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import ModifierGroup from "@/app/components/organisms/ModifierGroup";
import { DEFAULT_INGREDIENTS } from '@/app/common/util/recepies';
import { useCartStore } from '@/app/store/cart.store';
import ModifierGroupSkeleton from '@/app/components/molecules/ModifierGroupSkeleton';
import { useRouter } from 'next/navigation';
import QuantitySelector from '../../molecules/QuantitySelector';
import ModifierLineItem from '../../molecules/ModifierLineItem';
import SpecialInstructionsInput from '../../molecules/SpecialInstructions';

export default function SubCustomizer({ itemGroupName, itemName, variations, initialItem = null, modifiersByItemId, itemPath, editCartItemId}: {
  itemGroupName?: string,
  itemName?: string,
  variations: IItem[],
  initialItem?: IItem | null,
  modifiersByItemId: Record<string, IModifierGroup[]>,
  itemPath: string,
  editCartItemId?: string
}) {
  const [activeItem, setActiveItem] = useState<IItem | null>(initialItem);
  const [modifierGroups, setModifierGroups] = useState<IModifierGroup[]>([]);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [removedDefaultIds, setRemovedDefaultIds] = useState<string[]>([]);
  const [extraModifierIds, setExtraModifierIds] = useState<string[]>([]);
  const [lightModifierIds, setLightModifierIds] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");

  const MAX_QUANTITY = 100;
  const MAX_CHAR_LENGTH = 120;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);
  const updateItem = useCartStore((state) => state.updateItem);
  const router = useRouter();

  const isEditInit = useRef(false);

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    if (input.length <= MAX_CHAR_LENGTH) setNote(input);
  };

  useEffect(() => {
    if (!activeItem) return;
    if (isEditInit.current) {
      isEditInit.current = false;
      return;
    }
    const defaultIds = (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(d => d.id);
    setSelectedModifierIds(defaultIds);
    setQuantity(1);
    setRemovedDefaultIds([]);
    setExtraModifierIds([]);
    setLightModifierIds([]);
    setModifierGroups(modifiersByItemId[activeItem.id] ?? []);
    setNote("");
  }, [activeItem]);

  function handleToggle(id: string) {
    const isDefault = activeItem
      ? (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data => data.id).includes(id)
      : false;
    const isCurrentlySelected = selectedModifierIds.includes(id);

    if (isCurrentlySelected) {
      setSelectedModifierIds(prev => prev.filter(x => x !== id));
      if (isDefault) setRemovedDefaultIds(prev => [...prev, id]);
      setExtraModifierIds(prev => prev.filter(x => x !== id));
      setLightModifierIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedModifierIds(prev => [...prev, id]);
      if (isDefault) setRemovedDefaultIds(prev => prev.filter(x => x !== id));
    }
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

  function handleAddToCart() {
    if (!activeItem) return;

    const cartModifiers = selectedModifiers.map((mod) => {
      const replacement = replacements.find(r => r.addedId === mod.id);
      const removedMod = replacement ? allModifiers.find(m => m.id === replacement.removedId) : null;
      return {
        id: mod.id,
        name: mod.name,
        price: mod.price ?? 0,
        isDefault: defaultIds.includes(mod.id),
        isExtra: extraModifierIds.includes(mod.id),
        isLight: lightModifierIds.includes(mod.id),
        isReplacement: !!replacement,
        replacedName: removedMod?.name,
      };
    });

    const combinedNote = [...printableModifiers, note ? `\x1F${note}` : ''].filter(Boolean).join('\n');

    if (editCartItemId) {
      updateItem(editCartItemId, {
        itemId: activeItem.id,
        name: activeItem.name,
        basePrice: activeItem.price,
        modifiers: cartModifiers,
        removedModifiers: removedDefaultModifiers
          .filter(mod => !replacements.find(r => r.removedId == mod.id))
          .map(mod => ({ id: mod.id, name: mod.name })),
        quantity,
        totalPrice: Math.round(totalPrice * 100),
        itemPath,
        note: combinedNote || undefined,
      });
      openCart();
    } else {
      addItem({
        itemId: activeItem.id,
        name: activeItem.name,
        basePrice: activeItem.price,
        modifiers: cartModifiers,
        removedModifiers: removedDefaultModifiers
          .filter(mod => !replacements.find(r => r.removedId == mod.id))
          .map(mod => ({ id: mod.id, name: mod.name })),
        quantity,
        totalPrice: Math.round(totalPrice * 100),
        itemPath,
        note: combinedNote || undefined,
      });
      openCart();
    }

    router.push("/#menu");
  }

  useEffect(() => {
    if (!editCartItemId) return;
    const entry = items.find(i => i.cartItemId === editCartItemId);
    if (!entry) return;
    const variation = variations.find(v => v.id === entry.itemId);
    if (!variation) return;

    isEditInit.current = true;
    setActiveItem(variation);
    setQuantity(entry.quantity);
    setSelectedModifierIds(entry.modifiers.map(m => m.id));
    setExtraModifierIds(entry.modifiers.filter(m => m.isExtra).map(m => m.id));
    setLightModifierIds(entry.modifiers.filter(m => m.isLight).map(m => m.id));

    const defaultIds = (DEFAULT_INGREDIENTS[variation.id] ?? []).map(d => d.id);
    const selectedIds = entry.modifiers.map(m => m.id);
    setRemovedDefaultIds(defaultIds.filter(id => !selectedIds.includes(id)));
    setModifierGroups(modifiersByItemId[variation.id] ?? []);
    const specialInstructions = entry.note?.split('\n').find(line => line.startsWith('\x1F'));
    setNote(specialInstructions ? specialInstructions.slice(1) : "");
  }, [editCartItemId]);

  const allModifiers = modifierGroups.flatMap(group => group.modifiers?.elements ?? []);
  const selectedModifiers = allModifiers.filter(mod => selectedModifierIds.includes(mod.id));
  const defaultIds = activeItem ? (DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data => data.id) : [];
  const removedDefaultModifiers = allModifiers.filter(mod => removedDefaultIds.includes(mod.id));
  const replacements = modifierGroups.flatMap(group => {
    const groupIds = group.modifiers?.elements?.map(m => m.id) ?? [];
    const removedInGroup = removedDefaultIds.filter(id => groupIds.includes(id));
    const addedInGroup = selectedModifiers.filter(mod =>
      groupIds.includes(mod.id) && (!defaultIds.includes(mod.id) || (defaultIds.includes(mod.id) && extraModifierIds.includes(mod.id)))
    );
    return addedInGroup.slice(0, removedInGroup.length).map((mod, i) => ({
      addedId: mod.id,
      removedId: removedInGroup[i]
    }));
  });

  const printableModifiers = [
    ...selectedModifiers.flatMap((mod) => {
      const replacement = replacements.find(r => r.addedId === mod.id);
      const removedMod = replacement ? allModifiers.find(m => m.id === replacement.removedId) : null;
      const isExtra = extraModifierIds.includes(mod.id);
      const isLight = lightModifierIds.includes(mod.id);
      const isDefault = defaultIds.includes(mod.id);

      if (replacement && isDefault && isExtra) return [`Extra ${mod.name}`];
      if (replacement && isExtra) return [`Extra ${mod.name} instead of ${removedMod?.name}`];
      if (replacement && isLight) return [`Light ${mod.name} instead of ${removedMod?.name}`];
      if (replacement) return [`${mod.name} instead of ${removedMod?.name}`];
      if (isLight) return [`Light ${mod.name}`];
      if (isExtra) return [`Extra ${mod.name}`];
      if (!isDefault) return [`Add ${mod.name}`];
      return [];
    }),
    ...removedDefaultModifiers
      .filter(mod => !replacements.find(r => r.removedId === mod.id))
      .map(mod => `No ${mod.name}`)
  ];

  const replacementIds = replacements.map(r => r.addedId);
  const totalPrice = (((activeItem?.price ?? 0) + selectedModifiers.reduce((sum, mod) => {
    const isExtra = extraModifierIds.includes(mod.id);
    const isDefaultMod = defaultIds.includes(mod.id);
    const isReplacement = replacementIds.includes(mod.id);
    if (isReplacement && isDefaultMod && isExtra) return sum;
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
        {!activeItem ? (
          <>
            <ModifierGroupSkeleton />
            <ModifierGroupSkeleton />
          </>
        ) : modifierGroups.map((group) => (
          <ModifierGroup
            key={group.id}
            group={group}
            selectedIds={selectedModifierIds}
            defaultIds={(DEFAULT_INGREDIENTS[activeItem.id] ?? []).map(data => data.id)}
            onToggle={handleToggle}
            onExtra={handleExtra}
            extraIds={extraModifierIds}
            onLight={handleLight}
            lightIds={lightModifierIds}
          />
        ))}
      </div>

      {/* SUB SIDEBAR */}
      <div className="sticky lg:order-1 w-full lg:w-110 bg-gray-100 p-6 rounded-[2rem] h-fit shadow-md top-32 shrink-0">
        <h2 className="text-center text-2xl font-bold mb-6">Your Sub</h2>

        <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
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

          {selectedModifiers.length > 0 || removedDefaultModifiers.length > 0 ? (
            <ul className="space-y-1">
             {selectedModifiers.map(mod => {
                const replacement = replacements.find(r => r.addedId === mod.id);
                const removedMod = replacement ? allModifiers.find(m => m.id === replacement.removedId) : null;
                return (
                  <ModifierLineItem
                    key={mod.id}
                    name={mod.name}
                    price={mod.price}
                    isDefault={defaultIds.includes(mod.id)}
                    isExtra={extraModifierIds.includes(mod.id)}
                    isLight={lightModifierIds.includes(mod.id)}
                    replacement={removedMod ? { removedName: removedMod.name } : null}
                  />
                );
              })}
              {removedDefaultModifiers.filter(mod => !replacements.find(r => r.removedId === mod.id)).length > 0 && (
                <li className="border-t border-gray-200 my-1" />
              )}
              {removedDefaultModifiers
                .filter(mod => !replacements.find(r => r.removedId === mod.id))
                .map(mod => (
                  <li key={`removed-${mod.id}`} className="flex justify-between text-sm text-red-400">
                    <span>No {mod.name}</span>
                  </li>
                ))
              }
            </ul>
          ) : (
            <p className="text-sm text-gray-400 text-center">No toppings selected</p>
          )}
        </div>

        {activeItem && (
          <SpecialInstructionsInput value={note} onChange={setNote} />
        )}

        <div className="flex justify-between items-center px-1 mb-4">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="text-xl font-bold">{activeItem ? `$${totalPrice.toFixed(2)}` : "--.--"}</span>
        </div>

        {activeItem && (
         <QuantitySelector quantity={quantity} max={MAX_QUANTITY} onChange={setQuantity} />
        )}

        <button
          onClick={handleAddToCart}
          disabled={!activeItem}
          className="w-full bg-black cursor-pointer text-white py-4 rounded-full font-bold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {activeItem ? (editCartItemId ? 'Update Cart' : 'Add to Cart') : 'Select a Size'}
        </button>
      </div>
    </div>
  );
}
