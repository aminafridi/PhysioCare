import { blogPosts as defaultPosts } from '@/data/blog-posts';
import EditBlogPostClient from './AdminBlogEditClient';

export async function generateStaticParams() {
    return defaultPosts.map((post) => ({
        id: post.id,
    }));
}

export default function EditBlogPostPage() {
    return <EditBlogPostClient />;
}
