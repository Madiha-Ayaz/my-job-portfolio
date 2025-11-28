// src/components/layout/Footer.tsx
import Link from 'next/link';

const socialLinks = [
  { href: 'https://github.com/Madiha-Ayaz?tab=repositories', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/madiha-ayaz-ba68512b5/', label: 'LinkedIn' },
  { href: 'mailto:madiha.ayaz@example.com', label: 'Email' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border-color mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-text-secondary">
              &copy; {currentYear} Madiha Ayaz. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-sm text-text-secondary hover:text-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
