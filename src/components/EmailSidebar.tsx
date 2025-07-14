import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Inbox, Send, FileText, Trash2, Mic, MicOff } from "lucide-react";
import { EmailFolder, EmailView } from "@/types/email";

interface EmailSidebarProps {
  folders: EmailFolder[];
  currentView: EmailView;
  onViewChange: (view: EmailView) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

export const EmailSidebar = ({ 
  folders, 
  currentView, 
  onViewChange, 
  isVoiceActive, 
  onToggleVoice 
}: EmailSidebarProps) => {
  const getIcon = (folderId: string) => {
    switch (folderId) {
      case 'inbox':
        return <Inbox className="h-5 w-5" />;
      case 'sent':
        return <Send className="h-5 w-5" />;
      case 'drafts':
        return <FileText className="h-5 w-5" />;
      case 'trash':
        return <Trash2 className="h-5 w-5" />;
      default:
        return <Inbox className="h-5 w-5" />;
    }
  };

  return (
    <aside 
      className="w-64 p-4 border-r border-border bg-card"
      role="navigation"
      aria-label="Email folders and navigation"
    >
      <div className="space-y-4">
        {/* Voice Control Toggle */}
        <Card className="p-4">
          <Button
            onClick={onToggleVoice}
            variant={isVoiceActive ? "destructive" : "default"}
            className="w-full flex items-center gap-2"
            aria-label={isVoiceActive ? "Stop voice commands" : "Start voice commands"}
            aria-pressed={isVoiceActive}
          >
            {isVoiceActive ? (
              <>
                <MicOff className="h-4 w-4" />
                Voice Active
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Voice
              </>
            )}
          </Button>
          {isVoiceActive && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              <span className="sr-only">Voice commands are now active. </span>
              Say "help" for commands
            </p>
          )}
        </Card>

        {/* Compose Button */}
        <Button
          onClick={() => onViewChange('compose')}
          variant="default"
          size="lg"
          className="w-full"
          aria-label="Compose new email"
        >
          Compose Email
        </Button>

        {/* Folder Navigation */}
        <nav aria-label="Email folders">
          <ul className="space-y-2" role="list">
            {folders.map((folder) => (
              <li key={folder.id}>
                <Button
                  onClick={() => onViewChange(folder.id as EmailView)}
                  variant={currentView === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  aria-label={`${folder.name}, ${folder.unreadCount} unread of ${folder.count} total emails`}
                  aria-current={currentView === folder.id ? "page" : undefined}
                >
                  <div className="flex items-center gap-3 w-full">
                    {getIcon(folder.id)}
                    <span className="flex-1">{folder.name}</span>
                    <div className="flex flex-col items-end text-xs">
                      {folder.unreadCount > 0 && (
                        <span 
                          className="bg-primary text-primary-foreground px-2 py-1 rounded-full"
                          aria-label={`${folder.unreadCount} unread`}
                        >
                          {folder.unreadCount}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {folder.count}
                      </span>
                    </div>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};