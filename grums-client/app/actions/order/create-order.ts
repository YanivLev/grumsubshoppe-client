'use server'

import { ICartItem } from '@/app/store/cart.store';
import { post } from '@/app/common/util/server-requests';

export async function createOrder(items: ICartItem[], customerId?: string) {
    const lineItems = items.map((item) => ({
        itemId: item.itemId,
        unitQty: item.quantity,
        note: item.note ?? undefined,
        modifiers: item.modifiers
            .filter(mod => !mod.isDefault || mod.isExtra || mod.isLight)
            .map((mod) => ({
                id: mod.id,
                name: mod.name,
                amount: mod.price,
            })),
    }));

    return post('clover/orders', {
        lineItems,
        ...(customerId && { customers: [{ id: customerId }] }),
    });
}