import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How does ChatbotTrainer work?',
      answer: 'Simply provide your website URL, and our AI will automatically crawl your site, extract content, and train a custom chatbot. You can then embed the chatbot on your website with a simple code snippet. The entire process takes just a few minutes.'
    },
    {
      category: 'Getting Started',
      question: 'Do I need any technical knowledge to use ChatbotTrainer?',
      answer: 'No! ChatbotTrainer is designed to be user-friendly and requires no coding skills. Our platform handles all the technical aspects automatically. You just need to paste your website URL and follow the simple setup process.'
    },
    {
      category: 'Getting Started',
      question: 'How long does it take to set up a chatbot?',
      answer: 'Most chatbots are ready in under 5 minutes. The time depends on the size of your website, but our AI works quickly to crawl and train on your content.'
    },
    {
      category: 'Pricing',
      question: 'How is pricing calculated?',
      answer: 'Pricing is based on the number of URLs you want to train your chatbot on. We offer transparent, one-time payment tiers starting at $50 for 1-10 URLs. There are no subscription fees or hidden costs.'
    },
    {
      category: 'Pricing',
      question: 'Is there a free trial available?',
      answer: 'Yes! You can start the setup process for free and see how our platform works. You only pay when you\'re ready to deploy your chatbot to production.'
    },
    {
      category: 'Pricing',
      question: 'Are there any ongoing fees or subscriptions?',
      answer: 'No. ChatbotTrainer uses a one-time payment model. Once you pay for your chatbot, it\'s yours to use indefinitely with no recurring charges.'
    },
    {
      category: 'Features',
      question: 'Can I customize how my chatbot looks?',
      answer: 'Yes! You can customize the appearance of your chatbot including colors, position, and branding to match your website\'s design.'
    },
    {
      category: 'Features',
      question: 'What kind of questions can my chatbot answer?',
      answer: 'Your chatbot can answer any questions related to the content on your website. It uses advanced AI to understand context and provide accurate, relevant responses based on your training data.'
    },
    {
      category: 'Features',
      question: 'Can I update my chatbot\'s knowledge base?',
      answer: 'Yes! You can retrain your chatbot at any time with updated content from your website or add specific information manually.'
    },
    {
      category: 'Features',
      question: 'Does the chatbot work on mobile devices?',
      answer: 'Absolutely! Our chatbots are fully responsive and work seamlessly on all devices including smartphones, tablets, and desktop computers.'
    },
    {
      category: 'Technical',
      question: 'Which websites are compatible with ChatbotTrainer?',
      answer: 'ChatbotTrainer works with any website platform including WordPress, Shopify, Wix, Squarespace, custom HTML sites, and more. As long as you can add a code snippet to your site, you can use our chatbot.'
    },
    {
      category: 'Technical',
      question: 'How do I add the chatbot to my website?',
      answer: 'After your chatbot is trained, you\'ll receive an embed code. Simply copy and paste this code into your website\'s HTML, typically before the closing body tag. Detailed instructions are provided for popular platforms.'
    },
    {
      category: 'Technical',
      question: 'Is my data secure?',
      answer: 'Yes! We take security seriously. All data is encrypted in transit and at rest. We only access the public pages you explicitly select, and we never share your data with third parties.'
    },
    {
      category: 'Technical',
      question: 'What happens if my website changes?',
      answer: 'You can easily retrain your chatbot whenever you update your website content. This ensures your chatbot always has the most current information.'
    },
    {
      category: 'Support',
      question: 'What kind of support do you offer?',
      answer: 'We provide email support to all customers. Our support team typically responds within 24 hours on business days. We also have comprehensive documentation and guides available.'
    },
    {
      category: 'Support',
      question: 'Can I get help with customization?',
      answer: 'Yes! Our support team can help with customization questions and provide guidance on getting the most out of your chatbot.'
    },
    {
      category: 'Support',
      question: 'What if I\'m not satisfied with my chatbot?',
      answer: 'We want you to be completely satisfied. If you encounter any issues, please contact our support team and we\'ll work with you to resolve them.'
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Find answers to common questions about ChatbotTrainer
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-3 mb-12 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                    >
                      <div className="flex-1 pr-4">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {openIndex === index ? (
                          <ChevronUp className="text-blue-600" size={24} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={24} />
                        )}
                      </div>
                    </button>
                    {openIndex === index && (
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-16 bg-gradient-to-br from-blue-50 to-slate-50 p-8 rounded-2xl border border-blue-100 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
                <p className="text-gray-600 mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
