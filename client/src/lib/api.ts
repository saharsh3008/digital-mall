export const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    // 1. Remove trailing slash
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // 2. Ensure it ends with /api/v1 (Common configuration mistake fix)
    if (!url.includes('/api/v1')) {
        url = `${url}/api/v1`;
    }

    return url;
};

export const API_URL = getBaseUrl();

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}
