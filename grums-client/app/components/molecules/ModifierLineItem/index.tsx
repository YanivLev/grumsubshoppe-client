'use client'

interface ModifierLineItemProps {
    name: string;
    price: number;
    isDefault: boolean;
    isExtra: boolean;
    isLight: boolean;
    replacement?: { removedName: string } | null;
  }

  export default function ModifierLineItem({
    name,
    price,
    isDefault,
    isExtra,
    isLight,
    replacement,
  }: ModifierLineItemProps) {
    const label = replacement && isDefault && isExtra
      ? `Extra ${name}`
      : replacement && isExtra
      ? `Extra ${name} instead of ${replacement.removedName}`
      : replacement && isLight
      ? `Light ${name} instead of ${replacement.removedName}`
      : replacement
      ? `${name} instead of ${replacement.removedName}`
      : isLight ? `Light ${name}`
      : isExtra ? `Extra ${name}`
      : !isDefault ? `Add ${name}`
      : name;
  
    const priceLabel = replacement && isDefault && isExtra
      ? "Included"
      : replacement && isExtra
      ? `+$${(price / 100).toFixed(2)}`
      : replacement
      ? ""
      : isExtra
        ? isDefault
          ? `+$${(price / 100).toFixed(2)}`
          : `+$${((price / 100) * 2).toFixed(2)}`
      : isDefault
      ? "Included"
      : price > 0
      ? `+$${(price / 100).toFixed(2)}`
      : "$0.00";
  
    return (
      <li className="flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>{priceLabel}</span>
      </li>
    );
  }