// src/app/about/page.tsx
import AnimatedSection from '@/components/ui/AnimatedSection';
import { CheckCircleIcon } from '@heroicons/react/24/solid';


const skills = [
  'Next.js', 'TypeScript', 'React', 'Node.js',
  'Python', 'AI Chatbots', 'Firebase', 'JavaScript',
  'Tailwind CSS', 'animations ', 'figma', 'Git & GitHub'
];

const certifications = [
  {
    name: 'Fundamental of Python with AI',
    issuer: 'Presidential Initiative AI Course (PIAIC)',
    year: '2022',
  },
  {
    name: 'MERN Stack Developer',
    issuer: 'Saylani Mass IT Training (SMIT)',
    year: '2025',
  },
  {
    name: 'Generative AI',
    issuer: 'Governor Initiative AI course (GIAIC)',
    year: '2024',
  },
];

const education = [
  {
    degree: 'B.BIT (Bachelor of Business & Information Technology)',
    university: 'Virtual University',
    graduated: '2024',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-24">
      {/* Introduction Section */}
      <AnimatedSection className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-lg text-text-secondary mb-4">
            Hello! I&apos;m Madiha Ayaz, a professional Frontend Web Developer building 
            lightning-fast and intelligent web applications.
          </p>
          <p className="text-lg text-text-secondary mb-4">
            I specialize in the modern stack: <strong>Next.js</strong> for speed, <strong>Tailwind CSS</strong>, <strong>Bootstrap</strong> for stunning design, and <strong>JavaScript</strong>/<strong>TypeScript</strong> for stability. My unique value is integrating smart solutions like custom <strong>AI Chatbots</strong> and secure <strong>Firebase Authentication</strong>, backed by <strong>Python</strong> fundamentals.
          </p>
          <p className="text-lg text-text-secondary">
            My expertise is certified by programs like PIAIC, GIAIC, and SMIT, reflecting my continuous dedication to learning and growing in the ever-evolving world of web development.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-accent shadow-2xl">
                <img
                    src="/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif"
                    alt="Madiha Ayaz"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection>
        <h2 className="text-3xl font-bold text-center mb-12">My Skillset</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <div key={skill} className="flex items-center space-x-3 bg-gray-800/20 p-4 rounded-lg border border-transparent hover:border-accent transition-colors">
              <CheckCircleIcon className="w-6 h-6 text-accent" />
              <span className="font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Certifications Section */}
      <AnimatedSection>
        <h2 className="text-3xl font-bold text-center mb-16">Certifications</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border-color"></div>
          {certifications.map((cert, index) => (
            <div key={cert.name} className={`relative mb-16 flex items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-5/12"></div>
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full z-10 border-4 border-background"></div>
              <div className="w-full md:w-7/12 bg-gray-800/30 p-6 rounded-lg shadow-lg border border-border-color backdrop-blur-sm">
                <p className="text-sm text-accent mb-1">{cert.year}</p>
                <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                <p className="text-text-secondary font-semibold mb-3">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Education Section */}
      <AnimatedSection>
        <h2 className="text-3xl font-bold text-center mb-16">Education</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border-color"></div>
          {education.map((edu, index) => (
            <div key={edu.degree} className={`relative mb-16 flex items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-5/12"></div>
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full z-10 border-4 border-background"></div>
              <div className="w-full md:w-7/12 bg-gray-800/30 p-6 rounded-lg shadow-lg border border-border-color backdrop-blur-sm">
                <p className="text-sm text-accent mb-1">Graduated {edu.graduated}</p>
                <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                <p className="text-text-secondary font-semibold mb-3">{edu.university}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
