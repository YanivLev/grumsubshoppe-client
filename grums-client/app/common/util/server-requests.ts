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
        throw new Error(`Error: ${res.status}`);
    }
    return res.json();
};

export const get = async (path: string) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL; // Your NestJS URL
    const fullUrl = `${BASE_URL}/${path.replace(/^\//, '')}`;
    const res = await fetch(fullUrl, { headers });
    if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
    }
    
    const data = await res.json(); 
    return data;
};

export const getById = async (path: string, id: string) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL;
    const res = await fetch(`${BASE_URL}/${path.replace(/^\//, '')}`, { headers });
    if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
};