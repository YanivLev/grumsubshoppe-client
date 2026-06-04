"use server"

import { get } from "@/app/common/util/server-requests";
import { IItem } from "@/app/common/interfaces/item.interface";

export default async function getItemsByCategory(categoryId: string) : Promise<IItem[]> {
    try {
        const data = await get(`clover/inventory/categories/${categoryId}`);
        return data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}