'use client';

import { useState, useEffect, useRef } from 'react';
import { IItem } from "@/app/common/interfaces/item.interface";
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import ModifierGroup from "@/app/components/organisms/ModifierGroup";
import { DEFAULT_INGREDIENTS } from '@/app/common/util/recepies';
import { useCartStore } from '@/app/store/cart.store';
import ModifierGroupSkeleton from '@/app/components/molecules/ModifierGroupSkeleton';
import { useRouter } from 'next/navigation';
import SubSidebar from '../SubSidebar';

export default function SubCustomizer({ item, modifierGroups, itemPath, editCartItemId }: {
  item: IItem,
  modifierGroups: IModifierGroup[],
  itemPath: string,
  editCartItemId?: string
}) {
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [removedDefaultIds, setRemovedDefaultIds] = useState<string[]>([]);
  const [extraModifierIds, setExtraModifierIds] = useState<string[]>([]);
  const [lightModifierIds, setLightModifierIds] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");

  const MAX_QUANTITY = 100;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);
  const updateItem = useCartStore((state) => state.updateItem);
  const router = useRouter();
  const isEditInit = useRef(false);

  useEffect(() => {
    const defaultIds = (DEFAULT_INGREDIENTS[item.id] ?? []).map(d => d.id);
    setSelectedModifierIds(defaultIds);
  }, [item.id]);

  useEffect(() => {
    if (!editCartItemId) return;
    const entry = items.find(i => i.cartItemId === editCartItemId);
    if (!entry) return;

    isEditInit.current = true;
    setQuantity(entry.quantity);
    setSelectedModifierIds(entry.modifiers.map(m => m.id));
    setExtraModifierIds(entry.modifiers.filter(m => m.isExtra).map(m => m.id));
    setLightModifierIds(entry.modifiers.filter(m => m.isLight).map(m => m.id));

    const defaultIds = (DEFAULT_INGREDIENTS[item.id] ?? []).map(d => d.id);
    setRemovedDefaultIds(defaultIds.filter(id => !entry.modifiers.map(m => m.id).includes(id)));
    const specialInstructions = entry.note?.split('\n').find(line => line.startsWith('\x1F'));
    setNote(specialInstructions ? specialInstructions.slice(1) : "");
  }, [editCartItemId]);

  function handleToggle(id: string) {
    const isDefault = (DEFAULT_INGREDIENTS[item.id] ?? []).map(d => d.id).includes(id);
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

  const allModifiers = modifierGroups.flatMap(group => group.modifiers?.elements ?? []);
  const selectedModifiers = allModifiers.filter(mod => selectedModifierIds.includes(mod.id));
  const defaultIds = (DEFAULT_INGREDIENTS[item.id] ?? []).map(d => d.id);
  const removedDefaultModifiers = allModifiers.filter(mod => removedDefaultIds.includes(mod.id));
  const replacements = modifierGroups.flatMap(group => {
    const groupIds = group.modifiers?.elements?.map(m => m.id) ?? [];
    const removedInGroup = removedDefaultIds.filter(id => groupIds.includes(id));
    const addedInGroup = selectedModifiers.filter(mod =>
      groupIds.includes(mod.id) && (!defaultIds.includes(mod.id) || extraModifierIds.includes(mod.id))
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
  const totalPrice = (((item.price ?? 0) + selectedModifiers.reduce((sum, mod) => {
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

  function handleAddToCart() {
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
        itemId: item.id,
        name: item.name,
        basePrice: item.price,
        modifiers: cartModifiers,
        removedModifiers: removedDefaultModifiers
          .filter(mod => !replacements.find(r => r.removedId === mod.id))
          .map(mod => ({ id: mod.id, name: mod.name })),
        quantity,
        totalPrice: Math.round(totalPrice * 100),
        itemPath,
        note: combinedNote || undefined,
      });
    } else {
      addItem({
        itemId: item.id,
        name: item.name,
        basePrice: item.price,
        modifiers: cartModifiers,
        removedModifiers: removedDefaultModifiers
          .filter(mod => !replacements.find(r => r.removedId === mod.id))
          .map(mod => ({ id: mod.id, name: mod.name })),
        quantity,
        totalPrice: Math.round(totalPrice * 100),
        itemPath,
        note: combinedNote || undefined,
      });
    }

    openCart();
    router.push("/#menu");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-20 lg:gap-50">
      <div className="lg:order-2 flex-grow min-w-0">
        {modifierGroups.length === 0 ? (
          <>
            <ModifierGroupSkeleton />
            <ModifierGroupSkeleton />
          </>
        ) : modifierGroups.map((group) => (
          <ModifierGroup
            key={group.id}
            group={group}
            selectedIds={selectedModifierIds}
            defaultIds={defaultIds}
            onToggle={handleToggle}
            onExtra={handleExtra}
            extraIds={extraModifierIds}
            onLight={handleLight}
            lightIds={lightModifierIds}
          />
        ))}
      </div>

      <SubSidebar
        activeItem={item}
        quantity={quantity}
        totalPrice={totalPrice}
        note={note}
        selectedModifiers={selectedModifiers}
        removedDefaultModifiers={removedDefaultModifiers}
        allModifiers={allModifiers}
        replacements={replacements}
        defaultIds={defaultIds}
        extraModifierIds={extraModifierIds}
        lightModifierIds={lightModifierIds}
        editCartItemId={editCartItemId}
        onNoteChange={setNote}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
