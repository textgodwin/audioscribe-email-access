import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Reply, 
  ReplyAll, 
  Forward, 
  Trash2, 
  Star, 
  StarOff,
  Volume2,
  VolumeX,
  Download,
  Paperclip
} from "lucide-react";
import { Email } from "@/types/email";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface EmailViewerProps {
  email: Email;
  onBack: () => void;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
  onSpeak: (text: string) => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
}

export const EmailViewer = ({ 
  email, 
  onBack, 
  onReply, 
  onReplyAll, 
  onForward, 
  onDelete, 
  onToggleStar,
  onSpeak,
  onStopSpeaking,
  isSpeaking
}: EmailViewerProps) => {
  const [isBodySpeaking, setIsBodySpeaking] = useState(false);

  const handleSpeakEmail = () => {
    if (isSpeaking || isBodySpeaking) {
      onStopSpeaking();
      setIsBodySpeaking(false);
    } else {
      setIsBodySpeaking(true);
      const emailText = `Email from ${email.from}. Subject: ${email.subject}. Message: ${email.body}`;
      onSpeak(emailText);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <main 
      className="flex-1 p-6 overflow-y-auto"
      role="main"
      aria-label="Email viewer"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            aria-label="Go back to email list"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleStar}
              aria-label={email.isStarred ? "Remove star" : "Add star"}
            >
              {email.isStarred ? (
                <Star className="h-4 w-4 text-accent fill-current" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeakEmail}
              aria-label={isSpeaking || isBodySpeaking ? "Stop reading email" : "Read email aloud"}
            >
              {isSpeaking || isBodySpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              aria-label="Delete email"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Email Content */}
        <Card className="p-6">
          {/* Email Header */}
          <header className="border-b border-border pb-4 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">
                  {email.subject}
                </h1>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">From: </span>
                    <span>{email.from}</span>
                  </div>
                  <div>
                    <span className="font-medium">To: </span>
                    <span>{email.to.join(', ')}</span>
                  </div>
                  {email.cc && email.cc.length > 0 && (
                    <div>
                      <span className="font-medium">CC: </span>
                      <span>{email.cc.join(', ')}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Date: </span>
                    <time dateTime={email.date.toISOString()}>
                      {email.date.toLocaleString()} ({formatDistanceToNow(email.date, { addSuffix: true })})
                    </time>
                  </div>
                </div>
              </div>

              {email.priority !== 'normal' && (
                <Badge 
                  variant={email.priority === 'high' ? 'destructive' : 'secondary'}
                  className="ml-4"
                >
                  {email.priority} priority
                </Badge>
              )}
            </div>
          </header>

          {/* Email Body */}
          <div 
            className="prose prose-invert max-w-none mb-6"
            aria-label="Email content"
          >
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {email.body}
            </div>
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="border-t border-border pt-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({email.attachments.length})
              </h3>
              <div className="space-y-2">
                {email.attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{attachment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Download ${attachment.name}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={onReply}
            aria-label="Reply to this email"
            className="flex items-center gap-2"
          >
            <Reply className="h-4 w-4" />
            Reply
          </Button>

          <Button
            variant="outline"
            onClick={onReplyAll}
            aria-label="Reply to all recipients"
            className="flex items-center gap-2"
          >
            <ReplyAll className="h-4 w-4" />
            Reply All
          </Button>

          <Button
            variant="outline"
            onClick={onForward}
            aria-label="Forward this email"
            className="flex items-center gap-2"
          >
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </main>
  );
};