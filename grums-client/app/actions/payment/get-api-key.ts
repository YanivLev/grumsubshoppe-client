'use server'

import { get } from '@/app/common/util/server-requests';

export async function getApiKey() {
    return get('payments/pay-api-key');
}