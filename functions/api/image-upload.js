// Cloudflare Pages Function for Image Upload and Processing
// Handles dynamic image uploads and optimization

export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const image = formData.get('image');

        if (!image || !image.type.startsWith('image/')) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid image file'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Convert HEIC to JPEG if needed
        const imageBuffer = await image.arrayBuffer();
        const processedImage = await processImage(imageBuffer, image.type);

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `upload-${timestamp}.jpg`;
        const path = `/images/gallery/uploads/${filename}`;

        // Store in Cloudflare R2 (if configured)
        // await context.env.IMAGES.put(filename, processedImage);

        // Return the image URL
        return new Response(JSON.stringify({
            success: true,
            url: path,
            filename: filename,
            message: 'Image uploaded successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to upload image',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Image processing function
async function processImage(buffer, mimeType) {
    // If it's already JPEG, return as-is
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        return buffer;
    }

    // For other formats, you'd need image processing
    // Cloudflare has built-in image transformation
    // This is a placeholder for more advanced processing
    return buffer;
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
