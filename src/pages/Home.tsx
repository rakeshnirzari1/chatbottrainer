import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Bot, ArrowRight, CheckCircle } from 'lucide-react';

export function Home() {
  const { user } = useAuth();

  const features = [
    'Train bots with up to 10 URLs',
    'Advanced AI processing',
    'Fast and reliable training',
    'Secure data handling'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <Bot className="h-16 w-16 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Train Your Website Bot
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create intelligent bots that understand your website content. 
          Train with up to 10 URLs and get powerful AI-driven responses.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          {user ? (
            <Link to="/pricing">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button size="lg">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What You Get
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}