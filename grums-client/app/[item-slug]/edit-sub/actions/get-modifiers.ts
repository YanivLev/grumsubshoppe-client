"use server"

import {get, getById} from "@/app/common/util/fetch";

// export async function getModifierGroups(itemId: string) {
//     const response = await fetch(`http://localhost:3000/clover/inventory/${itemId}`);
//     if (!response.ok) throw new Error("Failed to fetch item data");
//     const modData = response.modifierGroups;

//     return response.json(); 
//   }

    export default async function getModifiers(itemId: string) {
        try {
        const data = await getById(`clover/inventory/${itemId}`, itemId);
        console.log("API Result (full):", data);
        const modData = data.modifierGroups?.elements;
        return modData ?? [];
        } catch (error) {
        console.error("Fetch Error:", error);
        return [];
        }
    }