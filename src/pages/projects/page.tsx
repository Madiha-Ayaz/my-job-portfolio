

import { useSearch } from '@/context/SearchContext';
import { projects as allProjects } from '@/lib/data';
import ProjectCard from '@/components/projects/ProjectCard';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function ProjectsPage() {
  const { searchQuery } = useSearch();

  const filteredProjects = allProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <AnimatedSection>
        <h1 className="text-4xl font-bold text-center mb-4">My Work</h1>
        <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
          Here is a collection of my projects, showcasing a range of technologies and my dedication to creating high-quality, user-focused applications. Use the search bar in the navigation to filter projects.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <p className="text-center col-span-full text-text-secondary">
              No projects found. Try a different search term.
            </p>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
