// Default ingredients for each sub size
// TODO: Replace these mock IDs with real Clover modifier IDs from the admin panel

export const DEFAULT_INGREDIENTS: Record<string, string[]> = {
  // Example: Replace 'ITEM_ID_6_INCH' with the actual 6-inch sub item ID from Clover
  // 'ITEM_ID_6_INCH': ['MOD_ID_lettuce', 'MOD_ID_tomato', 'MOD_ID_onion', ...],
    'CTR2D623ZF7PT' : ['A8J7FH65AA20P']
  // Placeholder structure - update with your actual item IDs and modifier IDs
  // You can get these from the console.log in get-modifiers.ts when you select a size

};

// Optional: Map of "removal" modifiers (e.g., "No Lettuce", "No Tomato")
// This helps identify which modifiers remove ingredients vs add them
export const REMOVAL_MAP: Record<string, string> = {
  // Example: 'MOD_ID_no_lettuce': 'MOD_ID_lettuce',
};
