import { IItem } from "./item.interface";

export interface IItemGroup {
    id: string;
    name: string;
    items: {
        elements: IItem[];
    }
}
