'use server'

import { post } from '@/app/common/util/server-requests';
import { ISendEmail } from "@/app/common/interfaces/send-email.interface";


export async function sendEmail(email : ISendEmail) {
    return post('email/send', email);
}