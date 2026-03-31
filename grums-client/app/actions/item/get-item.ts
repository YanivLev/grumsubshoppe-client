"use server"

import {getById} from "@/app/common/util/server-requests";

export default async function getItemById(itemId: string) {
    try {
    const data = await getById(`clover/inventory/${itemId}`, itemId);
    return data;
    } catch (error) {
    console.error("Fetch Error:", error);
    return [];
    }
}
