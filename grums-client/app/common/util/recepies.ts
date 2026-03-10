// Default ingredients for each sub size
// TODO: Replace these mock IDs with real Clover modifier IDs from the admin panel

export const DEFAULT_INGREDIENTS: Record<string, { id: string, name: string }[]>= {
  // Example: Replace 'ITEM_ID_6_INCH' with the actual 6-inch sub item ID from Clover
  // 'ITEM_ID_6_INCH': ['MOD_ID_lettuce', 'MOD_ID_tomato', 'MOD_ID_onion', ...],
    'CTR2D623ZF7PT' : [
      {id: 'VBAF50C9X4KTG', name: 'Oil'},
      {id: '1Y4M6MQ7H8VZM', name: 'Lettuce'},
      {id: 'NRZMZW32TN49E', name: 'Onions'},
      {id: '1MZHRHTCM558T', name: 'Tomatoes'},
      {id: 'Z40R8879BRDBW', name: 'Banana Peppers'},
      {id: 'CYQDJFAT60JR0', name: 'Pepperoni'},
      {id: 'CHP2SB0AVY1GC', name: 'Ham'},
      {id: '1D870SYRHRJST', name: 'Salami'},
      {id: 'PXG435YNJQ604', name: 'Provolone'}
    ]
  // Placeholder structure - update with your actual item IDs and modifier IDs
  // You can get these from the console.log in get-modifiers.ts when you select a size

};

// Optional: Map of "removal" modifiers (e.g., "No Lettuce", "No Tomato")
// This helps identify which modifiers remove ingredients vs add them
export const REMOVAL_MAP: Record<string, string> = {
  // Example: 'MOD_ID_no_lettuce': 'MOD_ID_lettuce',
};
