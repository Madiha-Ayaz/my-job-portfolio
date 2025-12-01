


import { Project } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(cardRef.current, 
      { autoAlpha: 0, y: 50 },
      { 
        autoAlpha: 1, 
        y: 0, 
        duration: 0.5, 
        delay: (index % 3) * 0.1, // Stagger effect
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
      <div className="bg-gray-800/20 rounded-lg overflow-hidden group border border-border-color h-full flex flex-col">
        <div className="relative h-48">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-accent mb-2">{project.title}</h3>
          <p className="text-text-secondary text-sm flex-grow">{project.description}</p>
          <div className="flex flex-wrap gap-2 my-4">
            {project.tags.map(tag => (
              <span key={tag} className="bg-accent/20 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex space-x-4">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text hover:text-accent transition-colors">
              Live Demo
            </a>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
