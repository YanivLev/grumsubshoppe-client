"use server"

import { getById } from "@/app/common/util/fetch";


    export async function getModifierGroups(itemId: string) {
        try {
        const data = await getById(`clover/inventory/${itemId}`, itemId);
        console.log("API Result (full):", JSON.stringify(data, null, 2));
        const modGData = data.modifierGroups?.elements;
        return modGData ?? [];
        } catch (error) {
        console.error("Fetch Error:", error);
        return [];
        }
    }

    export async function getModifiers(modifierGroupsId: string) {
        try {
            const data = await getById(`clover/inventory/modifier-groups/${modifierGroupsId}`, modifierGroupsId);
            const modData = data.modifiers?.elements;
            return modData ?? [];
        } catch (error) {
            console.error("Fetch Error", error);
            return [];
        }
    }
