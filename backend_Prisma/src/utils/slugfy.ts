import slugify from 'slugify';

/**
 * Genera un slug único para un trabajo.
 * @param name - El nombre del trabajo.
 * @returns Un slug formateado y único.
 */
export function generateJobSlug(name: string): string {
    const randomSuffix = (Math.random() * Math.pow(36, 10) | 0).toString(36);
    // Utilizar el paquete slugify
    return slugify(name, { lower: true }) + '-' + randomSuffix; // Convierte a minúsculas
}
