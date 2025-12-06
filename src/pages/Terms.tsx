import { FileText } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Terms() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showAuthButtons={false} />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-slate-600 to-slate-800 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <FileText className="w-14 h-14 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
              <p className="text-lg opacity-90">Last updated: November 21, 2025</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <p className="text-gray-700 mb-0">
                  Please read these Terms and Conditions carefully before using Websitebot.com.au. By accessing or using our service, you agree to be bound by these terms.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                By accessing and using Websitebot.com.au ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use the Service.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Websitebot.com.au provides an AI-powered chatbot creation and training platform that allows users to create custom chatbots based on their website content. The Service includes website crawling, content extraction, AI training, and chatbot deployment features.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">3. User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To use certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring that your account information is accurate and up-to-date</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">4. Acceptable Use</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes. You must not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Use the Service to violate any applicable laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Transmit any harmful, threatening, abusive, or offensive content</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Use the Service to create chatbots that spread misinformation or engage in deceptive practices</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">5. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Websitebot.com.au operates on a one-time payment model:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Prices are based on the number of URLs you wish to train your chatbot on</li>
                <li>Payment is required before deployment of your chatbot</li>
                <li>All payments are processed securely through our payment provider</li>
                <li>Prices are subject to change with notice</li>
                <li>Refunds are handled on a case-by-case basis</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">6. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The Service and its original content, features, and functionality are owned by Websitebot.com.au and are protected by international copyright, trademark, and other intellectual property laws. You retain all rights to your content, and we claim no ownership over it.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">7. Data Collection and Use</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We collect and process data as described in our Privacy Policy. By using the Service, you consent to our collection and use of your data in accordance with our Privacy Policy. We only crawl and process the website content you explicitly provide or authorize.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">8. Service Availability</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                While we strive to provide uninterrupted service, we do not guarantee that the Service will always be available or error-free. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">9. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To the maximum extent permitted by law, Websitebot.com.au shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. Our total liability shall not exceed the amount you paid for the Service.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">10. Warranty Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will meet your requirements or that it will be uninterrupted, secure, or error-free.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">11. Indemnification</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                You agree to indemnify and hold harmless Websitebot.com.au and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">12. Termination</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">13. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">14. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts located in the United States.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">15. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@websitebot.com.au
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 123 AI Street, Tech City, TC 12345
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                <p className="text-gray-700 mb-0">
                  By using Websitebot.com.au, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
