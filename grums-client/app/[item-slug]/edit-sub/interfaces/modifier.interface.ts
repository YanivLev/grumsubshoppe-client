

export interface IModifier {
    id: string;
    name: string;
    price: number;
  }

  
export interface IModifierGroup {
  id: string;
  name: string;
  modifiers: {
    elements: IModifier[];
  };
}