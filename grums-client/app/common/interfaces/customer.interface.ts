import { ICartItem } from '@/app/store/cart.store'

export interface ICustomer {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    marketingAllowed?: boolean;
}
