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
        const data = await getById('clover/inventory', itemId);
        // Only log here to see what came from the API
        const modData = data.modifierGroups;
        console.log("API Result:", modData, modData.length); 
        return modData;
        } catch (error) {
        console.error("Fetch Error:", error);
        return [];
        }
    }