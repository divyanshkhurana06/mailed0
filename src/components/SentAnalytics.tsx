import React, { useState } from 'react';
import { BarChart3, Eye, MapPin, Smartphone, Monitor, Tablet, TrendingUp } from 'lucide-react';
import { sentEmails } from '../data/mockSentEmails';
import { createConfetti } from '../utils/confetti';

interface SentAnalyticsProps {
  searchQuery: string;
}

export const SentAnalytics: React.FC<SentAnalyticsProps> = ({ searchQuery }) => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const filteredEmails = sentEmails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmailClick = (emailId: string, element: HTMLElement) => {
    setSelectedEmail(selectedEmail === emailId ? null : emailId);
    createConfetti(element);
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getOpenRate = (opens: number, sent: number) => {
    return Math.round((opens / sent) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Sent Analytics</h2>
          <p className="text-white/60">Track engagement and performance of your sent emails</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
            <TrendingUp className="w-4 h-4" />
            Average Open Rate
          </div>
          <div className="text-2xl font-bold text-white">73%</div>
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        {filteredEmails.map((email, index) => (
          <div
            key={email.id}
            className="group relative"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInRight 0.6s ease-out forwards',
            }}
          >
            {/* Main Email Card */}
            <div
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02]"
              onClick={(e) => handleEmailClick(email.id, e.currentTarget)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{email.subject}</h3>
                  <p className="text-white/60 text-sm">To: {email.recipient}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-white/60 text-sm mb-1">{email.sentAt}</div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">{email.opens} opens</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-white/60">Open Rate:</span>
                  <span className="text-blue-400 font-semibold">
                    {getOpenRate(email.opens, 1)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-white/60">Locations:</span>
                  <span className="text-green-400 font-semibold">
                    {email.analytics.locations.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-orange-400" />
                  <span className="text-white/60">Devices:</span>
                  <span className="text-orange-400 font-semibold">
                    {email.analytics.devices.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Analytics */}
            {selectedEmail === email.id && (
              <div className="mt-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-slideDown">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Detailed Analytics
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Opens Timeline */}
                  <div>
                    <h5 className="text-white/80 font-medium mb-3">Recent Opens</h5>
                    <div className="space-y-3">
                      {email.analytics.opens.slice(0, 5).map((open, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(open.device)}
                            <div>
                              <div className="text-white text-sm">{open.timestamp}</div>
                              <div className="text-white/60 text-xs">{open.location}</div>
                            </div>
                          </div>
                          <div className="text-purple-400 text-xs font-medium">
                            {open.device}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device & Location Stats */}
                  <div className="space-y-6">
                    {/* Devices */}
                    <div>
                      <h5 className="text-white/80 font-medium mb-3">Devices</h5>
                      <div className="space-y-2">
                        {email.analytics.devices.map((device, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device.type)}
                              <span className="text-white/80 text-sm">{device.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(device.count / email.opens) * 100}%` }}
                                />
                              </div>
                              <span className="text-white/60 text-xs w-8">{device.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <h5 className="text-white/80 font-medium mb-3">Top Locations</h5>
                      <div className="space-y-2">
                        {email.analytics.locations.slice(0, 4).map((location, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-400" />
                              <span className="text-white/80 text-sm">{location.city}</span>
                            </div>
                            <span className="text-green-400 text-xs font-medium">
                              {location.count} opens
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-white/60 text-lg mb-2">No sent emails found</h3>
          <p className="text-white/40">Start sending emails to see analytics here</p>
        </div>
      )}
    </div>
  );
};