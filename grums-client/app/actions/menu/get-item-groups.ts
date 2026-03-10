"use server";

import {get} from "@/app/common/util/fetch";
import {cache} from "react";

export default cache(async function getItemGroups(){
    try {
      const data = await get('clover/inventory/item-groups');
      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  });
