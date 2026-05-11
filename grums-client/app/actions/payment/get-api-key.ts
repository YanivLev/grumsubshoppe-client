'use server'

import { get } from '@/app/common/util/server-requests';

export async function getApiKey() {
    return get('clover/payment/pay-api-key');
  }