export interface Bindings {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLIENT_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    /** Fine-grained token for the repo: Contents read/write (dispatch) and Actions read (status). */
    GITHUB_TOKEN?: string;
    /** owner/name of the repository whose deploy-site workflow the Publish button runs. */
    GITHUB_REPO?: string;
}

export interface Variables {
    userId: number;
}

export type AppEnv = { Bindings: Bindings; Variables: Variables };
