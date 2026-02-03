import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    addDoc,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface AboutPageData {
    name: string;
    title: string;
    experience: string;
    bio: string;
    qualifications: string[];
    mission: string;
    vision: string;
    imageUrl?: string;
    updatedAt?: Date;
}

export interface ServiceData {
    id?: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    whoIsItFor: string;
    benefits: string[];
    iconName: string;
    slug: string;
    order: number;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BlogPostData {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    readTime: string;
    date: string;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TestimonialData {
    id?: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    createdAt?: Date;
}

export interface SettingsData {
    clinicName: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    workingHours: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
    socialMedia: {
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
    };
    updatedAt?: Date;
}

export interface AppointmentData {
    id?: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt?: Date;
}

export interface AdminUserData {
    id?: string;
    email: string;
    password: string;
    name: string;
    role: 'superadmin' | 'admin' | 'editor';
    allowedPages: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// About Page
export async function getAboutPage(): Promise<AboutPageData | null> {
    try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as AboutPageData;
        }
        return null;
    } catch (error) {
        console.error('Error getting about page:', error);
        return null;
    }
}

export async function updateAboutPage(data: AboutPageData): Promise<boolean> {
    try {
        const docRef = doc(db, 'content', 'about');
        await setDoc(docRef, { ...data, updatedAt: serverTimestamp() });
        return true;
    } catch (error) {
        console.error('Error updating about page:', error);
        return false;
    }
}

// Services
export async function getServices(): Promise<ServiceData[]> {
    try {
        const q = query(collection(db, 'services'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceData));
    } catch (error) {
        console.error('Error getting services:', error);
        return [];
    }
}

export async function getService(id: string): Promise<ServiceData | null> {
    try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as ServiceData;
        }
        return null;
    } catch (error) {
        console.error('Error getting service:', error);
        return null;
    }
}

export async function addService(data: Omit<ServiceData, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, 'services'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding service:', error);
        return null;
    }
}

export async function updateService(id: string, data: Partial<ServiceData>): Promise<boolean> {
    try {
        const docRef = doc(db, 'services', id);
        await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating service:', error);
        return false;
    }
}

export async function deleteService(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'services', id));
        return true;
    } catch (error) {
        console.error('Error deleting service:', error);
        return false;
    }
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPostData[]> {
    try {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPostData));
    } catch (error) {
        console.error('Error getting blog posts:', error);
        return [];
    }
}

export async function getBlogPost(id: string): Promise<BlogPostData | null> {
    try {
        const docRef = doc(db, 'blog', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogPostData;
        }
        return null;
    } catch (error) {
        console.error('Error getting blog post:', error);
        return null;
    }
}

// function query by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
    try {
        const q = query(collection(db, 'blog'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as BlogPostData;
        }
        return null;
    } catch (error) {
        console.error('Error getting blog post by slug:', error);
        return null;
    }
}

export async function addBlogPost(data: Omit<BlogPostData, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, 'blog'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding blog post:', error);
        return null;
    }
}

export async function updateBlogPost(id: string, data: Partial<BlogPostData>): Promise<boolean> {
    try {
        const docRef = doc(db, 'blog', id);
        await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating blog post:', error);
        return false;
    }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'blog', id));
        return true;
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return false;
    }
}

// Testimonials
export async function getTestimonials(): Promise<TestimonialData[]> {
    try {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestimonialData));
    } catch (error) {
        console.error('Error getting testimonials:', error);
        return [];
    }
}

export async function addTestimonial(data: Omit<TestimonialData, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, 'testimonials'), {
            ...data,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding testimonial:', error);
        return null;
    }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialData>): Promise<boolean> {
    try {
        const docRef = doc(db, 'testimonials', id);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return false;
    }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'testimonials', id));
        return true;
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return false;
    }
}

// Settings
export async function getSettings(): Promise<SettingsData | null> {
    try {
        const docRef = doc(db, 'content', 'settings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as SettingsData;
        }
        return null;
    } catch (error) {
        console.error('Error getting settings:', error);
        return null;
    }
}

export async function updateSettings(data: SettingsData): Promise<boolean> {
    try {
        const docRef = doc(db, 'content', 'settings');
        await setDoc(docRef, { ...data, updatedAt: serverTimestamp() });
        return true;
    } catch (error) {
        console.error('Error updating settings:', error);
        return false;
    }
}

// Appointments
export async function getAppointments(): Promise<AppointmentData[]> {
    try {
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppointmentData));
    } catch (error) {
        console.error('Error getting appointments:', error);
        return [];
    }
}

export async function addAppointment(data: Omit<AppointmentData, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, 'appointments'), {
            ...data,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding appointment:', error);
        return null;
    }
}

export async function updateAppointmentStatus(id: string, status: AppointmentData['status']): Promise<boolean> {
    try {
        const docRef = doc(db, 'appointments', id);
        await updateDoc(docRef, { status });
        return true;
    } catch (error) {
        console.error('Error updating appointment status:', error);
        return false;
    }
}

export async function deleteAppointment(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'appointments', id));
        return true;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return false;
    }
}

// Admin Users
export async function getAdminUsers(): Promise<AdminUserData[]> {
    try {
        const q = query(collection(db, 'adminUsers'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUserData));
    } catch (error) {
        console.error('Error getting admin users:', error);
        return [];
    }
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserData | null> {
    try {
        const q = query(collection(db, 'adminUsers'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as AdminUserData;
        }
        return null;
    } catch (error) {
        console.error('Error getting admin user by email:', error);
        return null;
    }
}

export async function addAdminUser(data: Omit<AdminUserData, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, 'adminUsers'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding admin user:', error);
        return null;
    }
}

export async function updateAdminUser(id: string, data: Partial<AdminUserData>): Promise<boolean> {
    try {
        const docRef = doc(db, 'adminUsers', id);
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
        return true;
    } catch (error) {
        console.error('Error updating admin user:', error);
        return false;
    }
}

export async function deleteAdminUser(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'adminUsers', id));
        return true;
    } catch (error) {
        console.error('Error deleting admin user:', error);
        return false;
    }
}
