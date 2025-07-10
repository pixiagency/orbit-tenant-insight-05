import React from 'react';
import { CheckCircle, Users, Zap, Shield, BarChart3, MessageSquare, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Lead Management",
      description: "Capture, score, and nurture leads with AI-powered insights and automated workflows.",
      benefits: [
        "AI-powered lead scoring",
        "Automated lead nurturing",
        "Multi-channel lead capture",
        "Lead lifecycle tracking"
      ]
    },
    {
      icon: Zap,
      title: "Sales Automation",
      description: "Automate repetitive tasks and focus on what matters most - closing deals.",
      benefits: [
        "Workflow automation",
        "Email sequence automation",
        "Task automation",
        "Follow-up reminders"
      ]
    },
    {
      icon: MessageSquare,
      title: "Customer Communication",
      description: "Connect with customers across all channels from one unified platform.",
      benefits: [
        "Multi-channel messaging",
        "Email marketing tools",
        "SMS integration",
        "Live chat support"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Make data-driven decisions with comprehensive dashboards and insights.",
      benefits: [
        "Real-time dashboards",
        "Custom reports",
        "Performance metrics",
        "Predictive analytics"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with SOC2 and GDPR compliance.",
      benefits: [
        "SOC2 certified",
        "GDPR compliant",
        "Data encryption",
        "Role-based access"
      ]
    },
    {
      icon: Globe,
      title: "Multi-Tenant Architecture",
      description: "Manage multiple organizations with complete data isolation and custom branding.",
      benefits: [
        "Data isolation",
        "Custom branding",
        "Scalable infrastructure",
        "White-label options"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-blue-600">Modern Businesses</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Everything you need to streamline your sales process, automate customer engagement, 
              and grow your business with confidence.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with your favorite tools and platforms to create a unified workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "Slack", "Gmail", "Outlook", "Zoom", "Teams", "HubSpot",
              "Salesforce", "Zapier", "Stripe", "PayPal", "QuickBooks", "Xero"
            ].map((integration, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-3">
                  <span className="font-semibold text-gray-700 text-sm">{integration}</span>
                </div>
                <div className="text-sm text-gray-600">{integration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to experience these features?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of companies already using our platform to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/website/pricing">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
