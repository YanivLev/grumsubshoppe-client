"use server"

import { get } from "@/app/common/util/server-requests";

export default async function getItemsByCategory(categoryId: string) {
    try {
        const data = await get(`clover/inventory/categories/${categoryId}`);
        return data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}