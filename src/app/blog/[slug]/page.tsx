// src/app/blog/[slug]/page.tsx
import { blogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AnimatedSection from '@/components/ui/AnimatedSection';

// This function tells Next.js which routes to pre-render
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <AnimatedSection>
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{post.title}</h1>
        <div className="text-center text-text-secondary mb-8">
          <span>By {post.author}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-12">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>

        <div 
          className="prose prose-invert prose-lg max-w-none mx-auto
                     prose-h3:text-accent prose-a:text-accent hover:prose-a:text-accent-dark"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-accent/20 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
      </article>
    </AnimatedSection>
  );
}
