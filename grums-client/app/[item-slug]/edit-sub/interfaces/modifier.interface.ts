export interface Modifier {
    id: string;
    name: string;
    price: number;
  }
  
  export interface ModifierGroup {
    id: string;
    name: string;
    modifiers: {
      elements: Modifier[];
    };
  }