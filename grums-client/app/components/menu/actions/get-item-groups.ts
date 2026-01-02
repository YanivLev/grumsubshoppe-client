"use server";

import {get} from "@/app/common/util/fetch";

export default async function getItemGroups(){
    try {
      const data = await get('clover/inventory/item-groups');
      console.log("Item Groups API Result:", data, data.length); 
      return data; 
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  }
  