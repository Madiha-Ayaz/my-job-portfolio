

import { useState } from 'react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { PaperAirplaneIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore imports
import { app } from '@/lib/firebase'; // Import the initialized Firebase app

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Make handleSubmit async
    e.preventDefault();
    setLoading(true); // Start loading
    setStatus('Submitting...');
    
    try {
      const db = getFirestore(app); // Get Firestore instance
      const contactsCollection = collection(db, 'contacts'); // Reference to 'contacts' collection

      await addDoc(contactsCollection, { // Add document to Firestore
        ...formData,
        timestamp: serverTimestamp(), // Add server timestamp
      });

      setStatus('Message sent successfully! I will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' }); // Clear form
      setTimeout(() => setStatus(''), 5000); // Clear status after 5 seconds
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus(`Error: ${error.message || 'Failed to send message.'}`);
      setTimeout(() => setStatus(''), 5000); // Clear status after 5 seconds
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Get In Touch</h1>
        <p className="text-lg text-text-secondary text-center mb-12">
          Have a project in mind, want to collaborate, or just want to say hi? <br/> Feel free to reach out.
        </p>

        <div className="grid md:grid-cols-2 gap-12 bg-gray-800/20 p-8 rounded-lg border border-border-color">
          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-accent mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <EnvelopeIcon className="w-6 h-6 text-accent"/>
                <span className="text-text-secondary">madihaayaz248@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <PhoneIcon className="w-6 h-6 text-accent"/>
                <span className="text-text-secondary">03343717260</span>
              </div>
            </div>
            <p className="mt-8 text-sm text-text-secondary">
              Please feel free to email me directly. I make an effort to respond to all inquiries within 24-48 hours.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border-color text-text placeholder-text-secondary px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border-color text-text placeholder-text-secondary px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border-color text-text placeholder-text-secondary px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center bg-accent text-white font-bold py-3 px-6 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50"
                disabled={status.startsWith('Submitting...')}
              >
                <PaperAirplaneIcon className="w-5 h-5 mr-2"/>
                {status.startsWith('Submitting...') ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            {status && <p className="text-center text-sm text-accent mt-4">{status}</p>}
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
}
