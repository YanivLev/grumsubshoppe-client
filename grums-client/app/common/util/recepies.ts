
export const DEFAULT_INGREDIENTS: Record<string, { id: string, name: string }[]>= {
  // Example: Replace 'ITEM_ID_6_INCH' with the actual 6-inch sub item ID from Clover
  // 'ITEM_ID_6_INCH': ['MOD_ID_lettuce', 'MOD_ID_tomato', 'MOD_ID_onion', ...],

  //Grum: Whole-Half Respectively
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
    ],
    'T98943D2X9D74' : [
        {id: 'VBAF50C9X4KTG', name: 'Oil'},
        {id: 'E2HE0QC98GJ38', name: 'Lettuce'},
        {id: 'P38XX0XYGCEH8', name: 'Onions'},
        {id: 'FDZPQEHDPES9M', name: 'Tomatoes'},
        {id: 'SKV6F3W1W95ET', name: 'Banana Peppers'},
        {id: '9NNFAN1H34E5G', name: 'Pepperoni'},
        {id: 'QKMWG3GJ9PG04', name: 'Ham'},
        {id: '5HJHPA1TZEWJW', name: 'Salami'},
        {id: 'MNYPV12X00MBR', name: 'Provolone'}
    ],

    
};

// Optional: Map of "removal" modifiers (e.g., "No Lettuce", "No Tomato")
// This helps identify which modifiers remove ingredients vs add them
export const REMOVAL_MAP: Record<string, string> = {
  // Example: 'MOD_ID_no_lettuce': 'MOD_ID_lettuce',
};
