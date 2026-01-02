import {Item} from "./item.interface";

export interface ItemGroup {
    id: string;
    name: string;
    items: Item[]
}