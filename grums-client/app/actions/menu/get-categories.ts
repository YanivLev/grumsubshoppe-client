"use server"

import {get} from "@/app/common/util/server-requests";
import {cache} from "react";

export default cache(async function getCategories(){
    try {
      const data = await get('clover/inventory/categories');
      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  });
