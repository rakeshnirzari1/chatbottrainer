import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'
import { Button } from '../components/ui/Button'
import { Bot, Zap, Shield, BarChart3 } from 'lucide-react'

export function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Intelligent
            <span className="text-blue-600"> Chatbots </span>
            for Your Website
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Train AI-powered chatbots on your website content. Provide instant, accurate answers to your visitors 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose DashBot?
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to create and deploy intelligent chatbots
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Advanced AI technology that understands context and provides accurate responses
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Setup</h3>
            <p className="text-gray-600">
              Get your chatbot up and running in minutes with our simple setup process
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">
              Enterprise-grade security to protect your data and your customers' privacy
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Detailed insights into your chatbot's performance and user interactions
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using DashBot to provide better customer experiences
          </p>
          {!user && (
            <Link to="/signup">
              <Button size="lg" variant="secondary">
                Start Your Free Trial
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}