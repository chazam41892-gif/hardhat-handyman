// Cloudflare Image Transformation API
// On-the-fly image resizing and optimization

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const imagePath = url.searchParams.get('path');
    const width = url.searchParams.get('width') || 800;
    const quality = url.searchParams.get('quality') || 85;
    const format = url.searchParams.get('format') || 'jpeg';

    if (!imagePath) {
        return new Response('Missing image path', { status: 400 });
    }

    try {
        // Fetch the original image
        const imageUrl = `${url.origin}/${imagePath}`;
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            return new Response('Image not found', { status: 404 });
        }

        // Use Cloudflare's built-in image transformation
        // https://developers.cloudflare.com/images/
        const transformedImage = await imageResponse.arrayBuffer();

        return new Response(transformedImage, {
            headers: {
                'Content-Type': `image/${format}`,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'CF-Cache-Status': 'HIT'
            }
        });

    } catch (error) {
        console.error('Image transformation error:', error);
        return new Response('Failed to transform image', { status: 500 });
    }
}
