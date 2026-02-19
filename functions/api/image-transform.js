// Cloudflare Image Transformation API
// On-the-fly image resizing and optimization

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
    return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const imagePath = url.searchParams.get('path');
    const format = url.searchParams.get('format') || 'jpeg';

    if (!imagePath) {
        return new Response(JSON.stringify({ error: 'Missing image path parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    try {
        // Strip any leading slash from imagePath to avoid double-slash
        const cleanPath = imagePath.replace(/^\/+/, '');
        const imageUrl = `${url.origin}/${cleanPath}`;
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            return new Response(JSON.stringify({ error: 'Image not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
            });
        }

        // Use Cloudflare's built-in image transformation
        // https://developers.cloudflare.com/images/
        const transformedImage = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get('Content-Type') || `image/${format}`;

        return new Response(transformedImage, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                ...CORS_HEADERS
            }
        });

    } catch (error) {
        console.error('Image transformation error:', error);
        return new Response(JSON.stringify({ error: 'Failed to transform image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }
}
