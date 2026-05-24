import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmailList from '@/components/inbox/EmailList';
import EmailDetail from '@/components/inbox/EmailDetail';
import { Search, RefreshCw, Calendar, Loader2, Mail, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FOLDERS = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'sentitems', label: 'Sent' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'deleteditems', label: 'Trash' },
];

const ACCOUNTS = [
  { value: 'me', label: 'kieran.li@5sensesbeauty.com' },
  { value: 'kieran@5senses.global', label: 'kieran@5senses.global' },
];

export default function Inbox() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailDetail, setEmailDetail] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('inbox');
  const [account, setAccount] = useState('me');
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('outlookGetEmails', { folder, top: 30, search, account });
      setEmails(res.data.messages || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [folder, search, account]);

  useEffect(() => { fetchEmails(); }, [folder, account]);

  const handleSelectEmail = async (email) => {
    setSelectedEmail(email);
    setEmailDetail(null);
    setAttachments([]);
    setDetailLoading(true);
    try {
      const res = await base44.functions.invoke('outlookGetEmail', { messageId: email.id, account });
      setEmailDetail(res.data.message);
      setAttachments(res.data.attachments || []);

      // Auto-analyze if not already done
      if (!analyses[email.id]) {
        base44.functions.invoke('outlookAnalyzeEmail', {
          subject: email.subject,
          body: res.data.message?.body?.content || '',
          bodyPreview: email.bodyPreview,
          from: email.from?.emailAddress?.address,
        }).then(r => {
          setAnalyses(prev => ({ ...prev, [email.id]: r.data }));
        }).catch(() => {});
      }
    } catch (e) {
      toast({ title: 'Failed to load email', description: e.message, variant: 'destructive' });
    }
    setDetailLoading(false);

    // Mark as read locally
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
  };

  const handleSyncMeetings = async () => {
    setSyncing(true);
    try {
      const res = await base44.functions.invoke('outlookSyncMeetings', { days: 30, account });
      const { synced, total } = res.data;
      toast({
        title: 'Meetings Synced!',
        description: `${synced} new meeting${synced !== 1 ? 's' : ''} added to calendar (${total} total found).`,
      });
    } catch (e) {
      toast({ title: 'Sync failed', description: e.message, variant: 'destructive' });
    }
    setSyncing(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmails();
  };

  const unreadCount = emails.filter(e => !e.isRead).length;
  const highPriorityCount = Object.values(analyses).filter(a => a?.priority === 'high').length;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card flex-wrap">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h1 className="font-exo font-semibold text-lg text-foreground">Inbox</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white text-xs">{unreadCount} unread</Badge>
          )}
          {highPriorityCount > 0 && (
            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {highPriorityCount} action needed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Select value={account} onValueChange={(v) => { setAccount(v); setSelectedEmail(null); setEmailDetail(null); setAnalyses({}); }}>
            <SelectTrigger className="w-52 h-8 text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNTS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={folder} onValueChange={setFolder}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FOLDERS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <form onSubmit={handleSearch} className="flex items-center gap-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search emails..."
                className="pl-8 h-8 w-48 text-sm"
              />
            </div>
            <Button type="submit" size="sm" variant="outline" className="h-8">Search</Button>
          </form>

          <Button size="sm" variant="outline" className="h-8" onClick={fetchEmails} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button size="sm" className="h-8 gap-1.5" onClick={handleSyncMeetings} disabled={syncing}>
            {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
            Sync Meetings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Email List Panel */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col overflow-hidden flex-shrink-0">
          {/* AI Stats Bar */}
          {Object.keys(analyses).length > 0 && (
            <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">
                AI screened {Object.keys(analyses).length} emails
              </span>
              {Object.values(analyses).filter(a => a?.type === 'invoice').length > 0 && (
                <Badge className="text-xs bg-green-100 text-green-700 ml-1">
                  {Object.values(analyses).filter(a => a?.type === 'invoice').length} invoices
                </Badge>
              )}
              {Object.values(analyses).filter(a => a?.type === 'agreement').length > 0 && (
                <Badge className="text-xs bg-purple-100 text-purple-700 ml-1">
                  {Object.values(analyses).filter(a => a?.type === 'agreement').length} agreements
                </Badge>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {error ? (
              <div className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600 font-medium">Failed to load emails</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{error}</p>
                <Button size="sm" onClick={fetchEmails}>Retry</Button>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <EmailList
                emails={emails}
                selectedId={selectedEmail?.id}
                onSelect={handleSelectEmail}
                analyses={analyses}
              />
            )}
          </div>
        </div>

        {/* Email Detail Panel */}
        <div className="flex-1 overflow-hidden hidden md:flex flex-col">
          {detailLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <EmailDetail
              email={emailDetail || selectedEmail}
              analysis={selectedEmail ? analyses[selectedEmail.id] : null}
              attachments={attachments}
              onSyncMeeting={handleSyncMeetings}
              account={account}
            />
          )}
        </div>
      </div>
    </div>
  );
}