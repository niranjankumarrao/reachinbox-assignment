const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Natural-looking fake accounts
const accounts = [
  { id: 'personal@sample.com', name: 'Personal' },
  { id: 'sales@company.com', name: 'Sales' }
];

// Helper to produce natural fake emails (last 30 days)
const subjects = [
  "Quick question about pricing",
  "Intro: potential collaboration",
  "Meeting request — product demo",
  "Application received — technical interview",
  "Out of office auto-reply",
  "Thanks — not interested right now",
  "Opportunity: partnership proposal",
  "Invoice and payment details",
  "Re: Your resume",
  "Spam: You won a prize!"
];

const senders = [
  { name: "Alex Johnson", email: "alex.j@startup.co" },
  { name: "Priya Singh", email: "priya@talent.io" },
  { name: "Recruiter", email: "jobs@hiringcorp.com" },
  { name: "No-reply", email: "noreply@service.com" },
  { name: "Tom Lee", email: "tom.lee@sales.example" }
];

function randChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// create gentle variety of bodies
function makeBody(subject) {
  if (subject.toLowerCase().includes('out of office')) {
    return "I'm currently out of office with limited access to email. I will respond when I'm back.";
  }
  if (subject.toLowerCase().includes('not interested') || subject.toLowerCase().includes('thanks')) {
    return "Thanks for reaching out. At the moment we're not looking to proceed, but appreciate you contacting us.";
  }
  if (subject.toLowerCase().includes('meeting') || subject.toLowerCase().includes('demo')) {
    return "Hi, thanks for the note — I'd like to book a demo. Please share your available times or a booking link.";
  }
  if (subject.toLowerCase().includes('pricing')) {
    return "Can you share pricing details and any volume discounts? We're evaluating options this quarter.";
  }
  if (subject.toLowerCase().includes('application') || subject.toLowerCase().includes('resume')) {
    return "Hi, your application is under review. We'll reach out with next steps if shortlisted.";
  }
  if (subject.toLowerCase().includes('spam') || subject.toLowerCase().includes('prize')) {
    return "Congratulations! You've won a prize. Click the link to claim.";
  }
  return "Hello — following up on my previous message. Let me know if you're available to discuss.";
}

// Generate a list of fake emails (last 30 days)
const emails = [];
const now = Date.now();
for (let i = 0; i < 40; i++) {
  const subj = randChoice(subjects);
  const sender = randChoice(senders);
  const daysAgo = Math.floor(Math.random() * 29); // 0..28
  const date = new Date(now - daysAgo * 24*60*60*1000 - Math.floor(Math.random()*86400000));
  const account = Math.random() > 0.5 ? accounts[0].id : accounts[1].id;
  const folder = Math.random() > 0.85 ? 'Sent' : 'INBOX';
  const body = makeBody(subj);
  const id = `msg-${i}-${account.replace(/[@.]/g,'')}-${date.getTime()}`;
  // simple rule-based categorizer
  let aiCategory = 'Uncategorized';
  const s = subj.toLowerCase();
  if (s.includes('meeting') || s.includes('demo') || body.toLowerCase().includes('book a demo')) aiCategory = 'Interested';
  else if (s.includes('application') || s.includes('resume') || body.toLowerCase().includes('application')) aiCategory = 'Meeting Booked';
  else if (s.includes('not interested') || body.toLowerCase().includes('not looking')) aiCategory = 'Not Interested';
  else if (s.includes('out of office') || body.toLowerCase().includes('out of office')) aiCategory = 'Out of Office';
  else if (s.includes('spam') || s.includes('prize') || body.toLowerCase().includes('won a prize')) aiCategory = 'Spam';

  emails.push({
    id,
    accountId: account,
    folder,
    subject: subj,
    body,
    from: `${sender.name} <${sender.email}>`,
    to: [account],
    date: date.toISOString(),
    aiCategory,
    indexedAt: new Date().toISOString()
  });
}

// Simple pagination
app.get('/api/emails', (req, res) => {
  const page = parseInt(req.query.page || '1');
  const size = parseInt(req.query.size || '20');
  const start = (page-1)*size;
  const slice = emails.slice(start, start+size);
  res.json({ hits: slice, total: emails.length });
});

// Search & filter
app.get('/api/emails/search', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  const account = req.query.account;
  const folder = req.query.folder;
  let results = emails;
  if (account) results = results.filter(e => e.accountId === account);
  if (folder) results = results.filter(e => e.folder.toLowerCase() === folder.toString().toLowerCase());
  if (q) {
    results = results.filter(e => (e.subject + ' ' + e.body + ' ' + e.from).toLowerCase().includes(q));
  }
  const page = parseInt(req.query.page || '1');
  const size = parseInt(req.query.size || '20');
  const start = (page-1)*size;
  res.json({ hits: results.slice(start, start+size), total: results.length });
});

app.get('/api/accounts', (req, res) => {
  res.json(accounts);
});

// Simulated Slack/webhook trigger endpoint (for testing)
app.post('/api/notify/slack', (req, res) => {
  const payload = req.body;
  console.log('[Slack simulation] would send:', JSON.stringify(payload));
  // In a real setup you'd POST to Slack webhook URL here.
  res.json({ ok: true });
});

// Serve static files from "public" if present (for optional built frontend)
const path = require('path');
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('/', (req,res) => {
  if (require('fs').existsSync(path.join(publicDir,'index.html'))) {
    res.sendFile(path.join(publicDir,'index.html'));
  } else {
    res.json({ status: 'backend running. frontend available separately at vite dev server.'});
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
