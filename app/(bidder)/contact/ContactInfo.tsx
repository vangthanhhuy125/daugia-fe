import { MapPin, Phone, Mail } from "lucide-react";
import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

const infoCards = [
  {
    title: "Address",
    icon: <MapPin size={32} />,
    content: ["No. 96, Street No. 12,", "Block 5, Thu Duc Ward,", "Ho Chi Minh City"],
  },
  {
    title: "Phone number",
    icon: <Phone size={32} />,
    content: ["024.05.111.111", "+84 123.456.789"],
  },
  {
    title: "Email",
    icon: <Mail size={32} />,
    content: ["info@smartauction.vn"],
  }
];

export const ContactInfo = () => (
  <div className={`${jost.className} max-w-screen-xl mx-auto px-6 py-10`}>
    <h2 className="text-[#d32f2f] text-3xl font-[900] mb-8">
      Information
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {infoCards.map((card, idx) => (
        <div 
          key={idx} 
          className="group flex items-start gap-4 p-6 border-2 border-black rounded-2xl shadow-sm bg-white transition-all duration-300 hover:bg-[#CE2029] hover:border-[#CE2029] cursor-pointer"
        >
          <div className="pt-1 text-black group-hover:text-white transition-colors duration-300">
            {card.icon}
          </div>
          
          <div>
            <h3 className="text-xl font-[900] mb-2 text-black group-hover:text-white transition-colors duration-300">
              {card.title}
            </h3>
            {card.content.map((line, i) => (
              <p 
                key={i} 
                className="text-gray-700 font-medium leading-tight group-hover:text-white transition-colors duration-300"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);