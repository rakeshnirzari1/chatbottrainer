import { Shield } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Privacy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showAuthButtons={false} />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="w-14 h-14 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg opacity-90">Last updated: November 21, 2025</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <p className="text-gray-700 mb-0">
                  At Websitebot.com.au, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">1. Information We Collect</h2>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">Personal Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Name and email address when you create an account</li>
                <li>Payment information when you purchase our services</li>
                <li>Website URLs and content that you submit for chatbot training</li>
                <li>Communications you send to us</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you access our service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Log data such as IP address, browser type, and operating system</li>
                <li>Usage data including pages visited and time spent on our service</li>
                <li>Device information and unique identifiers</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Train and deploy your custom AI chatbots</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and optimize our service</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf, such as payment processing, hosting, and analytics</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly consent to sharing your information</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption of data in transit and at rest, regular security assessments, and restricted access to personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">5. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We retain your personal information for as long as necessary to provide you with our services and as required by applicable law. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal, regulatory, or security purposes.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">6. Your Rights and Choices</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-6">
                To exercise these rights, please contact us at support@websitebot.com.au.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We use cookies and similar tracking technologies to collect and track information about your use of our service. Cookies are small data files stored on your device. You can instruct your browser to refuse cookies or alert you when cookies are being sent. However, some parts of our service may not function properly without cookies.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">8. Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information to them.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">9. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">10. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from those in your country. We take appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Your continued use of our service after changes are posted constitutes acceptance of the updated Privacy Policy.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">12. California Privacy Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your personal information, and the right to opt-out of the sale of your personal information. We do not sell your personal information.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">13. GDPR Compliance</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, data portability, and to object to processing. You also have the right to lodge a complaint with a supervisory authority.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">14. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
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

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
                <p className="text-gray-700 mb-0">
                  By using Websitebot.com.au, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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
