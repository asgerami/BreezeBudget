import React, { useState } from 'react';
import { 
  ArrowRight, 
  Zap,
  MapPin,
  Download, 
  BarChart3, 
  CheckCircle, 
  Shield,
  Clock
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  const [activeDemo, setActiveDemo] = useState(0);

  const features = [
    {
      icon: MapPin,
      title: 'Use Your ZIP Code',
      description: 'Get accurate results based on your local weather data and electricity rates.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: BarChart3,
      title: 'Smart Visualizations',
      description: 'Interactive charts and heat maps that make complex data easy to understand.',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'See cost changes instantly as you adjust settings with intuitive sliders.',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Download,
      title: 'Export Results',
      description: 'Download professional reports to share with contractors or family.',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const demoResults = [
    {
      title: 'Monthly Cost Breakdown',
      description: 'See exactly how much you\'ll spend each month',
      image: '/api/placeholder/400/250',
      savings: '$127/month'
    },
    {
      title: 'Unit Comparison',
      description: 'Compare efficiency ratings and long-term costs',
      image: '/api/placeholder/400/250',
      savings: '$1,200/year'
    },
    {
      title: 'Heat Map Analysis',
      description: 'Visualize seasonal cost variations',
      image: '/api/placeholder/400/250',
      savings: '15% efficiency gain'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      image: '/api/placeholder/60/60',
      content: 'This tool saved me $3,000 by helping me choose the right AC unit. The comparisons were incredibly helpful!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'HVAC Contractor',
      image: '/api/placeholder/60/60',
      content: 'I use this with all my clients. The visualizations make it easy to explain efficiency benefits.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Property Manager',
      image: '/api/placeholder/60/60',
      content: 'Perfect for budgeting across multiple properties. The export feature is a game-changer.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'Analyses Completed' },
    { number: '$2.3M', label: 'Total Savings Generated' },
    { number: '4.9/5', label: 'User Rating' },
    { number: '98%', label: 'Accuracy Rate' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Smart AC Cost Analysis
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Stop Guessing Your
                  <span className="text-blue-600 block">AC Energy Costs</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Get accurate, personalized cost projections for any AC unit using real weather data and your home's specifications. Make informed decisions that save thousands.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStartAnalysis}
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Your Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  No signup required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Results in 2 minutes
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  100% free
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Your Analysis</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                      <p className="text-green-100 text-sm">Monthly Cost</p>
                      <p className="text-2xl font-bold">$127</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                      <p className="text-blue-100 text-sm">Annual Savings</p>
                      <p className="text-2xl font-bold">$1,200</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Efficiency Rating</span>
                      <span className="font-semibold text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Based on your 2,000 sq ft home in Austin, TX
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart AC Decisions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines real weather data, energy efficiency calculations, and intuitive visualizations to give you the complete picture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group hover:scale-105 transition-transform duration-200">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Our guided wizard makes it easy to get accurate cost projections for your home
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Enter Your Details</h3>
              <p className="text-blue-100">ZIP code, home size, and preferences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Choose AC Units</h3>
              <p className="text-blue-100">Compare brands and efficiency ratings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Results</h3>
              <p className="text-blue-100">Detailed cost analysis and recommendations</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Analysis
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Takes 2-3 minutes
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Your data is secure
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;