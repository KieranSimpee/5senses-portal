#!/usr/bin/env python3
"""
Batch file emails from kieran@5senses.global inbox into category folders.
Processes 20 emails per run. Run repeatedly until inbox is empty.
"""
import subprocess, json, os, sys

token = os.environ.get('OUTLOOK_ACCESS_TOKEN', '')
if not token:
    print("ERROR: No OUTLOOK_ACCESS_TOKEN found")
    sys.exit(1)

INBOX_ID = "AAMkADU1YzQwZjFlLWE1ZjAtNDM0NS1iZmY0LWRjMzZlYmE1ODM4MQAuAAAAAADBbRsECTB7RqJ66aGaMx0yAQA2Gg9t6FfHSbUfoVCMSnIYAAAAAAEMAAA="

def graph(method, path, body=None):
    args = ['curl', '-s', '-X', method,
            f'https://graph.microsoft.com/v1.0{path}',
            '-H', f'Authorization: Bearer {token}',
            '-H', 'Content-Type: application/json']
    if body:
        args += ['-d', json.dumps(body)]
    r = subprocess.run(args, capture_output=True, text=True, timeout=30)
    try:
        return json.loads(r.stdout)
    except:
        return {}

# Load folder map
folders_data = graph('GET', f'/me/mailFolders/{INBOX_ID}/childFolders?$top=100')
folder_map = {f['displayName']: f['id'] for f in folders_data.get('value', [])}

def classify(email):
    subject = (email.get('subject') or '').lower()
    sender = (email.get('from', {}).get('emailAddress', {}).get('address') or '').lower()
    
    if any(x in sender for x in ['microsoft', 'azure', 'mimecast', 'office365', 'microsoftonline']) or \
       any(x in subject for x in ['microsoft', 'azure', 'office 365', 'quota', 'security alert', 'sign-in']):
        return 'Microsoft & Azure'
    if 'banuba' in sender or 'banuba' in subject:
        return 'Banuba'
    if 'canva' in sender or 'canva' in subject:
        return 'Canva'
    if any(x in sender for x in ['ipd', 'hkipd']) or any(x in subject for x in ['trademark', 'ipd', 'intellectual property']):
        return 'IPD & Trademark'
    if any(x in sender for x in ['reaphk', 'reap']) or 'reap' in subject or 'carrie' in sender:
        return 'Reap Business'
    if any(x in sender for x in ['fundfluent', 'wilson.tai']) or any(x in subject for x in ['fundfluent', 'partnership agreement']):
        return 'FundFluent & Wilson'
    if any(x in sender for x in ['nestvc', 'startmeup', 'nest.vc']) or any(x in subject for x in ['nest vc', 'investment', 'incubat', 'startup']):
        return 'Nest VC & Investors'
    if any(x in sender for x in ['selectproperty', '28hse', 'centaline', 'midland', 'property']) or \
       any(x in subject for x in ['property', 'listing', 'sq ft', 'hkd/ft']):
        return 'Select Property'
    if 'base44' in sender or 'base44' in subject:
        return 'Base44'
    if any(x in sender for x in ['loreen', '5sensesbeauty.com']) or \
       any(x in subject for x in ['sharepoint', 'internal']):
        return 'SharePoint & Internal'
    if any(x in subject for x in ['newsletter', 'unsubscribe', 'promotion', 'offer', 'deal', 'sale']) or \
       any(x in sender for x in ['noreply', 'no-reply', 'newsletter', 'marketing']):
        return 'Newsletters & Promotions'
    return 'Personal'

# Get batch of 20 emails from inbox
msgs_data = graph('GET', f'/me/mailFolders/{INBOX_ID}/messages?$top=20&$select=id,subject,from,isRead')
emails = msgs_data.get('value', [])

if not emails:
    print("Inbox is empty - all emails filed!")
    sys.exit(0)

moved = {}
errors = 0

for email in emails:
    target = classify(email)
    folder_id = folder_map.get(target, folder_map.get('Personal'))
    
    # Move
    move_r = graph('POST', f'/me/messages/{email["id"]}/move', {"destinationId": folder_id})
    if 'id' in move_r:
        moved[target] = moved.get(target, 0) + 1
    else:
        errors += 1
        print(f"  ERROR moving: {email.get('subject','?')[:50]}")

print(f"Batch complete. Moved {sum(moved.values())} emails. Errors: {errors}")
for folder, count in sorted(moved.items()):
    print(f"  -> {folder}: {count}")

# Report remaining
inbox_info = graph('GET', f'/me/mailFolders/{INBOX_ID}')
remaining = inbox_info.get('totalItemCount', '?')
print(f"\nRemaining in inbox: {remaining}")
