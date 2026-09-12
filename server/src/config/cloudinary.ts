import { createHash } from 'node:crypto';

export interface CloudinaryEnv {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}

// Cloudinary signs requests by sorting params alphabetically, joining as
// key=value&key=value, appending the api secret, then taking a SHA-1 hex digest.
// Same rule is reused for uploads and for generating signed download URLs.
const sign = (params: Record<string, string | number>, apiSecret: string): string => {
    const toSign = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&');
    return createHash('sha1').update(toSign + apiSecret).digest('hex');
};

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    [key: string]: unknown;
}

export const uploadToCloudinary = async (
    env: CloudinaryEnv,
    file: File,
    opts: {
        folder: string;
        resourceType?: 'image' | 'raw' | 'video' | 'auto';
        publicId?: string;
        transformation?: string;
    }
): Promise<CloudinaryUploadResult> => {
    const resourceType = opts.resourceType ?? 'image';
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign: Record<string, string | number> = {
        folder: opts.folder,
        timestamp,
        type: 'upload',
    };
    if (opts.publicId) paramsToSign.public_id = opts.publicId;
    if (resourceType === 'raw') paramsToSign.access_mode = 'public';
    if (resourceType === 'image' && opts.transformation) paramsToSign.transformation = opts.transformation;

    const signature = sign(paramsToSign, env.CLOUDINARY_API_SECRET);

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', env.CLOUDINARY_API_KEY);
    form.append('signature', signature);
    for (const [key, value] of Object.entries(paramsToSign)) {
        form.append(key, String(value));
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
    }
    return res.json();
};

// Mirrors cloudinary.utils.private_download_url — used as a fallback when a raw
// resource (e.g. an older resume PDF) was uploaded without public access_mode.
export const getPrivateDownloadUrl = (
    env: CloudinaryEnv,
    publicId: string,
    format: string,
    opts: { resourceType?: 'image' | 'raw' | 'video'; expiresAt: number }
): string => {
    const params: Record<string, string | number> = {
        public_id: publicId,
        format,
        timestamp: Math.floor(Date.now() / 1000),
        expires_at: opts.expiresAt,
    };
    const signature = sign(params, env.CLOUDINARY_API_SECRET);
    const resourceType = opts.resourceType ?? 'raw';

    const query = new URLSearchParams({
        ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
        api_key: env.CLOUDINARY_API_KEY,
        signature,
    });
    return `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/download?${query.toString()}`;
};
