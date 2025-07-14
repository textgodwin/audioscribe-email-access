import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Star, Paperclip, Volume2 } from "lucide-react";
import { Email } from "@/types/email";
import { formatDistanceToNow } from "date-fns";

interface EmailListProps {
  emails: Email[];
  selectedEmailId?: string;
  onEmailSelect: (email: Email) => void;
  onEmailSpeak: (email: Email) => void;
}

export const EmailList = ({ 
  emails, 
  selectedEmailId, 
  onEmailSelect, 
  onEmailSpeak 
}: EmailListProps) => {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (emails.length === 0) {
    return (
      <div className="flex-1 p-8 text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">No emails found</h2>
        <p className="text-muted-foreground">
          This folder is empty or no emails match your current filter.
        </p>
      </div>
    );
  }

  return (
    <main 
      className="flex-1 p-4 overflow-y-auto"
      role="main"
      aria-label="Email list"
    >
      <div 
        className="space-y-2"
        role="list"
        aria-label={`${emails.length} emails`}
      >
        {emails.map((email, index) => (
          <Card
            key={email.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-email-hover focus-within:bg-email-hover ${
              selectedEmailId === email.id ? 'bg-email-selected border-primary' : ''
            } ${!email.isRead ? 'border-l-4 border-l-email-unread' : ''}`}
            role="listitem"
            tabIndex={0}
            onClick={() => onEmailSelect(email)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onEmailSelect(email);
              }
            }}
            aria-label={`Email ${index + 1} of ${emails.length}. From ${email.from}. Subject: ${email.subject}. ${email.isRead ? 'Read' : 'Unread'}. ${formatDate(email.date)}`}
          >
            <div className="flex items-start gap-3">
              {/* Email Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {email.isRead ? (
                  <MailOpen className="h-5 w-5 text-email-read" aria-label="Read email" />
                ) : (
                  <Mail className="h-5 w-5 text-email-unread" aria-label="Unread email" />
                )}
              </div>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${!email.isRead ? 'font-bold' : ''}`}>
                      {email.from}
                    </h3>
                    <p className={`text-sm truncate ${!email.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {email.subject}
                    </p>
                  </div>
                  
                  {/* Email Metadata */}
                  <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                    <time dateTime={email.date.toISOString()}>
                      {formatDate(email.date)}
                    </time>
                    <div className="flex items-center gap-1">
                      {email.isStarred && (
                        <Star className="h-3 w-3 text-accent fill-current" aria-label="Starred" />
                      )}
                      {email.attachments && email.attachments.length > 0 && (
                        <Paperclip className="h-3 w-3" aria-label={`${email.attachments.length} attachments`} />
                      )}
                      {email.priority !== 'normal' && (
                        <Badge variant={getPriorityColor(email.priority)} className="text-xs px-1 py-0">
                          {email.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Preview */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {email.body.substring(0, 150)}...
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEmailSpeak(email);
                    }}
                    aria-label={`Read email aloud: ${email.subject}`}
                    className="text-xs"
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Read Aloud
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};