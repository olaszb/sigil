
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Assuming the backend serves images from a specific base URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    return `${baseUrl}/storage/${imagePath}`;
}