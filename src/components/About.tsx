import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Github, Linkedin, Globe, Sparkles, Code, Brain, Zap, Target, Users, TrendingUp } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Intelligence",
      description: "Advanced email categorization and summarization using OpenAI GPT-4"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Instant email open tracking with detailed analytics and insights"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Comprehensive tracking with device detection and engagement metrics"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gmail Integration",
      description: "Seamless OAuth integration with Gmail for secure email management"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Insights",
      description: "Detailed reports on email engagement and communication patterns"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Tech Stack",
      description: "Built with React, Node.js, Supabase, and cutting-edge technologies"
    }
  ];

  const techStack = [
    { name: "React", color: "from-blue-400 to-blue-600" },
    { name: "TypeScript", color: "from-blue-500 to-blue-700" },
    { name: "Node.js", color: "from-green-400 to-green-600" },
    { name: "Express", color: "from-gray-400 to-gray-600" },
    { name: "Supabase", color: "from-emerald-400 to-emerald-600" },
    { name: "OpenAI", color: "from-purple-400 to-purple-600" },
    { name: "Tailwind CSS", color: "from-cyan-400 to-cyan-600" },
    { name: "Gmail API", color: "from-red-400 to-red-600" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={onBack}
            className="group flex items-center gap-3 mb-8 text-white/80 hover:text-white transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Project Description - Now First */}
        <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">About Mailed</h2>
              <p className="text-white/60 text-lg max-w-3xl mx-auto">
                A cutting-edge email tracking and management solution that leverages AI to provide intelligent 
                email categorization, real-time tracking analytics, and seamless Gmail integration.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 ${
                    activeFeature === index ? 'border-purple-500/50 bg-purple-500/10' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                    activeFeature === index ? 'animate-pulse' : ''
                  }`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Built with Bolt.new Section - Now Second */}
        <div className={`transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-20 relative">
            <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20 relative overflow-hidden">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-shimmer"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center mb-6">
                  {/* Animated Bolt Icon */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl flex items-center justify-center animate-bounce shadow-2xl shadow-yellow-500/50">
                      <Zap className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    {/* Lightning effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/50 via-orange-400/50 to-red-400/50 rounded-3xl blur-xl animate-pulse"></div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-red-400/30 rounded-full blur-2xl animate-ping"></div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text mb-4">
                  ⚡ Built by Divyansh with Bolt.new ⚡
                </h2>
                
                <p className="text-lg text-white/80 mb-4 max-w-2xl mx-auto">
                  <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">I</span> rapidly prototyped and developed this entire 
                  full-stack application using <span className="font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">Bolt.new</span> - 
                  showcasing how modern AI development tools can accelerate complex project creation.
                </p>

                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-purple-400/20">
                  <p className="text-white/90 text-sm">
                    <span className="font-semibold text-purple-300">"As a VIT student passionate about AI and full-stack development, 
                    I leveraged Bolt.new to rapidly build Mailed - demonstrating how AI-powered tools can help developers 
                    create sophisticated applications with advanced features like email tracking, real-time analytics, and intelligent categorization."</span>
                  </p>
                  <p className="text-purple-300 text-xs mt-2 font-medium">- Divyansh Khurana, Developer</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {[
                    "🚀 Rapid Prototyping",
                    "🤖 AI-Powered Development", 
                    "⚡ Full-Stack in Hours",
                    "🎯 Modern Tech Integration"
                  ].map((feature, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/30">
                      <span className="text-yellow-100 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-white/60">
                  <span className="font-semibold text-yellow-400">For Judges:</span> This project demonstrates the synergy between human creativity 
                  and AI-powered development tools, resulting in a production-ready application with enterprise-level features.
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-1000"></div>
              <div className="absolute top-1/2 right-8 w-1 h-1 bg-red-400 rounded-full animate-ping delay-500"></div>
            </div>
          </div>
        </div>

        {/* Hero Section - Now Third (Personal Info) */}
        <div className={`transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Profile Section */}
            <div className="text-center lg:text-left">
              <div className="relative mb-8 lg:mb-0">
                <div className="w-64 h-64 mx-auto lg:mx-0 relative">
                  {/* Animated rings around photo */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 animate-spin-slow"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-spin-slow-reverse"></div>
                  
                  {/* Photo container */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-1 overflow-hidden">
                    <img
                      src="/images/divyansh-photo.jpg"
                      alt="Divyansh Khurana"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to a gradient background if image fails to load
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">DK</span>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce delay-500">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Divyansh Khurana
                </h1>
                <p className="text-xl text-purple-300 font-medium mb-2">Full-Stack Developer & AI Enthusiast</p>
                <p className="text-white/60 text-lg">Student at Vellore Institute of Technology, Vellore</p>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 text-lg leading-relaxed">
                  Welcome to <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-bold">Mailed</span> - 
                  a revolutionary email tracking and management platform that combines the power of artificial intelligence 
                  with modern web technologies to transform how you interact with your emails.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                {[
                  { 
                    icon: <Mail className="w-5 h-5" />, 
                    label: "Email", 
                    color: "from-red-500 to-pink-500",
                    url: "mailto:divyanshkhurana06@gmail.com"
                  },
                  { 
                    icon: <Github className="w-5 h-5" />, 
                    label: "GitHub", 
                    color: "from-gray-700 to-gray-900",
                    url: "https://github.com/divyanshkhurana06"
                  },
                  { 
                    icon: <Linkedin className="w-5 h-5" />, 
                    label: "LinkedIn", 
                    color: "from-blue-600 to-blue-800",
                    url: "https://www.linkedin.com/in/divyansh-khurana-6891a7264/"
                  },
                  { 
                    icon: <Globe className="w-5 h-5" />, 
                    label: "Portfolio", 
                    color: "from-purple-600 to-purple-800",
                    url: "#",
                    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                ].map((social, index) => (
                  social.onClick ? (
                    <button
                      key={index}
                      onClick={social.onClick}
                      className={`group w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25`}
                      title={social.label}
                    >
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </div>
                    </button>
                  ) : (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25`}
                      title={social.label}
                    >
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </div>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className={`transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built With Modern Technologies</h2>
            <p className="text-white/60 text-lg">Powered by cutting-edge tools and frameworks</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-4 bg-gradient-to-r ${tech.color} rounded-2xl text-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25`}>
                  <div className="text-white font-semibold text-sm">{tech.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Email Experience?</h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Join the future of email management with AI-powered insights, real-time tracking, and intelligent automation.
            </p>
            <button
              onClick={onBack}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              <span className="flex items-center gap-2">
                Get Started Now
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom CSS for animations (add to index.css)
const styles = `
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-slow-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-slow-reverse {
  animation: spin-slow-reverse 15s linear infinite;
}
`; 