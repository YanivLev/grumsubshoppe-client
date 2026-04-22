'use server'

import { ICartItem } from '@/app/store/cart.store';
import { post } from '@/app/common/util/server-requests';

export async function createOrder(items: ICartItem[]) {
    const lineItems = items.map((item) => ({
        itemId: item.itemId,
        unitQty: item.quantity,
        modifiers: [
            ...item.modifiers
                .filter(mod => !mod.isDefault || mod.isExtra || mod.isLight)
                .map((mod) => {
                    let name = mod.name;
                    if (mod.isExtra) name = `Extra ${mod.name}`;
                    else if (mod.isLight) name = `Light ${mod.name}`;
                    else if (mod.isReplacement && mod.replacedName) name = `${mod.name} instead of ${mod.replacedName}`;
                    else if (!mod.isDefault) name = `Add ${mod.name}`;
                    return { id: mod.id, name, amount: mod.price };
                }),
            ...(item.removedModifiers ?? []).map(mod => ({
                id: mod.id,
                name: `No ${mod.name}`,
                amount: 0,
            })),
        ],
        note: item.note?.split('\n').find(line => line.startsWith('\x1F'))?.slice(1) ?? undefined,
    }));

    return post('clover/orders', {lineItems});
}