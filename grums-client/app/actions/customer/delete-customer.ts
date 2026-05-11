'use server'

import {del} from '@/app/common/util/server-requests'

export async function deleteCustomer(customerId: string) {
    return del(`clover/customers/${customerId}`);
}