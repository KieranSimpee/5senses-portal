import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function EmailSummaryWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('outlookEmailSummary', {});
      setData(res.data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const ACCOUNT_COLORS = [
    { border: 'border-blue-200', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    { border: 'border-purple-200', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-exo text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Email Accounts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fetch} disabled={loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Link to="/inbox" className="text-xs text-primary font-montserrat flex items-center gap-1 hover:underline">
              Open <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-sm text-muted-foreground font-montserrat py-3 text-center">Loading...</div>
        ) : error ? (
          <div className="flex items-center gap-2 text-xs text-red-500 py-2">
            <AlertTriangle className="w-4 h-4" /> Failed to load email summary
          </div>
        ) : (
          (data?.accounts || []).map((acct, i) => {
            const c = ACCOUNT_COLORS[i] || ACCOUNT_COLORS[0];
            return (
              <div key={acct.account} className={`rounded-xl border ${c.border} ${c.bg} p-3 space-y-2`}>
                {/* Account header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                    <span className="font-montserrat font-semibold text-xs text-foreground truncate">{acct.account}</span>
                  </div>
                  {acct.error ? (
                    <Badge className="text-[10px] bg-gray-100 text-gray-500">No access</Badge>
                  ) : (
                    <Badge className={`text-[10px] ${c.badge}`}>
                      {acct.unread} unread
                    </Badge>
                  )}
                </div>

                {/* Latest unread messages */}
                {!acct.error && acct.latestUnread.length > 0 && (
                  <div className="space-y-1.5">
                    {acct.latestUnread.map((msg, j) => (
                      <div key={j} className="bg-white/70 rounded-lg px-3 py-2 border border-white/80">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-montserrat text-[11px] font-semibold text-foreground truncate flex-1">{msg.subject || '(no subject)'}</span>
                          {msg.importance === 'high' && (
                            <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-montserrat truncate flex-1">From: {msg.from}</span>
                          <span className="text-[10px] text-muted-foreground font-montserrat flex-shrink-0">
                            {msg.receivedAt ? formatDistanceToNow(parseISO(msg.receivedAt), { addSuffix: true }) : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!acct.error && acct.latestUnread.length === 0 && (
                  <p className="text-[11px] text-muted-foreground font-montserrat">All caught up ✓</p>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}