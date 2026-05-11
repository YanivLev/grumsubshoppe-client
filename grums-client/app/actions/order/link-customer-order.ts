'use server'

import { post } from '@/app/common/util/server-requests';

export async function linkCustomerToOrder(orderId: string, customerId: string) {
    return post(`clover/orders/${orderId}/customers`, { customerId });
}