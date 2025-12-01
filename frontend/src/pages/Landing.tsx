import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Truck,
  ArrowRight,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Package,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  Boxes,
  Route,
  Bell,
  FileText,
  Lock,
  X,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';

interface FeatureDetail {
  title: string;
  description: string;
  benefits: string[];
  capabilities: string[];
  screenshot?: string;
}

interface CapabilityDetail {
  title: string;
  description: string;
  features: string[];
  useCase: string;
  screenshot?: string;
}

export const Landing: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<CapabilityDetail | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: '/screenshots/route-planning.png',
      title: 'Master Multi-Modal Transport',
      subtitle: 'Operations',
      description: 'Unified platform for managing Road, Air, Rail, and Ocean freight with intelligent route optimization, automated carrier selection, and dynamic load planning across your entire distribution network.',
      highlight: 'Transport Orchestration',
    },
    {
      image: '/screenshots/live-tracking.png',
      title: 'Live Fleet & Shipment',
      subtitle: 'Visibility',
      description: 'Real-time GPS tracking, driver monitoring, and shipment track-and-trace with IoT sensors delivering 30-second position updates, live ETA calculations, and instant exception alerts for your entire fleet.',
      highlight: 'Track & Trace',
    },
    {
      image: '/screenshots/shipment-details.png',
      title: 'Optimize Last-Mile & B2B',
      subtitle: 'Delivery',
      description: 'AI-powered route planning for courier operations, last-mile delivery optimization, proof-of-delivery capture, and automated delivery slot management with customer notifications and real-time updates.',
      highlight: 'Delivery Management',
    },
    {
      image: '/screenshots/carriers.png',
      title: 'Intelligent Transport Planning',
      subtitle: 'At Scale',
      description: 'Advanced TMS with load optimization, vehicle capacity planning, multi-stop route sequencing, carrier tendering, freight audit, and comprehensive analytics for enterprise distribution networks.',
      highlight: 'Smart Planning',
    },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Reach',
      description: 'Multi-region logistics across UK, EU, US, and APAC markets with seamless cross-border operations',
      detail: {
        title: 'Global Reach',
        description: 'Power your international logistics operations with our globally distributed platform designed for cross-border excellence.',
        benefits: [
          'Operate seamlessly across UK, EU, US, and APAC markets',
          'Multi-currency and multi-language support',
          'Automated customs documentation and compliance',
          'Local carrier integrations in each region',
          'Real-time currency conversion and landed cost calculation',
        ],
        capabilities: [
          'Multi-region warehouse management',
          'Cross-border compliance automation',
          'International carrier network (100+ carriers)',
          'Duty and tax calculation engine',
          'Regional performance analytics',
        ],
        screenshot: '/screenshots/global-dashboard.png',
      },
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Optimization',
      description: 'Intelligent route planning, predictive analytics, and automated decision-making for maximum efficiency',
      detail: {
        title: 'AI-Powered Optimization',
        description: 'Leverage machine learning and artificial intelligence to optimize every aspect of your logistics operations.',
        benefits: [
          'Reduce fuel costs by up to 30% with intelligent routing',
          'Predict delays before they happen with 95% accuracy',
          'Automate carrier selection based on performance and cost',
          'Optimize vehicle loading for maximum capacity utilization',
          'Dynamic re-routing based on real-time traffic and weather',
        ],
        capabilities: [
          'Machine learning route optimization',
          'Predictive ETA calculations',
          'Automated load planning',
          'Demand forecasting',
          'Anomaly detection and alerts',
        ],
        screenshot: '/screenshots/ai-optimization.png',
      },
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Blockchain Security',
      description: 'Immutable audit trail with smart contract integration ensuring transparency and compliance',
      detail: {
        title: 'Blockchain Security',
        description: 'Next-generation security and transparency powered by blockchain technology for complete shipment traceability.',
        benefits: [
          'Immutable record of all shipment events',
          'Smart contract automation for payment triggers',
          'Enhanced fraud prevention and security',
          'Complete supply chain transparency',
          'Regulatory compliance with tamper-proof records',
        ],
        capabilities: [
          'Distributed ledger technology integration',
          'Smart contract execution engine',
          'Cryptographic verification of documents',
          'Multi-party transaction validation',
          'Blockchain-based proof of delivery',
        ],
        screenshot: '/screenshots/blockchain.png',
      },
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-time Analytics',
      description: 'Advanced SLA monitoring, KPI tracking, and cost optimization insights with live dashboards',
      detail: {
        title: 'Real-time Analytics',
        description: 'Make data-driven decisions with comprehensive analytics and real-time business intelligence.',
        benefits: [
          'Monitor KPIs and SLAs in real-time',
          'Identify cost-saving opportunities instantly',
          'Track carrier performance and compliance',
          'Analyze trends and patterns with AI',
          'Custom dashboards for every stakeholder',
        ],
        capabilities: [
          'Live operational dashboards',
          'Advanced reporting and visualization',
          'Predictive analytics and forecasting',
          'Custom KPI configuration',
          'Automated performance alerts',
        ],
        screenshot: '/screenshots/analytics.png',
      },
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'IoT Integration',
      description: 'Live GPS tracking, temperature monitoring, and telemetry data from connected devices',
      detail: {
        title: 'IoT Integration',
        description: 'Connect your physical assets with our IoT platform for real-time visibility and control.',
        benefits: [
          'Real-time GPS tracking of all vehicles and shipments',
          'Temperature and humidity monitoring for sensitive goods',
          'Shock and tilt detection for fragile items',
          'Automated alerts for exceptions and deviations',
          'Historical telemetry data for analysis',
        ],
        capabilities: [
          'IoT sensor integration (GPS, temperature, shock)',
          'Real-time geofencing and alerts',
          'Cold chain compliance monitoring',
          'Asset tracking and utilization',
          'Predictive maintenance for vehicles',
        ],
        screenshot: '/screenshots/iot-tracking.png',
      },
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Enterprise Scalability',
      description: 'Cloud-native SaaS architecture designed for high-volume operations and rapid growth',
      detail: {
        title: 'Enterprise Scalability',
        description: 'Built on cloud-native architecture to scale effortlessly with your business growth.',
        benefits: [
          'Handle millions of shipments without performance degradation',
          'Auto-scaling infrastructure adapts to demand',
          '99.9% uptime SLA with redundancy',
          'Multi-tenant architecture for data isolation',
          'Global CDN for fast performance worldwide',
        ],
        capabilities: [
          'Microservices architecture',
          'Horizontal and vertical scaling',
          'Load balancing and failover',
          'Multi-region deployment',
          'High-availability infrastructure',
        ],
        screenshot: '/screenshots/architecture.png',
      },
    },
  ];

  const capabilities = [
    {
      icon: <Boxes className="w-6 h-6" />,
      title: 'Shipment Management',
      description: 'End-to-end visibility from pickup to delivery with automated status updates and exception handling',
      detail: {
        title: 'Comprehensive Shipment Management',
        description: 'Manage every aspect of your shipments with complete visibility and control. Track from origin to destination with real-time updates, interactive maps, and IoT sensor integration for temperature-sensitive cargo.',
        features: [
          'Real-time GPS tracking with interactive map visualization',
          'IoT sensor dashboard (temperature, humidity, shock, battery)',
          'Multi-modal shipment support (LTL, FTL, Parcel, Air, Ocean)',
          'Automated status updates and milestone tracking',
          'Exception management with proactive alerts',
          'Digital proof of delivery with photo capture',
          'Shipment value, weight, and dimensions tracking',
          'Insurance and priority shipping management',
          'Complete tracking history with timestamps and locations',
        ],
        useCase: 'FedEx Express manages 45,000+ active shipments with 96.5% on-time delivery rate. Each shipment features live GPS tracking, IoT sensor monitoring for environmental conditions, and automated customer notifications. The system processes 2M+ tracking events daily with real-time map visualization showing origin, current location, waypoints, and destination with predictive ETA calculations.',
        screenshot: 'shipment-details.png',
      },
    },
    {
      icon: <Route className="w-6 h-6" />,
      title: 'Route Planning',
      description: 'Dynamic route optimization considering traffic, weather, delivery windows, and vehicle capacity',
      detail: {
        title: 'Intelligent Lane Management & Route Optimization',
        description: 'Multi-modal route planning with AI-powered optimization engine. Manage domestic, international, and air freight lanes with automated rate comparison and carrier selection.',
        features: [
          'Lane management across all transport modes (Road, Air, Ocean, Rail)',
          'Automated carrier rate comparison and optimization (86% avg optimization)',
          'Real-time on-time rate tracking (94.1% performance)',
          'Multi-carrier support with 2+ alternates per lane',
          'Distance and transit time calculations',
          'Volume discount and customs requirements tracking',
          'Preferred carrier selection with performance scorecards',
          'Active shipment monitoring per lane',
          'YTD shipment volume and historical analytics',
        ],
        useCase: 'Global logistics network operates 6 active lanes with 45 active shipments achieving 94.1% on-time delivery. LA to Seattle Express route covers 1,135 mi with 12 active shipments and 487 YTD deliveries at 98.5% on-time rate. The system auto-optimizes carrier selection saving $0.75/mile across 2 carrier options with daily rate updates.',
        screenshot: 'route-planning.png',
      },
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Live Tracking',
      description: 'Real-time GPS tracking with geofencing, ETA predictions, and delivery proof capture',
      detail: {
        title: 'Real-Time Fleet & Vehicle Tracking',
        description: 'Live GPS tracking with interactive map visualization showing vehicle location, speed, status, and IoT sensor data. Monitor your entire fleet with real-time updates and comprehensive sensor dashboards.',
        features: [
          'Live map view with vehicle markers and real-time positions',
          'Vehicle status tracking (Moving, Stopped, Idle) with color coding',
          'Driver information and current speed monitoring',
          'Route visualization with traveled vs remaining distance',
          'Traffic condition overlays (Light, Moderate, Heavy)',
          'IoT sensor integration (Temperature, Humidity, Door, Impact, Fuel, Tire Pressure)',
          'Real-time sensor readings with min/max thresholds',
          'Vehicle selection panel with status and location',
          'Satellite, Map, and Hybrid view options',
          'ETA calculations with 14+ hour precision',
        ],
        useCase: 'Fleet of 3 vehicles tracked in real-time: VEH-001 (Michael Rodriguez) moving at 65 mph from LA to Seattle covering 324 mi (811 mi remaining), VEH-003 (Sarah Chen) stopped in Houston, and VEH-007 (Robert Johnson) idle in Miami. Cargo temperature maintained at 38.2°C, humidity at 65%, door locked, all systems normal with 78% fuel and 32.5 PSI tire pressure - all updated within last 1-5 minutes.',
        screenshot: 'live-tracking.png',
      },
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Carrier Management',
      description: 'Multi-carrier integration, rate comparison, performance analytics, and automated tendering',
      detail: {
        title: 'Multi-Carrier Network Management',
        description: 'Comprehensive carrier relationship management with performance tracking, rate management, and service area monitoring. Manage your entire carrier network from a single unified platform.',
        features: [
          'Carrier portfolio overview with 6 total carriers (all active)',
          '166 active shipments across all carriers',
          'Average carrier rating of 4.6/5.0 stars',
          '93.0% on-time delivery rate (+2.3% this month)',
          'Carrier filtering by mode (Air, Ocean, Ground, Rail)',
          'Individual carrier scorecards with rating, active shipments, and on-time %',
          'Service area tracking (North America, Europe, International, Global)',
          'Contact management (email, phone, address)',
          'Carrier detail pages with performance history',
          'Rate management and contract tracking',
        ],
        useCase: 'Network of 6 carriers including FedEx Express (4.8 rating, 45 active, 96.5% on-time, Air), UPS (4.6 rating, 38 active, 94.2% on-time, Ground), and Maersk (4.7 rating, 12 active, 92.8% on-time, Ocean). FedEx alone handles $2.45M in total revenue with 1,250 completed shipments across North America and Europe, maintaining 96.5% success rate with 1-2 day typical transit.',
        screenshot: 'carriers.png',
      },
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Documentation',
      description: 'Digital BOL, POD, customs documents, and automated compliance documentation',
      detail: {
        title: 'Digital Documentation & Inbound Operations',
        description: 'Complete paperless documentation system with Advanced Shipping Notices (ASN), Bill of Lading, Packing Lists, and automated compliance tracking. Real-time receiving progress and document management.',
        features: [
          'Advanced Shipping Notice (ASN) with purchase order linking',
          'Real-time receiving progress tracking (64% completion - 320/500 items)',
          'Digital document management (ASN, BOL, Packing List)',
          'Automated document generation and PDF viewing',
          'Shipment detail tracking (ASN, PO, Tracking, Carrier, Vehicle, Dock)',
          'Supplier information management with contacts',
          'Item quantity and weight tracking (500 items, 10 pallets, 5,000 lbs)',
          'Timeline and milestone tracking',
          'Quality inspection workflows',
          'Quick action buttons (Continue Receiving, Scan Barcode, Print Labels)',
          'Special requirements flagging',
        ],
        useCase: 'Tech Components Inc. ASN-2024-001 linked to PO-2024-5678: 500 electronic components on 10 pallets (5,000 lbs) being received at DOCK-A1 BAY-03 via FedEx Freight (FXF-2024-8901, VEH-001). Receiving 64% complete with 320 items processed. Documents available: ASN, BOL, Packing List (inspection pending). Supplier contact Robert Chen accessible at +1 (408) 555-0123. Timeline shows scheduled appointment vs actual arrival with quality inspection required.',
        screenshot: 'inbound-details.png',
      },
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Smart Notifications',
      description: 'Proactive alerts for delays, exceptions, and milestone events via email, SMS, and webhooks',
      detail: {
        title: 'Smart Notifications',
        description: 'Stay informed with intelligent, proactive notifications tailored to each stakeholder.',
        features: [
          'Multi-channel notifications (email, SMS, push, webhook)',
          'Configurable escalation workflows',
          'Predictive delay alerts before they occur',
          'Custom notification rules by user role',
          'Delivery notifications to end customers',
          'Integration with Slack, Teams, and other platforms',
        ],
        useCase: 'A retail chain receives 100,000+ automated customer notifications daily, maintaining a 4.8/5 satisfaction score with proactive communication about delivery status.',
        screenshot: '/screenshots/notifications.png',
      },
    },
  ];

  const industries = {
    'E-commerce & Retail': {
      description: 'Handle high-volume parcel delivery with automated carrier selection and real-time customer notifications',
      stats: '1M+ parcels/month',
      challenges: [
        'Peak season volume spikes (up to 10x normal)',
        'Customer expectations for same-day/next-day delivery',
        'Managing returns and reverse logistics',
        'Multi-carrier coordination and rate shopping',
      ],
      solutions: [
        'Auto-scaling infrastructure handles peak volumes',
        'AI-powered carrier selection for optimal speed/cost',
        'Integrated returns portal with automated processing',
        'Real-time rate shopping across 100+ carriers',
      ],
      results: [
        '70% reduction in shipping costs through optimization',
        '99.2% on-time delivery rate',
        '45% improvement in customer satisfaction',
        '60% faster returns processing',
      ],
      screenshot: '/screenshots/ecommerce.png',
    },
    'Manufacturing': {
      description: 'Manage complex supply chains with JIT delivery, temperature-controlled shipments, and compliance tracking',
      stats: '99.5% on-time delivery',
      challenges: [
        'Just-in-time delivery precision requirements',
        'Temperature-sensitive raw materials',
        'Complex multi-leg international shipments',
        'Regulatory compliance across borders',
      ],
      solutions: [
        'Time-window routing with 15-minute precision',
        'IoT temperature monitoring with alerts',
        'Multi-modal shipment orchestration',
        'Automated customs and compliance documentation',
      ],
      results: [
        '99.5% on-time delivery rate for JIT operations',
        'Zero temperature excursions in 12 months',
        '50% reduction in customs delays',
        '$5M annual savings in expedited shipping',
      ],
      screenshot: '/screenshots/manufacturing.png',
    },
    '3PL & Freight Forwarding': {
      description: 'Multi-client operations with white-label portals, advanced billing, and margin optimization',
      stats: '500+ clients managed',
      challenges: [
        'Managing hundreds of clients on one platform',
        'Complex billing with multiple rate structures',
        'Maintaining margin visibility across clients',
        'Providing branded customer portals',
      ],
      solutions: [
        'Multi-tenant architecture with data isolation',
        'Flexible billing engine with custom rate tables',
        'Real-time margin analysis and optimization',
        'White-label customer portals with custom branding',
      ],
      results: [
        '500+ clients on single platform',
        '18% improvement in gross margins',
        '80% reduction in billing disputes',
        '95% customer portal adoption rate',
      ],
      screenshot: '/screenshots/3pl.png',
    },
  };

  const integrations = [
    'SAP', 'Oracle', 'Microsoft Dynamics', 'Salesforce', 'NetSuite', 'Shopify',
    'WooCommerce', 'Magento', 'UPS', 'FedEx', 'DHL', 'Royal Mail',
  ];

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
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
                Features
              </a>
              <a href="#capabilities" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
                Capabilities
              </a>
              <a href="#pricing" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
                Pricing
              </a>
              <Link to="/login">
                <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Side-by-Side Layout */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Clean Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLThoMnYxMmgtMlYyNnptLTEyIDBoMnYxMmgtMlYyNnptMTItMTJ2Mmg0djJoLTZ2LTRoMnptLTEyIDB2Mmg0djJoLTZ2LTRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Platform Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-300 shadow-lg">
              <Shield className="w-4 h-4 text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">
                Enterprise Transport Management System
              </span>
            </div>
          </div>

          {/* Side-by-Side Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Left: Product Messages */}
            <div className="relative">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 absolute translate-x-4 pointer-events-none'
                  }`}
                >
                  {/* Highlight Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-lg">
                    <Zap className="w-4 h-4" />
                    {slide.highlight}
                  </div>

                  {/* Hero Title with Gradient */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    <span className="text-gray-900">
                      {slide.title}
                    </span>
                    <br />
                    <span className="text-gray-700">
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link to="/login">
                      <Button className="group relative bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all transform hover:scale-105 shadow-2xl">
                        <span className="relative z-10 flex items-center">
                          Get Started Free
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </Link>
                    <button
                      onClick={() => setSelectedCapability(capabilities[index].detail)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-lg"
                    >
                      <PlayCircle className="w-5 h-5" />
                      View Live Demo
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium">14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium">No credit card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium">Cancel anytime</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Product Screenshot with Premium Frame */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white backdrop-blur-sm">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gray-900 rounded-3xl blur-2xl opacity-10"></div>

                {/* Screenshot Container */}
                <div className="relative bg-white rounded-xl overflow-hidden">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-auto"
                        loading="eager"
                      />
                    </div>
                  ))}

                  {/* Browser Chrome */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-100 to-transparent flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gray-900 rounded-full blur-3xl opacity-10 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gray-800 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Carousel Navigation - Centered Below */}
          <div className="flex justify-center gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-black w-16'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transform Your Operations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Measurable results that drive business growth and operational excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reduce Transit Times</h3>
              <p className="text-gray-600 text-sm">AI-powered route optimization cuts delivery times by up to 30%</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lower Operating Costs</h3>
              <p className="text-gray-600 text-sm">Automated processes and carrier optimization reduce costs by 25%</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Improve Customer Satisfaction</h3>
              <p className="text-gray-600 text-sm">Real-time tracking and proactive notifications enhance customer experience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Data-Driven Decisions</h3>
              <p className="text-gray-600 text-sm">Comprehensive analytics provide actionable insights for continuous improvement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Premium Design */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Platform Capabilities
            </div>
            <h2 className="text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Built for Modern Logistics
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade platform integrating AI, IoT, and blockchain for next-generation transport management and supply chain excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-900 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2"
                onClick={() => setSelectedFeature(feature.detail)}
              >
                {/* Gradient Glow on Hover */}
                <div className="absolute inset-0 bg-gray-900/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  {/* Icon with Black Background */}
                  <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section - Premium Design */}
      <section id="capabilities" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Complete Solution
            </div>
            <h2 className="text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Complete Platform Capabilities
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to run world-class transport operations with real-time visibility, intelligent automation, and data-driven insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-900 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedCapability(capability.detail)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 flex-shrink-0 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all">
                    {capability.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors">
                      {capability.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {capability.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:gap-3 transition-all">
                      View details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry Solutions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored for the unique needs of different industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(industries).map(([title, data], index) => (
              <Card
                key={index}
                className="p-8 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelectedIndustry(title)}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 mb-4">{data.description}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-900 mb-4">
                  <TrendingUp className="w-4 h-4" />
                  {data.stats}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  View case study <ExternalLink className="w-4 h-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Premium Design */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Black Background */}
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLThoMnYxMmgtMlYyNnptLTEyIDBoMnYxMmgtMlYyNnptMTItMTJ2Mmg0djJoLTZ2LTRoMnptLTEyIDB2Mmg0djJoLTZ2LTRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300">
              Powering logistics operations across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
                <p className="text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">
                  100<span className="text-gray-300">+</span>
                </p>
                <p className="text-gray-100 font-semibold text-lg">Global Carriers</p>
                <p className="text-gray-300 text-sm mt-2">Integrated partnerships</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
                <p className="text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">
                  4
                </p>
                <p className="text-gray-100 font-semibold text-lg">Continents</p>
                <p className="text-gray-300 text-sm mt-2">Global coverage</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
                <p className="text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">
                  99.9<span className="text-gray-300">%</span>
                </p>
                <p className="text-gray-100 font-semibold text-lg">Uptime SLA</p>
                <p className="text-gray-300 text-sm mt-2">Enterprise reliability</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
                <p className="text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">
                  24<span className="text-gray-300">/</span>7
                </p>
                <p className="text-gray-100 font-semibold text-lg">Support</p>
                <p className="text-gray-300 text-sm mt-2">Always available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with your existing tech stack through our extensive integration library
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-gray-900 hover:shadow-md transition-all"
              >
                {integration}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom integration?</p>
            <Link to="/login">
              <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                Contact Our API Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your data security is our top priority. We maintain the highest standards of data protection and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">ISO 27001 Certified</h3>
              <p className="text-gray-600 text-sm">Information security management standards</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">GDPR Compliant</h3>
              <p className="text-gray-600 text-sm">Full compliance with EU data protection regulations</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-gray-600 text-sm">Independent audit of security controls</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include 24/7 support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">For small businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$499</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 500 shipments/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">5 user accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                  Start Free Trial
                </Button>
              </Link>
            </Card>

            <Card className="p-8 border-2 border-black shadow-xl transform scale-105">
              <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$1,499</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 5,000 shipments/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced analytics & AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">API access</span>
                </li>
              </ul>
              <Link to="/login" className="block">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </Card>

            <Card className="p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large operations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited shipments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 phone support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">SLA guarantees</span>
                </li>
              </ul>
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                  Contact Sales
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Design */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Black Background */}
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLThoMnYxMmgtMlYyNnptLTEyIDBoMnYxMmgtMlYyNnptMTItMTJ2Mmg0djJoLTZ2LTRoMnptLTEyIDB2Mmg0djJoLTZ2LTRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-700 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold mb-8">
            <Zap className="w-4 h-4" />
            Start Your Digital Transformation
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
            Ready to Transform Your
            <br />
            <span className="text-gray-300">
              Logistics Operations?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join leading enterprises using THG Ingenuity TMS to optimize their global transport operations.
            Start your <span className="text-white font-bold">14-day free trial</span> today—no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/login">
              <Button className="group relative bg-white hover:bg-gray-100 text-gray-900 px-12 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl">
                <span className="flex items-center">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-transparent border-2 border-white/30 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white px-12 py-5 rounded-xl font-bold text-lg transition-all shadow-lg">
                Schedule Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">THG Ingenuity TMS</p>
                  <p className="text-xs text-gray-600">Part of THG Ingenuity</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Enterprise transport management for the modern supply chain.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#capabilities" className="hover:text-gray-900">Capabilities</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#integrations" className="hover:text-gray-900">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">Security</a></li>
                <li><a href="#" className="hover:text-gray-900">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              © 2025 THG Ingenuity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedFeature(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">{selectedFeature.title}</h2>
              <button onClick={() => setSelectedFeature(null)} className="text-gray-500 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-xl text-gray-600 mb-8">{selectedFeature.description}</p>

              {/* Screenshot */}
              {selectedFeature.screenshot && (
                <div className="rounded-lg overflow-hidden shadow-2xl mb-8 border border-gray-200">
                  <img
                    src={`/screenshots/${selectedFeature.screenshot}`}
                    alt={selectedFeature.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-semibold">Product Screenshot</p>
                      <p className="text-gray-400 text-sm">{selectedFeature.screenshot}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {selectedFeature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Capabilities</h3>
                  <ul className="space-y-3">
                    {selectedFeature.capabilities.map((capability, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link to="/login" className="flex-1">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capability Detail Modal */}
      {selectedCapability && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCapability(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">{selectedCapability.title}</h2>
              <button onClick={() => setSelectedCapability(null)} className="text-gray-500 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-xl text-gray-600 mb-8">{selectedCapability.description}</p>

              {/* Screenshot */}
              {selectedCapability.screenshot && (
                <div className="rounded-lg overflow-hidden shadow-2xl mb-8 border border-gray-200">
                  <img
                    src={`/screenshots/${selectedCapability.screenshot}`}
                    alt={selectedCapability.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-semibold">Module Screenshot</p>
                      <p className="text-gray-400 text-sm">{selectedCapability.screenshot}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {selectedCapability.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Real-World Success</h3>
                <p className="text-gray-700">{selectedCapability.useCase}</p>
              </div>

              <div className="flex gap-4">
                <Link to="/login" className="flex-1">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Try It Now
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Detail Modal */}
      {selectedIndustry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedIndustry(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">{selectedIndustry}</h2>
              <button onClick={() => setSelectedIndustry(null)} className="text-gray-500 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-xl text-gray-600 mb-4">{industries[selectedIndustry].description}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-900 mb-8">
                <TrendingUp className="w-4 h-4" />
                {industries[selectedIndustry].stats}
              </div>

              {/* Screenshot */}
              {industries[selectedIndustry].screenshot && (
                <div className="rounded-lg overflow-hidden shadow-2xl mb-8 border border-gray-200">
                  <img
                    src={`/screenshots/${industries[selectedIndustry].screenshot}`}
                    alt={selectedIndustry}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-semibold">Industry Solution</p>
                      <p className="text-gray-400 text-sm">{industries[selectedIndustry].screenshot}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges</h3>
                  <ul className="space-y-3">
                    {industries[selectedIndustry].challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        </div>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Solutions</h3>
                  <ul className="space-y-3">
                    {industries[selectedIndustry].solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Results Achieved</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {industries[selectedIndustry].results.map((result, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Link to="/login" className="flex-1">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                    Download Case Study
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
