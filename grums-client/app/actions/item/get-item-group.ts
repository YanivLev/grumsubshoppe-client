"use server"

import { IItemGroup } from "@/app/common/interfaces/item-group.interface";
import {getById} from "@/app/common/util/server-requests";

export default async function getItemGroupById(itemGroupId: string) : Promise<IItemGroup> {
    try {
    const data = await getById(`clover/inventory/item-groups/${itemGroupId}`, itemGroupId);
    return data;
    } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
    }
}
