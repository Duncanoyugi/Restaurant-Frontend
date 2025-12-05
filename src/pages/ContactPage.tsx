import React, { useState } from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import Input from '../components/ui/input';
import Button from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Message sent successfully! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['123 Gourmet Street', 'Food City, FC 12345'],
      description: 'Stop by for a memorable dining experience'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      description: 'Available 24/7 for reservations and inquiries'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: ['hello@savorybites.com', 'reservations@savorybites.com'],
      description: 'We typically respond within 2 hours'
    },
    {
      icon: '🕒',
      title: 'Opening Hours',
      details: ['Monday - Sunday:', '11:00 AM - 11:00 PM'],
      description: 'Kitchen closes at 10:30 PM'
    }
  ];

  const faqs = [
    {
      question: 'Do you accommodate dietary restrictions?',
      answer: 'Yes, we accommodate various dietary needs including vegetarian, vegan, gluten-free, and allergies. Please inform us when making your reservation.'
    },
    {
      question: 'Is there a dress code?',
      answer: 'We recommend smart casual attire. While we don\'t have a strict dress code, we encourage guests to dress appropriately for a fine dining experience.'
    },
    {
      question: 'Can I modify my reservation?',
      answer: 'Yes, you can modify your reservation up to 2 hours before your scheduled time through our website or by calling us directly.'
    },
    {
      question: 'Do you offer private dining?',
      answer: 'Absolutely! We have private dining rooms available for special occasions, business meetings, and celebrations. Contact us for more information.'
    },
    {
      question: 'Is valet parking available?',
      answer: 'Yes, complimentary valet parking is available for all dining guests from 5:00 PM to midnight.'
    }
  ];

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <AnimatedSection direction="up">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Get In Touch
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  We'd love to hear from you. Whether you have a question about our services, 
                  want to make a reservation, or just want to say hello, we're here to help.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimatedSection direction="left">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Send us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                    <Input
                      label="Subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us how we can help you..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                      className="w-full"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <AnimatedSection direction="right">
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div
                      key={info.title}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{info.icon}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {info.title}
                          </h3>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-gray-600 dark:text-gray-300">
                              {detail}
                            </p>
                          ))}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-20">
            <AnimatedSection direction="up">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Quick answers to common questions about our services
                </p>
              </div>
            </AnimatedSection>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <AnimatedSection key={index} direction="up" delay={index * 100}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </LandingLayout>
  );
};

export default ContactPage;