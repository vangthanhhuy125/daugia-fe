import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const ContactForm = () => (
  <section className={`${jost.className} max-w-screen-xl mx-auto px-6 pb-20`}>
    <h2 className="text-[#d32f2f] text-3xl font-[900] mb-4">Contact</h2>
    <p className="text-gray-700 font-medium mb-10 italic">
      Please fill in the fields below. We will contact you and respond to your request as soon as possible.
    </p>

    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div className="space-y-2">
          <label className="text-gray-800 font-bold">Full name:</label>
          <input type="text" className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition" />
        </div>
        <div className="space-y-2">
          <label className="text-gray-800 font-bold">Email:</label>
          <input type="email" className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition" />
        </div>
        <div className="space-y-2">
          <label className="text-gray-800 font-bold">Phone number:</label>
          <input type="text" className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition" />
        </div>
        <div className="space-y-2">
          <label className="text-gray-800 font-bold">Address:</label>
          <input type="text" className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition" />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <label className="text-gray-800 font-bold">Message:</label>
        <textarea rows={6} className="w-full bg-[#e0e0e0] rounded-[32px] p-6 outline-none focus:ring-2 ring-[#d32f2f] transition resize-none" />
      </div>

      <button type="submit" className="mt-8 px-10 py-3 bg-[#d32f2f] text-white font-[900] rounded-md shadow-md hover:bg-red-700 transition-all">
        Submit Request
      </button>
    </form>
  </section>
);