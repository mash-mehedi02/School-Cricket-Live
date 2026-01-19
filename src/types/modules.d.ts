declare module '*.jsx' {
    const content: any;
    export default content;
}

declare module '@/components/live/BallTimeline' {
    const content: any;
    export default content;
}

declare module '@/components/live/ProjectedScoreTable' {
    const content: any;
    export default content;
}

declare module '@/components/live/CrexLiveSection' {
    const content: any;
    export default content;
}

declare module '@/services/cloudinary/uploader' {
    export const uploadImage: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
}
