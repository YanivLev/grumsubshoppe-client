"use server"

import { getById } from "@/app/common/util/fetch";
import { cache } from 'react';

const fetchModifierGroups = cache(async (itemId: string) => {
    const data = await getById(`clover/inventory/${itemId}`, itemId);
    return data.modifierGroups?.elements ?? [];
});

const fetchModifiers = cache(async (modifierGroupsId: string) => {
    const data = await getById(`clover/inventory/modifier-groups/${modifierGroupsId}`, modifierGroupsId);
    return data.modifiers?.elements ?? [];
});

export async function getModifierGroups(itemId: string) {
    try {
        return await fetchModifierGroups(itemId);
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

export async function getModifiers(modifierGroupsId: string) {
    try {
        return await fetchModifiers(modifierGroupsId);
    } catch (error) {
        console.error("Fetch Error", error);
        return [];
    }
}
