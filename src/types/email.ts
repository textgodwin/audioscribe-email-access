export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Email {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  attachments?: EmailAttachment[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  priority: 'low' | 'normal' | 'high';
}

export interface EmailFolder {
  id: string;
  name: string;
  count: number;
  unreadCount: number;
}

export type EmailView = 'inbox' | 'sent' | 'drafts' | 'trash' | 'compose';