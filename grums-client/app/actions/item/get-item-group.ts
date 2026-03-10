"use server"

import {getById} from "@/app/common/util/fetch";

export default async function getItemGroupById(itemGroupId: string) {
    try {
    const data = await getById(`clover/inventory/item-groups/${itemGroupId}`, itemGroupId);
    return data;
    } catch (error) {
    console.error("Fetch Error:", error);
    return [];
    }
}
