import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Paperclip, AlertCircle, FileText, DollarSign, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
  agreement: { icon: FileText, color: 'bg-purple-100 text-purple-700', label: 'Agreement' },
  invoice: { icon: DollarSign, color: 'bg-green-100 text-green-700', label: 'Invoice' },
  meeting_request: { icon: Calendar, color: 'bg-blue-100 text-blue-700', label: 'Meeting' },
  contact: { icon: User, color: 'bg-orange-100 text-orange-700', label: 'Contact' },
  general: { icon: Mail, color: 'bg-gray-100 text-gray-700', label: 'General' },
  marketing: { icon: Mail, color: 'bg-pink-100 text-pink-700', label: 'Marketing' },
};

export default function EmailList({ emails, selectedId, onSelect, analyses }) {
  if (!emails.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <Mail className="w-10 h-10 mb-2 opacity-30" />
        <p className="text-sm">No emails found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {emails.map((email) => {
        const analysis = analyses?.[email.id];
        const TypeCfg = analysis ? typeConfig[analysis.type] : null;
        const TypeIcon = TypeCfg?.icon;
        const isSelected = selectedId === email.id;

        return (
          <div
            key={email.id}
            onClick={() => onSelect(email)}
            className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : ''} ${!email.isRead ? 'bg-blue-50/40' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!email.isRead ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-sm truncate ${!email.isRead ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                    {email.from?.emailAddress?.name || email.from?.emailAddress?.address || 'Unknown'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {email.hasAttachments && <Paperclip className="w-3 h-3 text-muted-foreground" />}
                    {email.importance === 'high' && <AlertCircle className="w-3 h-3 text-red-500" />}
                    <span className="text-xs text-muted-foreground">
                      {email.receivedDateTime ? formatDistanceToNow(new Date(email.receivedDateTime), { addSuffix: true }) : ''}
                    </span>
                  </div>
                </div>
                <p className={`text-sm truncate mb-1 ${!email.isRead ? 'font-medium' : ''}`}>{email.subject || '(no subject)'}</p>
                <p className="text-xs text-muted-foreground truncate">{email.bodyPreview}</p>
                {TypeCfg && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${TypeCfg.color}`}>
                      {TypeIcon && <TypeIcon className="w-2.5 h-2.5" />}
                      {TypeCfg.label}
                    </span>
                    {analysis?.priority === 'high' && (
                      <span className="text-xs text-red-600 font-medium">• Action needed</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}