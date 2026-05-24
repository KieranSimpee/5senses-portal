import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Reply, ReplyAll, Calendar, Paperclip, X, Send, Loader2, FileText, DollarSign, User, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const typeColors = {
  agreement: 'bg-purple-100 text-purple-700 border-purple-200',
  invoice: 'bg-green-100 text-green-700 border-green-200',
  meeting_request: 'bg-blue-100 text-blue-700 border-blue-200',
  contact: 'bg-orange-100 text-orange-700 border-orange-200',
  general: 'bg-gray-100 text-gray-700 border-gray-200',
  marketing: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function EmailDetail({ email, analysis, attachments, onSyncMeeting, account = 'me' }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAll, setReplyAll] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
          <FileText className="w-8 h-8 opacity-30" />
        </div>
        <p className="font-medium">Select an email to read</p>
        <p className="text-sm mt-1">Your inbox is connected and synced</p>
      </div>
    );
  }

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await base44.functions.invoke('outlookReply', { messageId: email.id, comment: replyText, replyAll, account });
      toast({ title: 'Reply sent!', description: 'Your reply has been sent successfully.' });
      setReplyOpen(false);
      setReplyText('');
    } catch (e) {
      toast({ title: 'Failed to send', description: e.message, variant: 'destructive' });
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <h2 className="font-semibold text-lg text-foreground mb-2 leading-tight">{email.subject || '(no subject)'}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>From: <strong className="text-foreground">{email.from?.emailAddress?.name || email.from?.emailAddress?.address}</strong></span>
          <span className="text-xs">&lt;{email.from?.emailAddress?.address}&gt;</span>
          {email.receivedDateTime && (
            <span className="ml-auto text-xs">{format(new Date(email.receivedDateTime), 'MMM d, yyyy h:mm a')}</span>
          )}
        </div>

        {/* AI Analysis Panel */}
        {analysis && (
          <div className={`p-3 rounded-lg border text-sm ${typeColors[analysis.type] || typeColors.general}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-medium">
                <span className="capitalize">{analysis.type?.replace('_', ' ')}</span>
                {analysis.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex gap-1 flex-wrap">
                {(analysis.tags || []).map(tag => (
                  <span key={tag} className="text-xs bg-white/60 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm">{analysis.summary}</p>
            {analysis.action && (
              <p className="mt-1 font-medium text-sm">→ {analysis.action}</p>
            )}
            <div className="flex gap-3 mt-1 flex-wrap text-xs opacity-80">
              {analysis.company_name && <span>Company: {analysis.company_name}</span>}
              {analysis.amount && <span>Amount: {analysis.amount}</span>}
              {analysis.due_date && <span>Due: {analysis.due_date}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
        <Button size="sm" variant="outline" onClick={() => { setReplyOpen(true); setReplyAll(false); }}>
          <Reply className="w-4 h-4" /> Reply
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setReplyOpen(true); setReplyAll(true); }}>
          <ReplyAll className="w-4 h-4" /> Reply All
        </Button>
        {(analysis?.type === 'meeting_request' || email.subject?.toLowerCase().includes('meeting') || email.subject?.toLowerCase().includes('invite')) && (
          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={onSyncMeeting}>
            <Calendar className="w-4 h-4" /> Sync to Calendar
          </Button>
        )}
        {attachments?.length > 0 && (
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Paperclip className="w-3 h-3" />
            {attachments.length} attachment{attachments.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        <div
          className="prose prose-sm max-w-none text-foreground/90"
          dangerouslySetInnerHTML={{ __html: email.body?.content || email.bodyPreview || '' }}
        />
        {attachments?.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium mb-2 text-muted-foreground">Attachments</p>
            <div className="flex flex-wrap gap-2">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 bg-muted/40">
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{att.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(att.size / 1024)}KB)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply Box */}
      {replyOpen && (
        <div className="border-t border-border p-4 bg-background">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">{replyAll ? 'Reply All' : 'Reply'}</span>
            <Button size="icon" variant="ghost" onClick={() => setReplyOpen(false)}><X className="w-4 h-4" /></Button>
          </div>
          <Textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px] mb-3 text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setReplyOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleReply} disabled={sending || !replyText.trim()}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}