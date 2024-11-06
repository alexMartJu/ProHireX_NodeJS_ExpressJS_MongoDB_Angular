// src/utils/slugGenerator.ts
import slugify from 'slugify';

export const generateSlug = (): string => {
    return slugify('application') + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};