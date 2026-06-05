import { cookies } from "next/headers";
import { getErrorMessage } from "./errors";
import {cache} from "react";


const getHeaders = async () => {
    const cookieStore = await cookies(); // Await the promise
    return {
        Cookie: cookieStore.toString(),
    };
};

export const post = async (path: string, body: unknown) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL;
    const res = await fetch(`${BASE_URL}/${path.replace(/^\//, '')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const messages: Record<number, string> = {
            402: 'Your card was declined. Please try a different card.',
            409: 'Payment could not be completed. Please check your order and try again.',
            400: 'Invalid request. Please check your details and try again.',
            401: 'Authentication failed. Please refresh and try again.',
            404: 'The requested resource was not found.',
            500: 'Something went wrong on our end. Please try again.',
        };
        throw new Error(messages[res.status] ?? 'Something went wrong. Please try again.');
    }
    return res.json();
};

export const get = async (path: string) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL; // Your NestJS URL
    const fullUrl = `${BASE_URL}/${path.replace(/^\//, '')}`;
    const res = await fetch(fullUrl, { headers });
    if (!res.ok) {
        const messages: Record<number, string> = {
            400: 'Invalid request. Please check your details and try again.',
            401: 'Authentication failed. Please refresh and try again.',
            404: 'The requested resource was not found.',
            500: 'Something went wrong on our end. Please try again.',
        };
        throw new Error(messages[res.status] ?? 'Something went wrong. Please try again.');
    }
    
    const data = await res.json(); 
    return data;
};

export const getById = async (path: string) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL;
    const res = await fetch(`${BASE_URL}/${path.replace(/^\//, '')}`, { headers });
    if (!res.ok) {
        const messages: Record<number, string> = {
            400: 'Invalid request. Please check your details and try again.',
            401: 'Authentication failed. Please refresh and try again.',
            404: 'The requested resource was not found.',
            500: 'Something went wrong on our end. Please try again.',
        };
        throw new Error(messages[res.status] ?? 'Something went wrong. Please try again.');
    }
    const data = await res.json();
    return data;
};

export const del = async (path: string) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL;
    const res = await fetch(`${BASE_URL}/${path.replace(/^\//, '')}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) {
        const messages: Record<number, string> = {
            400: 'Invalid request. Please check your details and try again.',
            401: 'Authentication failed. Please refresh and try again.',
            404: 'The requested resource was not found.',
            500: 'Something went wrong on our end. Please try again.',
        };
        throw new Error(messages[res.status] ?? 'Something went wrong. Please try again.');
    }
};