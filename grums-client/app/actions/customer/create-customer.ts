'use server'

import {ICustomer} from '@/app/common/interfaces/customer.interface'
import {post} from '@/app/common/util/server-requests'

export async function createCustomer(customerData: ICustomer) {
    return post('clover/customers', customerData);
}