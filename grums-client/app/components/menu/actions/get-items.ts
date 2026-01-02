"use server";

import {get} from "@/app/common/util/fetch";

export default async function getItems() {
    try {
      const data = await get('clover/inventory');
      // Only log here to see what came from the API
      console.log("API Result:", data, data.length); 
      return data; 
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  }


