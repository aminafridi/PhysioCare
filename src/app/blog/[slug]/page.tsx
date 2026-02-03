import { blogPosts as defaultPosts } from '@/data/blog-posts';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
    return defaultPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default function BlogPostPage() {
    return <BlogPostClient />;
}
