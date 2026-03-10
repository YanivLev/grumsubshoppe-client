"use server";

import {get} from "@/app/common/util/fetch";
import {cache} from "react";

export default cache(async function getItems() {
    try {
      const data = await get('clover/inventory');
      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  });
