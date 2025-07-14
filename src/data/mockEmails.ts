import { Email, EmailFolder } from '../types/email';

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'sarah.johnson@company.com',
    to: ['user@email.com'],
    subject: 'Project Update - Q4 Goals',
    body: 'Hi there, I wanted to provide you with an update on our Q4 project goals. We have successfully completed 75% of our planned objectives and are on track to meet our December deadline. The team has been working diligently on the accessibility features, and I believe you will be pleased with the progress. Please let me know if you have any questions or need additional information.',
    date: new Date('2024-01-15T10:30:00'),
    isRead: false,
    isStarred: true,
    folder: 'inbox',
    priority: 'high',
    attachments: [
      {
        id: 'att1',
        name: 'project-report.pdf',
        size: 245760,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: '2',
    from: 'support@accessibilitytools.com',
    to: ['user@email.com'],
    subject: 'New Screen Reader Update Available',
    body: 'Dear valued customer, we are excited to announce that version 3.2 of our screen reader software is now available for download. This update includes improved voice commands, better web navigation, and enhanced email reading capabilities. The update is free for all existing customers and can be downloaded from your account dashboard.',
    date: new Date('2024-01-14T14:15:00'),
    isRead: false,
    isStarred: false,
    folder: 'inbox',
    priority: 'normal'
  },
  {
    id: '3',
    from: 'team@blindassociation.org',
    to: ['user@email.com'],
    subject: 'Upcoming Accessibility Workshop',
    body: 'Hello, we are organizing a workshop on digital accessibility next month. The workshop will cover the latest web accessibility standards, assistive technology updates, and practical tips for developers. We would love to have you join us for this educational event. Registration is free and refreshments will be provided.',
    date: new Date('2024-01-13T09:45:00'),
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    priority: 'normal'
  },
  {
    id: '4',
    from: 'user@email.com',
    to: ['colleague@company.com'],
    subject: 'Re: Meeting Notes',
    body: 'Thank you for sharing the meeting notes. I have reviewed them and have a few suggestions for the accessibility improvements we discussed. I will prepare a detailed response by end of week. Looking forward to implementing these changes.',
    date: new Date('2024-01-12T16:20:00'),
    isRead: true,
    isStarred: false,
    folder: 'sent',
    priority: 'normal'
  },
  {
    id: '5',
    from: 'user@email.com',
    to: ['family@email.com'],
    subject: 'Weekend Plans',
    body: 'Hi everyone, I hope you are all doing well. I wanted to reach out about our weekend plans. Would Saturday afternoon work for everyone? We could meet at the usual place around 2 PM. Let me know if this works for your schedules.',
    date: new Date('2024-01-11T11:30:00'),
    isRead: true,
    isStarred: false,
    folder: 'sent',
    priority: 'low'
  }
];

export const mockFolders: EmailFolder[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    count: 25,
    unreadCount: 2
  },
  {
    id: 'sent',
    name: 'Sent',
    count: 18,
    unreadCount: 0
  },
  {
    id: 'drafts',
    name: 'Drafts',
    count: 3,
    unreadCount: 0
  },
  {
    id: 'trash',
    name: 'Trash',
    count: 7,
    unreadCount: 0
  }
];