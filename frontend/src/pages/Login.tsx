import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Truck, Mail, Lock, ArrowRight, Globe, Zap, Shield, BarChart3, Package, TrendingUp } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();

      // Store token
      if (rememberMe) {
        localStorage.setItem('token', result.accessToken);
      } else {
        sessionStorage.setItem('token', result.accessToken);
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Reach',
      description: 'Multi-region logistics across UK, EU, US, and APAC markets',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered',
      description: 'Intelligent route optimization and predictive analytics',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Blockchain Security',
      description: 'Immutable audit trail with smart contract integration',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-time Analytics',
      description: 'Advanced SLA monitoring and cost optimization insights',
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'IoT Integration',
      description: 'Live GPS tracking and telemetry data from connected devices',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Scalable Platform',
      description: 'Enterprise-grade SaaS built for high-volume operations',
    },
  ];

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding */}
            <div className="hidden lg:block">
              <div className="text-left space-y-6">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">THG Ingenuity</h1>
                    <p className="text-sm text-gray-600">Transport Management System</p>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Power Your Global Logistics
                </h2>
                <p className="text-lg text-gray-600">
                  Enterprise-grade transport management platform designed for scale,
                  speed, and operational excellence across all markets.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">End-to-End Visibility</p>
                      <p className="text-sm text-gray-600">Track shipments from first-mile to last-mile delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Multi-Carrier Integration</p>
                      <p className="text-sm text-gray-600">Connect with carriers worldwide for optimal routing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Intelligent Automation</p>
                      <p className="text-sm text-gray-600">AI-driven route planning and cost optimization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login Form */}
            <Card className="p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-600 mt-2">Sign in to access your logistics command center</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Authentication Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm text-gray-700 font-medium">Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-black hover:text-gray-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  ← Back to home
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">THG Ingenuity</h1>
                <p className="text-xs text-gray-600">Transport Management System</p>
              </div>
            </div>
            <Button
              onClick={() => setShowLogin(true)}
              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Supercharge Your
              <br />
              <span className="text-gray-600">Global Logistics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Enterprise SaaS platform powering transport operations across UK, EU, US, and APAC markets.
              Built for scale, optimized for performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowLogin(true)}
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Modern Logistics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive platform integrating AI, IoT, and blockchain for next-generation transport management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-gray-900 mb-2">100+</p>
              <p className="text-gray-600 font-medium">Global Carriers</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-900 mb-2">4</p>
              <p className="text-gray-600 font-medium">Continents Covered</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-900 mb-2">99.9%</p>
              <p className="text-gray-600 font-medium">Platform Uptime</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-900 mb-2">24/7</p>
              <p className="text-gray-600 font-medium">Support Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join leading enterprises using THG Ingenuity TMS to optimize their global supply chain operations
          </p>
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
          >
            Access Platform
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">THG Ingenuity TMS</p>
                <p className="text-sm text-gray-600">Part of THG Ingenuity</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 THG Ingenuity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
