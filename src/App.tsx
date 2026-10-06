import React, { useState } from 'react';
import { Banner } from './components/Banner';
import { Header } from './components/Header';
import { Sidebar, ScreenId } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { OverviewView } from './views/OverviewView';
import { ReviewRequestsView } from './views/ReviewRequestsView';
import { PrivateFeedbackView } from './views/PrivateFeedbackView';
import { CallTrackingView } from './views/CallTrackingView';
import { SettingsView } from './views/SettingsView';
import { 
  COMPANIES, 
  INITIAL_JOBS_COTG, 
  INITIAL_JOBS_SFG, 
  INITIAL_FEEDBACK_COTG, 
  INITIAL_FEEDBACK_SFG, 
  INITIAL_CALLS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { 
  CompanyId, 
  JobRequest, 
  PrivateFeedbackItem, 
  CallRecord, 
  AuditLogItem, 
  SystemMode, 
  Channel, 
  FeedbackStatus 
} from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [activeCompanyId, setActiveCompanyId] = useState<CompanyId>('COTG');
  
  // Independent data stores per company
  const [jobsCOTG, setJobsCOTG] = useState<JobRequest[]>(INITIAL_JOBS_COTG);
  const [jobsSFG, setJobsSFG] = useState<JobRequest[]>(INITIAL_JOBS_SFG);
  
  const [feedbackCOTG, setFeedbackCOTG] = useState<PrivateFeedbackItem[]>(INITIAL_FEEDBACK_COTG);
  const [feedbackSFG, setFeedbackSFG] = useState<PrivateFeedbackItem[]>(INITIAL_FEEDBACK_SFG);

  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  
  const [systemMode, setSystemMode] = useState<SystemMode>('Off');
  const [testModeEnabled, setTestModeEnabled] = useState<boolean>(true);

  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState<PrivateFeedbackItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Company helper
  const activeCompany = COMPANIES[activeCompanyId];
  const currentJobs = activeCompanyId === 'COTG' ? jobsCOTG : jobsSFG;
  const currentFeedback = activeCompanyId === 'COTG' ? feedbackCOTG : feedbackSFG;

  const handleCompanyChange = (companyId: CompanyId) => {
    setActiveCompanyId(companyId);
    showToast(`Switched active workspace to ${COMPANIES[companyId].name}`, 'info');
  };

  // Handle Review Request Send
  const handleSendRequest = (jobId: string, channel: Channel) => {
    const updateJob = (list: JobRequest[]) =>
      list.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: 'Sent' as const,
              channel,
              sentAt: 'Just now (Demo)',
            }
          : job
      );

    if (activeCompanyId === 'COTG') {
      setJobsCOTG(updateJob);
    } else {
      setJobsSFG(updateJob);
    }

    // Required toast exact text: "Demo: request not really sent"
    showToast('Demo: request not really sent', 'info');

    // Add audit log
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      adminName: 'Operations Staff',
      role: 'Staff Member',
      action: 'Review request dispatched',
      details: `Dispatched ${channel} invitation for job ${jobId} (${activeCompany.name})`,
      timestamp: 'Today, Just now',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handle Private Feedback Status Update
  const handleUpdateFeedbackStatus = (id: string, newStatus: FeedbackStatus, note?: string) => {
    const updateItem = (list: PrivateFeedbackItem[]) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              isUrgentDueToday: newStatus === 'Resolved' ? false : item.isUrgentDueToday,
              resolutionNote: note && note.trim().length > 0 ? note.trim() : item.resolutionNote,
            }
          : item
      );

    if (activeCompanyId === 'COTG') {
      setFeedbackCOTG(updateItem);
    } else {
      setFeedbackSFG(updateItem);
    }

    if (selectedFeedbackItem && selectedFeedbackItem.id === id) {
      setSelectedFeedbackItem((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              resolutionNote: note && note.trim().length > 0 ? note.trim() : prev.resolutionNote,
            }
          : null
      );
    }
  };

  // Handle Calls Toggle Booked
  const handleToggleBooked = (callId: string) => {
    setCalls((prev) =>
      prev.map((call) =>
        call.id === callId ? { ...call, isBooked: !call.isBooked } : call
      )
    );
  };

  // Handle Morning Follow-up Called Back checkbox
  const handleToggleCalledBack = (callId: string) => {
    setCalls((prev) =>
      prev.map((call) =>
        call.id === callId ? { ...call, calledBack: !call.calledBack } : call
      )
    );
  };

  // Handle "Switch everything off"
  const handleSwitchEverythingOff = () => {
    setSystemMode('Off');
    showToast('Emergency stop: All review and tracking automations switched Off', 'warning');

    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      adminName: 'Emergency Kill-Switch',
      role: 'System Safety',
      action: 'Automations terminated',
      details: 'All automated dispatch routines paused by management override.',
      timestamp: 'Today, Just now',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Counters for badges
  const unreadFeedbackCount = currentFeedback.filter((f) => f.status === 'New').length;
  const missedCallsCount = calls.filter((c) => c.status === 'Missed' && !c.calledBack).length;

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'overview':
        return 'Executive Overview';
      case 'review_requests':
        return 'Review Requests';
      case 'private_feedback':
        return 'Private Feedback Inbox';
      case 'call_tracking':
        return 'Inbound Call Tracking';
      case 'settings':
        return 'Settings & Approval';
      default:
        return 'Overview';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-teal-500/20 selection:text-teal-900">
      {/* Permanent Top Banner on every screen */}
      <Banner />

      {/* App Shell */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Sidebar Nav */}
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={setCurrentScreen}
          activeCompany={activeCompany}
          unreadFeedbackCount={unreadFeedbackCount}
          missedCallsCount={missedCallsCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          {/* Header */}
          <Header
            currentScreenTitle={getScreenTitle()}
            activeCompany={activeCompany}
            onCompanyChange={handleCompanyChange}
            systemMode={systemMode}
            testModeEnabled={testModeEnabled}
          />

          {/* View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentScreen === 'overview' && (
              <OverviewView
                jobs={currentJobs}
                feedback={currentFeedback}
                calls={calls}
                activeCompany={activeCompany}
                onNavigate={setCurrentScreen}
                onSelectFeedback={(item) => {
                  setSelectedFeedbackItem(item);
                  setCurrentScreen('private_feedback');
                }}
              />
            )}

            {currentScreen === 'review_requests' && (
              <ReviewRequestsView
                jobs={currentJobs}
                activeCompany={activeCompany}
                onSendRequest={handleSendRequest}
                showToast={showToast}
              />
            )}

            {currentScreen === 'private_feedback' && (
              <PrivateFeedbackView
                feedback={currentFeedback}
                selectedItem={selectedFeedbackItem}
                onSelectItem={setSelectedFeedbackItem}
                onUpdateStatus={handleUpdateFeedbackStatus}
                activeCompany={activeCompany}
                showToast={showToast}
              />
            )}

            {currentScreen === 'call_tracking' && (
              <CallTrackingView
                calls={calls}
                activeCompany={activeCompany}
                onToggleBooked={handleToggleBooked}
                onToggleCalledBack={handleToggleCalledBack}
                showToast={showToast}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsView
                systemMode={systemMode}
                onSetSystemMode={(mode) => {
                  setSystemMode(mode);
                  setAuditLogs((prev) => [
                    {
                      id: `LOG-${Date.now()}`,
                      adminName: 'Operations Staff',
                      role: 'Staff Member',
                      action: 'Mode changed',
                      details: `System mode changed to ${mode}`,
                      timestamp: 'Today, Just now',
                    },
                    ...prev,
                  ]);
                }}
                testModeEnabled={testModeEnabled}
                onToggleTestMode={setTestModeEnabled}
                activeCompany={activeCompany}
                auditLogs={auditLogs}
                onSwitchEverythingOff={handleSwitchEverythingOff}
                showToast={showToast}
              />
            )}
          </main>

          {/* Management Review UI Footer */}
          <Footer />
        </div>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
