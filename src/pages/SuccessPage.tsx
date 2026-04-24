import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your subscription. Your chatbot is being set up.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            What happens next?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">1</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  We'll process your website and train your chatbot
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">2</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  You'll receive an email with your embed code
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">3</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  Add the code to your website and start chatting!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}