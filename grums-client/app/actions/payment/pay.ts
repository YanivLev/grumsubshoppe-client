'use server'

import { post } from '@/app/common/util/server-requests';
import { IPayParams } from "@/app/common/interfaces/pay.interface";


export async function pay({ orderId, source, amount, tipAmount }: IPayParams) {
    return post('payments', {orderId, source, amount, tipAmount});
}