export interface IItem {
    id: string;
    name: string;
    price: number;
    categories?: {
        elements: { name: string }[];
    };
}
