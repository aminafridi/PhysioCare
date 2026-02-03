import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'images/about/doctor.jpg')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns The download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string, onProgress?: (progress: number) => void): Promise<string | null> {
    try {
        const storageRef = ref(storage, path);

        // Create a promise that rejects after 60 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Upload timed out')), 60000);
        });

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Monitor progress
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
        });

        // Race between upload and timeout
        await Promise.race([uploadTask, timeoutPromise]);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: any) {
        console.error('Error uploading image:', error);

        // Safely log storage bucket if possible to debug
        try {
            console.error('Storage Bucket:', (storage.app.options as any).storageBucket);
        } catch (e) {
            // ignore
        }

        if (error.code === 'storage/unauthorized') {
            console.error('User does not have permission to access the object');
            throw new Error('Permission denied. Please check Firebase Storage Rules.');
        } else if (error.code === 'storage/canceled') {
            console.error('User canceled the upload');
            throw new Error('Upload canceled.');
        } else if (error.code === 'storage/unknown') {
            console.error('Unknown error occurred, inspect the server response');
            throw new Error('Unknown server error. Please try again.');
        } else if (error.message === 'Upload timed out') {
            throw new Error('Upload timed out. Internet connection might be too slow.');
        }

        // Throw the raw error if it's something else (like CORS)
        throw error;
    }
}

/**
 * Delete an image from Firebase Storage
 * @param path - The storage path of the image to delete
 */
export async function deleteImage(path: string): Promise<boolean> {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

/**
 * Upload a doctor's profile image
 * @param file - The image file
 * @param onProgress - Optional progress callback
 * @returns The download URL
 */
export async function uploadDoctorImage(file: File, onProgress?: (progress: number) => void): Promise<string | null> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const path = `images/doctor/profile-${timestamp}.${extension}`;
    return uploadImage(file, path, onProgress);
}

/**
 * Upload a service image
 * @param file - The image file
 * @param serviceId - The service ID
 * @param onProgress - Optional progress callback
 * @returns The download URL
 */
export async function uploadServiceImage(file: File, serviceId: string, onProgress?: (progress: number) => void): Promise<string | null> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const path = `images/services/${serviceId}-${timestamp}.${extension}`;
    return uploadImage(file, path, onProgress);
}

/**
 * Upload a blog post image
 * @param file - The image file
 * @param postId - The blog post ID
 * @param onProgress - Optional progress callback
 * @returns The download URL
 */
export async function uploadBlogImage(file: File, postId: string, onProgress?: (progress: number) => void): Promise<string | null> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const path = `images/blog/${postId}-${timestamp}.${extension}`;
    return uploadImage(file, path, onProgress);
}

/**
 * Upload a testimonial avatar
 * @param file - The image file
 * @param testimonialId - The testimonial ID
 * @param onProgress - Optional progress callback
 * @returns The download URL
 */
export async function uploadTestimonialImage(file: File, testimonialId: string, onProgress?: (progress: number) => void): Promise<string | null> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const path = `images/testimonials/${testimonialId}-${timestamp}.${extension}`;
    return uploadImage(file, path, onProgress);
}
