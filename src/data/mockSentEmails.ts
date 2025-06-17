import { SentEmail } from '../types/email';

export const sentEmails: SentEmail[] = [
  {
    id: 'sent-1',
    recipient: 'team@company.com',
    subject: 'Q4 Performance Review Results',
    sentAt: '2 hours ago',
    opens: 8,
    analytics: {
      opens: [
        {
          timestamp: '2 hours ago',
          location: 'San Francisco, CA',
          device: 'Desktop',
        },
        {
          timestamp: '1 hour ago',
          location: 'New York, NY',
          device: 'Mobile',
        },
        {
          timestamp: '45 min ago',
          location: 'Los Angeles, CA',
          device: 'Desktop',
        },
        {
          timestamp: '30 min ago',
          location: 'Chicago, IL',
          device: 'Tablet',
        },
        {
          timestamp: '15 min ago',
          location: 'Austin, TX',
          device: 'Mobile',
        },
        {
          timestamp: '10 min ago',
          location: 'Seattle, WA',
          device: 'Desktop',
        },
        {
          timestamp: '5 min ago',
          location: 'Boston, MA',
          device: 'Mobile',
        },
        {
          timestamp: '2 min ago',
          location: 'Denver, CO',
          device: 'Desktop',
        },
      ],
      devices: [
        { type: 'Desktop', count: 4 },
        { type: 'Mobile', count: 3 },
        { type: 'Tablet', count: 1 },
      ],
      locations: [
        { city: 'San Francisco, CA', count: 2 },
        { city: 'New York, NY', count: 2 },
        { city: 'Los Angeles, CA', count: 1 },
        { city: 'Chicago, IL', count: 1 },
        { city: 'Austin, TX', count: 1 },
        { city: 'Seattle, WA', count: 1 },
      ],
    },
  },
  {
    id: 'sent-2',
    recipient: 'sarah.chen@example.com',
    subject: 'Project Timeline Update',
    sentAt: '1 day ago',
    opens: 12,
    analytics: {
      opens: [
        {
          timestamp: '1 day ago',
          location: 'San Francisco, CA',
          device: 'Desktop',
        },
        {
          timestamp: '22 hours ago',
          location: 'San Francisco, CA',
          device: 'Mobile',
        },
        {
          timestamp: '18 hours ago',
          location: 'San Francisco, CA',
          device: 'Desktop',
        },
        {
          timestamp: '12 hours ago',
          location: 'San Francisco, CA',
          device: 'Mobile',
        },
        {
          timestamp: '8 hours ago',
          location: 'San Francisco, CA',
          device: 'Desktop',
        },
      ],
      devices: [
        { type: 'Desktop', count: 7 },
        { type: 'Mobile', count: 5 },
      ],
      locations: [
        { city: 'San Francisco, CA', count: 12 },
      ],
    },
  },
  {
    id: 'sent-3',
    recipient: 'clients@agency.com',
    subject: 'Monthly Newsletter - December 2024',
    sentAt: '3 days ago',
    opens: 45,
    analytics: {
      opens: [
        {
          timestamp: '3 days ago',
          location: 'New York, NY',
          device: 'Desktop',
        },
        {
          timestamp: '3 days ago',
          location: 'Los Angeles, CA',
          device: 'Mobile',
        },
        {
          timestamp: '2 days ago',
          location: 'Chicago, IL',
          device: 'Desktop',
        },
        {
          timestamp: '2 days ago',
          location: 'Houston, TX',
          device: 'Tablet',
        },
        {
          timestamp: '1 day ago',
          location: 'Miami, FL',
          device: 'Mobile',
        },
      ],
      devices: [
        { type: 'Desktop', count: 25 },
        { type: 'Mobile', count: 15 },
        { type: 'Tablet', count: 5 },
      ],
      locations: [
        { city: 'New York, NY', count: 12 },
        { city: 'Los Angeles, CA', count: 8 },
        { city: 'Chicago, IL', count: 7 },
        { city: 'Houston, TX', count: 6 },
        { city: 'Miami, FL', count: 5 },
        { city: 'Seattle, WA', count: 4 },
        { city: 'Boston, MA', count: 3 },
      ],
    },
  },
  {
    id: 'sent-4',
    recipient: 'investors@startup.com',
    subject: 'Funding Round Update',
    sentAt: '1 week ago',
    opens: 23,
    analytics: {
      opens: [
        {
          timestamp: '1 week ago',
          location: 'Palo Alto, CA',
          device: 'Desktop',
        },
        {
          timestamp: '6 days ago',
          location: 'San Francisco, CA',
          device: 'Desktop',
        },
        {
          timestamp: '5 days ago',
          location: 'New York, NY',
          device: 'Mobile',
        },
        {
          timestamp: '4 days ago',
          location: 'Boston, MA',
          device: 'Desktop',
        },
        {
          timestamp: '3 days ago',
          location: 'Los Angeles, CA',
          device: 'Tablet',
        },
      ],
      devices: [
        { type: 'Desktop', count: 15 },
        { type: 'Mobile', count: 6 },
        { type: 'Tablet', count: 2 },
      ],
      locations: [
        { city: 'Palo Alto, CA', count: 8 },
        { city: 'San Francisco, CA', count: 6 },
        { city: 'New York, NY', count: 4 },
        { city: 'Boston, MA', count: 3 },
        { city: 'Los Angeles, CA', count: 2 },
      ],
    },
  },
  {
    id: 'sent-5',
    recipient: 'marketing@company.com',
    subject: 'Campaign Performance Report',
    sentAt: '2 weeks ago',
    opens: 18,
    analytics: {
      opens: [
        {
          timestamp: '2 weeks ago',
          location: 'Austin, TX',
          device: 'Desktop',
        },
        {
          timestamp: '13 days ago',
          location: 'Austin, TX',
          device: 'Mobile',
        },
        {
          timestamp: '12 days ago',
          location: 'Denver, CO',
          device: 'Desktop',
        },
        {
          timestamp: '11 days ago',
          location: 'Portland, OR',
          device: 'Desktop',
        },
        {
          timestamp: '10 days ago',
          location: 'Phoenix, AZ',
          device: 'Mobile',
        },
      ],
      devices: [
        { type: 'Desktop', count: 12 },
        { type: 'Mobile', count: 6 },
      ],
      locations: [
        { city: 'Austin, TX', count: 5 },
        { city: 'Denver, CO', count: 4 },
        { city: 'Portland, OR', count: 3 },
        { city: 'Phoenix, AZ', count: 3 },
        { city: 'Salt Lake City, UT', count: 2 },
        { city: 'Las Vegas, NV', count: 1 },
      ],
    },
  },
];