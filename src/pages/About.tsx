import { Target, Users, Zap, Shield, Award, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">About Websitebot.com.au</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Empowering Australian businesses with intelligent AI chatbots to transform customer support and engagement
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="text-lg text-gray-600 space-y-4 text-left">
                  <p>
                    Websitebot.com.au was founded in Sydney with a simple mission: to make AI-powered customer support accessible to Australian businesses of all sizes. We recognized that while large enterprises had the resources to build sophisticated chatbots, small and medium-sized businesses were left behind.
                  </p>
                  <p>
                    Our team of AI engineers and customer support experts came together to create a platform that's both powerful and incredibly easy to use. Based in Sydney, Australia, we understand the unique needs of local businesses and provide dedicated support during Australian business hours.
                  </p>
                  <p>
                    Today, we're proud to serve businesses across Australia, helping them reduce support costs, increase customer satisfaction, and scale their operations efficiently. Our platform has handled millions of conversations, and we're just getting started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Focus</h3>
                <p className="text-gray-600 leading-relaxed">
                  We put our customers first in every decision we make. Your success is our success, and we're committed to providing the tools and support you need to thrive.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We continuously push the boundaries of what's possible with AI technology, staying ahead of the curve to deliver cutting-edge solutions.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Trust & Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data security is paramount. We employ industry-leading security measures and maintain complete transparency in how we handle your information.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Accessibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced technology should be accessible to everyone. We design our platform to be intuitive and affordable for businesses of all sizes.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  We strive for excellence in every aspect of our service, from the quality of our AI to the responsiveness of our support team.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Growth</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're dedicated to helping your business grow by providing tools that scale with you, from startup to enterprise.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                To democratize AI-powered customer support by providing businesses with intelligent, easy-to-deploy chatbots that enhance customer experience, reduce operational costs, and drive growth.
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-8 rounded-2xl border border-blue-100">
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "We envision a world where every business, regardless of size or technical expertise, can leverage the power of AI to deliver exceptional customer experiences. Our goal is to make advanced technology accessible, affordable, and effective for everyone."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">By The Numbers</h2>
              <div className="grid md:grid-cols-4 gap-8 mt-12">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                  <p className="text-gray-600 font-medium">Active Chatbots</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">5M+</div>
                  <p className="text-gray-600 font-medium">Conversations</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                  <p className="text-gray-600 font-medium">Satisfaction Rate</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                  <p className="text-gray-600 font-medium">Support Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
