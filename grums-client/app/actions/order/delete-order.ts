import {del} from '@/app/common/util/server-requests'

export async function deleteOrder(orderId: string) {
    return del(`clover/orders${orderId}`);
}