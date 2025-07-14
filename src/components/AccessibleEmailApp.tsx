import { useState, useEffect, useCallback } from "react";
import { EmailSidebar } from "./EmailSidebar";
import { EmailList } from "./EmailList";
import { EmailViewer } from "./EmailViewer";
import { EmailComposer } from "./EmailComposer";
import { useVoiceCommands } from "../hooks/useVoiceCommands";
import { Email, EmailView } from "../types/email";
import { mockEmails, mockFolders } from "../data/mockEmails";
import { useToast } from "../hooks/use-toast";

export const AccessibleEmailApp = () => {
  const [currentView, setCurrentView] = useState<EmailView>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails] = useState<Email[]>(mockEmails);
  const [folders] = useState(mockFolders);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  // Filter emails based on current view
  const filteredEmails = emails.filter(email => {
    if (currentView === 'compose') return [];
    return email.folder === currentView;
  });

  // Voice command definitions
  const voiceCommands = [
    {
      command: 'open inbox',
      action: () => {
        setCurrentView('inbox');
        setSelectedEmail(null);
        speak('Opening inbox');
      },
      description: 'Open inbox folder'
    },
    {
      command: 'open sent',
      action: () => {
        setCurrentView('sent');
        setSelectedEmail(null);
        speak('Opening sent items');
      },
      description: 'Open sent items folder'
    },
    {
      command: 'open drafts',
      action: () => {
        setCurrentView('drafts');
        setSelectedEmail(null);
        speak('Opening drafts folder');
      },
      description: 'Open drafts folder'
    },
    {
      command: 'open trash',
      action: () => {
        setCurrentView('trash');
        setSelectedEmail(null);
        speak('Opening trash folder');
      },
      description: 'Open trash folder'
    },
    {
      command: 'compose',
      action: () => {
        setCurrentView('compose');
        setSelectedEmail(null);
        speak('Opening compose email');
      },
      description: 'Compose new email'
    },
    {
      command: 'go back',
      action: () => {
        if (selectedEmail) {
          setSelectedEmail(null);
          speak('Returning to email list');
        } else if (currentView === 'compose') {
          setCurrentView('inbox');
          speak('Returning to inbox');
        }
      },
      description: 'Go back to previous view'
    },
    {
      command: 'help',
      action: () => {
        const helpText = `Available voice commands: 
        Say "open inbox" to view inbox emails.
        Say "open sent" to view sent emails.
        Say "open drafts" to view draft emails.
        Say "open trash" to view deleted emails.
        Say "compose" to write a new email.
        Say "go back" to return to the previous view.
        Say "read email" to hear the current email.
        Say "reply" to reply to the current email.
        Say "delete" to delete the current email.`;
        speak(helpText);
      },
      description: 'List available voice commands'
    },
    {
      command: 'read email',
      action: () => {
        if (selectedEmail) {
          const emailText = `Email from ${selectedEmail.from}. Subject: ${selectedEmail.subject}. Message: ${selectedEmail.body}`;
          speak(emailText);
        } else {
          speak('No email selected. Please select an email first.');
        }
      },
      description: 'Read the currently selected email aloud'
    },
    {
      command: 'reply',
      action: () => {
        if (selectedEmail) {
          handleReply();
          speak('Opening reply composer');
        } else {
          speak('No email selected. Please select an email first.');
        }
      },
      description: 'Reply to the currently selected email'
    },
    {
      command: 'delete',
      action: () => {
        if (selectedEmail) {
          handleDelete();
          speak('Email deleted');
        } else {
          speak('No email selected. Please select an email first.');
        }
      },
      description: 'Delete the currently selected email'
    }
  ];

  const { 
    isSupported: isVoiceSupported, 
    isActive: isVoiceActive,
    speak,
    startListening,
    stopListening
  } = useVoiceCommands({
    commands: voiceCommands,
    isListening: isVoiceListening
  });

  // Handle voice toggle
  const handleToggleVoice = useCallback(() => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
      stopListening();
      speak('Voice commands disabled');
    } else {
      setIsVoiceListening(true);
      startListening();
      speak('Voice commands enabled. Say "help" for available commands.');
    }
  }, [isVoiceListening, startListening, stopListening, speak]);

  // Email actions
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read (in a real app, this would update the backend)
    speak(`Opening email from ${email.from}. Subject: ${email.subject}`);
  };

  const handleEmailSpeak = (email: Email) => {
    const emailText = `Email from ${email.from}. Subject: ${email.subject}. Received ${email.date.toLocaleDateString()}. Message: ${email.body}`;
    speak(emailText);
  };

  const handleReply = () => {
    if (selectedEmail) {
      setCurrentView('compose');
      // In a real app, you would pass reply data to the composer
    }
  };

  const handleReplyAll = () => {
    if (selectedEmail) {
      setCurrentView('compose');
      speak('Reply all composer opened');
    }
  };

  const handleForward = () => {
    if (selectedEmail) {
      setCurrentView('compose');
      speak('Forward composer opened');
    }
  };

  const handleDelete = () => {
    if (selectedEmail) {
      toast({
        title: "Email deleted",
        description: "The email has been moved to trash."
      });
      setSelectedEmail(null);
    }
  };

  const handleToggleStar = () => {
    if (selectedEmail) {
      const action = selectedEmail.isStarred ? 'removed from' : 'added to';
      speak(`Email ${action} starred items`);
      toast({
        title: selectedEmail.isStarred ? "Star removed" : "Star added",
        description: `Email ${action} your starred items.`
      });
    }
  };

  const handleSendEmail = (emailData: any) => {
    toast({
      title: "Email sent",
      description: "Your email has been sent successfully."
    });
    speak('Email sent successfully');
    setCurrentView('inbox');
  };

  const handleBack = () => {
    if (selectedEmail) {
      setSelectedEmail(null);
    } else if (currentView === 'compose') {
      setCurrentView('inbox');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Announce new emails (in a real app, this would be triggered by actual new emails)
  useEffect(() => {
    const unreadCount = filteredEmails.filter(email => !email.isRead).length;
    if (currentView === 'inbox' && !selectedEmail && unreadCount > 0) {
      speak(`You have ${unreadCount} unread email${unreadCount === 1 ? '' : 's'} in your inbox.`);
    }
  }, [currentView, selectedEmail, filteredEmails, speak]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            setCurrentView('compose');
            speak('Compose new email');
            break;
          case 'r':
            e.preventDefault();
            if (selectedEmail) {
              handleReply();
            }
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            if (selectedEmail) {
              handleDelete();
            }
            break;
        }
      }

      // Voice command toggle
      if (e.key === 'F2') {
        e.preventDefault();
        handleToggleVoice();
      }

      // Escape to go back
      if (e.key === 'Escape') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmail, handleToggleVoice]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link"
        onFocus={() => speak('Skip to main content link focused')}
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-border p-4" role="banner">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Accessible Email</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {!isVoiceSupported && (
              <span>Voice commands not supported in this browser</span>
            )}
            <span>Press F2 to toggle voice commands</span>
            <span>Ctrl+N to compose</span>
          </div>
        </div>
      </header>

      {/* Main Application */}
      <div className="flex h-[calc(100vh-73px)]">
        <EmailSidebar
          folders={folders}
          currentView={currentView}
          onViewChange={setCurrentView}
          isVoiceActive={isVoiceActive}
          onToggleVoice={handleToggleVoice}
        />

        <div id="main-content" className="flex-1 flex flex-col">
          {currentView === 'compose' ? (
            <EmailComposer
              onBack={handleBack}
              onSend={handleSendEmail}
              onSpeak={speak}
              replyTo={selectedEmail ? {
                to: [selectedEmail.from],
                subject: `Re: ${selectedEmail.subject}`,
                originalBody: selectedEmail.body
              } : undefined}
            />
          ) : selectedEmail ? (
            <EmailViewer
              email={selectedEmail}
              onBack={handleBack}
              onReply={handleReply}
              onReplyAll={handleReplyAll}
              onForward={handleForward}
              onDelete={handleDelete}
              onToggleStar={handleToggleStar}
              onSpeak={speak}
              onStopSpeaking={stopSpeaking}
              isSpeaking={isSpeaking}
            />
          ) : (
            <EmailList
              emails={filteredEmails}
              selectedEmailId={selectedEmail?.id}
              onEmailSelect={handleEmailSelect}
              onEmailSpeak={handleEmailSpeak}
            />
          )}
        </div>
      </div>

      {/* Announce region for screen readers */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        id="announcements"
      >
        {/* Dynamic announcements will be added here */}
      </div>
    </div>
  );
};