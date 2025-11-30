// src/components/blog/BlogPostCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

const BlogPostCard = ({ post, index }: BlogPostCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(cardRef.current, 
        { autoAlpha: 0, y: 50 },
        { 
            autoAlpha: 1, 
            y: 0, 
            duration: 0.5, 
            delay: (index % 2) * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
            }
        }
        );
    }, { scope: cardRef });

  return (
    <div ref={cardRef} className="opacity-0">
        <Link href={`/blog/${post.slug}`} className="block group">
            <div className="bg-gray-800/20 rounded-lg overflow-hidden border border-border-color h-full">
                <div className="relative h-56">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="group-hover:scale-105 transition-transform duration-300 object-cover"
                />
                </div>
                <div className="p-6">
                    <p className="text-sm text-text-secondary mb-2">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="text-2xl font-bold text-text group-hover:text-accent transition-colors mb-3">{post.title}</h3>
                    <p className="text-text-secondary mb-4">{post.excerpt}</p>
                    <span className="font-semibold text-accent">Read More &rarr;</span>
                </div>
            </div>
        </Link>
    </div>
  );
};

export default BlogPostCard;
