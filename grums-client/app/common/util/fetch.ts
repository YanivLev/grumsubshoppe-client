import { cookies } from "next/headers";
import { API_URL } from "../constants/api";
import { getErrorMessage } from "../util/errors";

const getHeaders = async () => {
    const cookieStore = await cookies(); // Await the promise
    return {
        Cookie: cookieStore.toString(),
    };
};

// export const post = async (path: string, body: any) => {
//     const res = await fetch(`${API_URL}/${path}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             ...getHeaders(),
//         },
//         body: JSON.stringify(Object.fromEntries(body)),
//     });
//     const parsedRes = await res.json()
//     if (!res.ok) {
//         return { error: getErrorMessage(parsedRes)};
//     }
//     return {error: ""};
// };

export const get = async (path: string) => {
    const headers = await getHeaders();
    const BASE_URL = process.env.API_URL; // Your NestJS URL
    const fullUrl = `${BASE_URL}/${path.replace(/^\//, '')}`;
    const res = await fetch(fullUrl, { headers });
    if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
    }

    // CHANGE THIS: You must await the call to .json()
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