export interface Bindings {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLIENT_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}

export interface Variables {
    userId: number;
}

export type AppEnv = { Bindings: Bindings; Variables: Variables };
