import Header from '@/components/Header'; 
import Footer from '@/components/Footer';
import { ContactInfo } from './ContactInfo';
import { ContactForm } from './ContactForm';
import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function ContactPage() {
  return (
    <div className={`${jost.className} flex flex-col min-h-screen`}>
      <Header />
      
      <main className="flex-grow">
        <div className="bg-white px-6 md:px-20 pt-8">
           <h1 className="text-3xl font-[900] text-gray-900 tracking-tight">Contact</h1>
           <p className="text-sm font-medium text-gray-400 mt-1">Home {'>'} <span className="text-gray-400">Contact</span></p>
        </div>

        <ContactInfo />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}