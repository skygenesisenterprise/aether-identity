'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Cloud, 
  MessageSquare, 
  Users, 
  Shield, 
  Truck, 
  Plane,
  ChevronRight,
  ArrowRight,
  GitBranch,
  Crown
} from 'lucide-react';

interface Subsidiary {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const subsidiaries: Subsidiary[] = [
  {
    name: 'Vaelix Bank',
    description: 'Financial services & sovereign banking',
    icon: <Building className="w-6 h-6" />,
    color: 'blue'
  },
  {
    name: 'Zenth Cloud',
    description: 'Cloud & edge infrastructure',
    icon: <Cloud className="w-6 h-6" />,
    color: 'cyan'
  },
  {
    name: 'Astron Collection',
    description: 'Communication & community platforms',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'purple'
  },
  {
    name: 'Aether Office',
    description: 'Productivity & collaboration suite',
    icon: <Users className="w-6 h-6" />,
    color: 'green'
  },
  {
    name: 'Aether Security',
    description: 'Zero-Trust identity & compliance',
    icon: <Shield className="w-6 h-6" />,
    color: 'red'
  },
  {
    name: 'Sky Logistics',
    description: 'Supply chain & automation',
    icon: <Truck className="w-6 h-6" />,
    color: 'orange'
  },
  {
    name: 'Sky Aerospace',
    description: 'Aeronautics & orbital technologies',
    icon: <Plane className="w-6 h-6" />,
    color: 'indigo'
  }
];

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      hover: 'hover:bg-blue-500/10 hover:border-blue-500/50'
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      hover: 'hover:bg-cyan-500/10 hover:border-cyan-500/50'
    },
    purple: {
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      hover: 'hover:bg-purple-500/10 hover:border-purple-500/50'
    },
    green: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      hover: 'hover:bg-green-500/10 hover:border-green-500/50'
    },
    red: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      hover: 'hover:bg-red-500/10 hover:border-red-500/50'
    },
    orange: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      hover: 'hover:bg-orange-500/10 hover:border-orange-500/50'
    },
    indigo: {
      bg: 'bg-indigo-500/20',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      hover: 'hover:bg-indigo-500/10 hover:border-indigo-500/50'
    }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export default function OrganizationalStructure() {
  const [hoveredSubsidiary, setHoveredSubsidiary] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Organizational Structure
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              An overview of the divisions and subsidiaries that shape the Sky Genesis Enterprise ecosystem.
            </p>
          </div>

          {/* Compact Organizational Overview */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              {/* Parent Entity */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                  <Crown className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-white font-semibold">Sky Genesis Enterprise</span>
                  <span className="text-gray-400 ml-2">(Parent Entity)</span>
                </div>
              </div>

              {/* Connection Lines */}
              <div className="relative mb-8">
                <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent transform -translate-x-1/2"></div>
                <div className="absolute left-1/2 top-8 w-32 h-0.5 bg-white/20 transform -translate-x-1/2"></div>
                <div className="flex justify-center space-x-8">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
              </div>

              {/* Strategic Divisions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <GitBranch className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm text-gray-300">Financial Services</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <GitBranch className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm text-gray-300">Technology Solutions</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <GitBranch className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-sm text-gray-300">Industrial Operations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subsidiary Grid */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subsidiaries.map((subsidiary) => {
                const colors = getColorClasses(subsidiary.color);
                const isHovered = hoveredSubsidiary === subsidiary.name;
                
                return (
                  <div
                    key={subsidiary.name}
                    className={`bg-white/5 backdrop-blur-sm border ${colors.border} rounded-xl p-6 cursor-pointer transition-all duration-300 transform ${colors.hover} ${
                      isHovered ? 'scale-105 -translate-y-1' : ''
                    }`}
                    onMouseEnter={() => setHoveredSubsidiary(subsidiary.name)}
                    onMouseLeave={() => setHoveredSubsidiary(null)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <div className={colors.text}>
                          {subsidiary.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-2 truncate">
                          {subsidiary.name}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {subsidiary.description}
                        </p>
                      </div>
                    </div>
                    
                    {isHovered && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <button className={`flex items-center text-sm ${colors.text} font-medium`}>
                          Learn more <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Micro-Governance Summary */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">Micro-Governance Framework</h3>
              </div>
              
              <p className="text-gray-300 leading-relaxed text-center mb-8">
                Each subsidiary operates independently while maintaining alignment with the group&apos;s sovereign digital mission. 
                This decentralized approach enables operational agility and specialized expertise, ensuring each business unit 
                can respond quickly to market demands while upholding our collective commitment to European digital sovereignty, 
                security, and innovation excellence.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">7</div>
                  <div className="text-sm text-gray-400">Subsidiaries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">3</div>
                  <div className="text-sm text-gray-400">Divisions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-gray-400">Alignment</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Oversight</div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional CTA */}
          <div className="text-center mt-12">
            <Link 
              href="/company/subsidiaries" 
              className="inline-flex items-center bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Our Ecosystem
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}