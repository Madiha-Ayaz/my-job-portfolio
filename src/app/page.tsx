// src/app/page.tsx
import Hero from '@/components/home/Hero';
import AnimatedSection from '@/components/ui/AnimatedSection';

// Mock data for featured projects for demonstration
const featuredProjects = [
  { id: 1, title: 'E-commerce Platform', description: 'A full-featured online store with Stripe integration.' },
  { id: 2, title: 'Data Visualization Dashboard', description: 'Real-time analytics dashboard using D3.js.' },
  { id: 3, title: 'AI Chatbot Assistant', description: 'A conversational AI powered by the Gemini API.' },
];

export default function HomePage() {
  return (
    <div>
      <Hero />
      
      <AnimatedSection className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.id} className="bg-gray-800/20 p-6 rounded-lg border border-border-color shadow-lg hover:shadow-accent/20 transition-shadow">
              <h3 className="text-xl font-bold text-accent mb-2">{project.title}</h3>
              <p className="text-text-secondary">{project.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
        </p>
        <a 
          href="/contact"
          className="bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent-dark transition-colors"
        >
          Get In Touch
        </a>
      </AnimatedSection>
    </div>
  );
}