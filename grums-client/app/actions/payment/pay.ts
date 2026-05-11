'use server'

import { post } from '@/app/common/util/server-requests';
import { IPayParams } from "@/app/common/interfaces/pay.interface";


export async function pay(payParams : IPayParams) {
    return post('clover/payment', payParams);
}