import { IItem } from "./item.interface";

export interface ICategory {
    id: string;
    name: string;
    items: {
        elements: IItem[];
    }
}
