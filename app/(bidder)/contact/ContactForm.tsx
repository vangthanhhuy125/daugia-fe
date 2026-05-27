"use client";

import React, { useState } from 'react';
import { Jost } from 'next/font/google';
import { contactService } from '@/services/contactService';
import type { ContactMessageCreateRequest } from '@/types/contact';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'] });

const initialFormState: ContactMessageCreateRequest = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  message: '',
};

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactMessageCreateRequest>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.fullName.trim()) return 'Full name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (!formData.message.trim()) return 'Message is required.';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submit(formData);
      setSuccessMessage('Your message has been sent. We will get back to you soon.');
      setFormData(initialFormState);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to send contact message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`${jost.className} max-w-screen-xl mx-auto px-6 pb-20`}>
      <h2 className="text-[#d32f2f] text-3xl font-[900] mb-4">Contact</h2>
      <p className="text-gray-700 font-medium mb-10 italic">
        Please fill in the fields below. We will contact you and respond to your request as soon as possible.
      </p>

      {(successMessage || errorMessage) && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
            successMessage
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
          role="alert"
        >
          {successMessage || errorMessage}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-2">
            <label className="text-gray-800 font-bold">Full name:</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-800 font-bold">Email:</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-800 font-bold">Phone number:</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-800 font-bold">Address:</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              type="text"
              className="w-full h-12 bg-[#e0e0e0] rounded-full px-6 outline-none focus:ring-2 ring-[#d32f2f] transition"
            />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-gray-800 font-bold">Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full bg-[#e0e0e0] rounded-[32px] p-6 outline-none focus:ring-2 ring-[#d32f2f] transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 px-10 py-3 bg-[#d32f2f] text-white font-[900] rounded-md shadow-md hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </section>
  );
};
