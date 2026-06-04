export interface IItem {
    id: string;
    name: string;
    price: number;
    itemGroup?: {
        id: string;
    };
    categories?: {
        elements: { name: string }[];
    };
}
