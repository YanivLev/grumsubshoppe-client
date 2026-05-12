'use client';

import { IItem } from '@/app/common/interfaces/item.interface';
import { IModifier } from '@/app/common/interfaces/modifier.interface';
import ModifierLineItem from '@/app/components/molecules/ModifierLineItem';
import SpecialInstructionsInput from '@/app/components/molecules/SpecialInstructions';
import QuantitySelector from '@/app/components/molecules/QuantitySelector';

interface Replacement { addedId: string; removedId: string; }

interface SubSidebarProps {
  activeItem: IItem | null;
  quantity: number;
  totalPrice: number;
  note: string;
  selectedModifiers: IModifier[];
  removedDefaultModifiers: IModifier[];
  allModifiers: IModifier[];
  replacements: Replacement[];
  defaultIds: string[];
  extraModifierIds: string[];
  lightModifierIds: string[];
  editCartItemId?: string;
  onNoteChange: (value: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

const MAX_QUANTITY = 10;

export default function SubSidebar({
  activeItem, quantity, totalPrice, note, selectedModifiers,
  removedDefaultModifiers, allModifiers, replacements, defaultIds,
  extraModifierIds, lightModifierIds, editCartItemId,
  onNoteChange, onQuantityChange, onAddToCart,
}: SubSidebarProps) {
  return (
    <div className="sticky lg:order-1 w-full lg:w-110 bg-gray-100 p-6 rounded-[2rem] h-fit shadow-md top-32 shrink-0">
      <h2 className="text-center text-2xl font-bold mb-6">Your Sub</h2>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {quantity > 1 && <span className="text-md font-semibold">{quantity}x</span>}
            <span className="text-lg font-semibold">{activeItem?.name ?? 'No size selected'}</span>
          </div>
          <span className="text-lg font-bold">
            {activeItem ? `$${(activeItem.price / 100).toFixed(2)}` : ''}
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
              ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 text-center">No toppings selected</p>
        )}
      </div>

      {activeItem && <SpecialInstructionsInput value={note} onChange={onNoteChange} />}

      <div className="flex justify-between items-center px-1 mb-4">
        <span className="font-semibold text-gray-700">Total</span>
        <span className="text-xl font-bold">{activeItem ? `$${totalPrice.toFixed(2)}` : '--.--'}</span>
      </div>

      {activeItem && <QuantitySelector quantity={quantity} max={MAX_QUANTITY} onChange={onQuantityChange} />}

      <button
        onClick={onAddToCart}
        disabled={!activeItem}
        className="w-full bg-black cursor-pointer text-white py-4 rounded-full font-bold disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
      >
        {activeItem ? (editCartItemId ? 'Update Cart' : 'Add to Cart') : 'Select a Size'}
      </button>
    </div>
  );
}