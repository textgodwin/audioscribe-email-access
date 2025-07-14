import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  X,
  Volume2 
} from "lucide-react";

interface EmailComposerProps {
  onBack: () => void;
  onSend: (email: {
    to: string[];
    cc?: string[];
    subject: string;
    body: string;
    priority: 'low' | 'normal' | 'high';
  }) => void;
  onSpeak: (text: string) => void;
  replyTo?: {
    to: string[];
    subject: string;
    originalBody?: string;
  };
}

export const EmailComposer = ({ 
  onBack, 
  onSend, 
  onSpeak,
  replyTo 
}: EmailComposerProps) => {
  const [to, setTo] = useState(replyTo?.to.join(', ') || '');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(replyTo?.subject || '');
  const [body, setBody] = useState(replyTo?.originalBody ? `\n\n--- Original Message ---\n${replyTo.originalBody}` : '');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!to.trim()) {
      newErrors.to = 'Recipient email is required';
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emails = to.split(',').map(e => e.trim());
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          newErrors.to = 'Please enter valid email addresses';
          break;
        }
      }
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Email body is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if (validateForm()) {
      const toEmails = to.split(',').map(e => e.trim()).filter(e => e);
      const ccEmails = cc ? cc.split(',').map(e => e.trim()).filter(e => e) : undefined;
      
      onSend({
        to: toEmails,
        cc: ccEmails,
        subject: subject.trim(),
        body: body.trim(),
        priority
      });
    }
  };

  const handleVoiceInput = (field: 'to' | 'subject' | 'body') => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    onSpeak(`Please dictate the ${field === 'to' ? 'recipient email' : field}. Recording will start now.`);
    
    // Note: In a real implementation, you would integrate with speech recognition here
    // For now, we'll just show the recording state
    setTimeout(() => {
      setIsRecording(false);
      onSpeak('Recording stopped. Please try the voice input again or type manually.');
    }, 3000);
  };

  const readFieldAloud = (field: 'to' | 'subject' | 'body') => {
    let content = '';
    switch (field) {
      case 'to':
        content = to || 'No recipients entered';
        break;
      case 'subject':
        content = subject || 'No subject entered';
        break;
      case 'body':
        content = body || 'No message body entered';
        break;
    }
    onSpeak(`${field === 'to' ? 'Recipients' : field}: ${content}`);
  };

  return (
    <main 
      className="flex-1 p-6 overflow-y-auto"
      role="main"
      aria-label="Compose email"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              aria-label="Go back to email list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">
              {replyTo ? 'Reply to Email' : 'Compose Email'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={priority === 'high' ? 'destructive' : priority === 'low' ? 'secondary' : 'outline'}>
              {priority} priority
            </Badge>
            <Button
              variant="default"
              onClick={handleSend}
              aria-label="Send email"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        {/* Compose Form */}
        <Card className="p-6">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            {/* To Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="to" className="text-sm font-medium">
                  To *
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('to')}
                  aria-label="Voice input for recipients"
                  disabled={isRecording}
                >
                  {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => readFieldAloud('to')}
                  aria-label="Read recipients aloud"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com, another@example.com"
                aria-describedby={errors.to ? "to-error" : "to-help"}
                aria-invalid={!!errors.to}
                multiple
              />
              {errors.to && (
                <p id="to-error" className="text-sm text-destructive" role="alert">
                  {errors.to}
                </p>
              )}
              <p id="to-help" className="text-sm text-muted-foreground">
                Separate multiple email addresses with commas
              </p>
            </div>

            {/* CC Field */}
            <div className="space-y-2">
              <Label htmlFor="cc" className="text-sm font-medium">
                CC (Optional)
              </Label>
              <Input
                id="cc"
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com"
                multiple
              />
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  Subject *
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('subject')}
                  aria-label="Voice input for subject"
                  disabled={isRecording}
                >
                  {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => readFieldAloud('subject')}
                  aria-label="Read subject aloud"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                aria-describedby={errors.subject ? "subject-error" : undefined}
                aria-invalid={!!errors.subject}
              />
              {errors.subject && (
                <p id="subject-error" className="text-sm text-destructive" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <div className="flex gap-2" role="radiogroup" aria-label="Email priority">
                {(['low', 'normal', 'high'] as const).map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={priority === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriority(p)}
                    role="radio"
                    aria-checked={priority === p}
                    aria-label={`Set priority to ${p}`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {/* Body Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="body" className="text-sm font-medium">
                  Message *
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('body')}
                  aria-label="Voice input for message body"
                  disabled={isRecording}
                >
                  {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => readFieldAloud('body')}
                  aria-label="Read message body aloud"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your message here..."
                rows={12}
                aria-describedby={errors.body ? "body-error" : "body-help"}
                aria-invalid={!!errors.body}
              />
              {errors.body && (
                <p id="body-error" className="text-sm text-destructive" role="alert">
                  {errors.body}
                </p>
              )}
              <p id="body-help" className="text-sm text-muted-foreground">
                You can use voice input to dictate your message
              </p>
            </div>

            {/* Attachments Placeholder */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Attachments</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 border-dashed"
                aria-label="Add attachments (coming soon)"
                disabled
              >
                <div className="text-center">
                  <Paperclip className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Feature coming soon)
                  </p>
                </div>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
};