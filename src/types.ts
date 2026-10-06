export type CompanyId = 'COTG' | 'SFG';

export interface CompanyConfig {
  id: CompanyId;
  name: string;
  code: string;
  email: string;
  operationsPhone: string;
  organicCallNumber: string;
  googleReviewUrl: string;
  senderName: string;
  dailyLimit: number;
  retentionMonths: number;
}

export type Channel = 'Email' | 'SMS' | 'Both';

export type JobStatus = 'Not sent' | 'Sent' | 'Opened' | 'Private feedback received';

export interface JobRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientFirstName: string;
  clientEmail: string;
  clientPhone: string;
  suburb: string;
  serviceType: string;
  jobDate: string;
  channel: Channel;
  status: JobStatus;
  sentAt?: string;
  openedAt?: string;
  alreadySentCheckFail?: boolean; // Demo fails check
}

export type FeedbackStatus = 'New' | 'In progress' | 'Resolved';

export interface PrivateFeedbackItem {
  id: string;
  jobId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  suburb: string;
  serviceType: string;
  jobDate: string;
  receivedAt: string;
  replyDueText: string;
  isUrgentDueToday: boolean;
  status: FeedbackStatus;
  message: string;
  resolutionNote?: string;
  alertSentSummary: string;
}

export interface CallRecord {
  id: string;
  callerNumber: string;
  callerLabel?: string;
  dateTime: string;
  durationSeconds: number;
  durationDisplay: string;
  status: 'Answered' | 'Missed';
  isAfterHours: boolean; // Outside 6:00 AM - 10:00 PM AEST
  isBooked: boolean;
  calledBack: boolean;
  period: 'this_week' | 'this_month';
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export type SystemMode = 'Off' | 'Manual' | 'Automatic';
