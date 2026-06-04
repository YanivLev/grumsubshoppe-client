"use server"

import { IItem } from "@/app/common/interfaces/item.interface";
import {getById} from "@/app/common/util/server-requests";

export default async function getItemById(itemId: string) : Promise<IItem> {
    try {
    const data = await getById(`clover/inventory/${itemId}`, itemId);
    return data;
    } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
    }
}
