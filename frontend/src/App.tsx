import React, { useEffect, useState } from 'react'

type Email = {
  id: string;
  accountId: string;
  folder: string;
  subject: string;
  body: string;
  from: string;
  date: string;
  aiCategory: string;
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App(){
  const [emails, setEmails] = useState<Email[]>([]);
  const [accounts, setAccounts] = useState<{id:string, name?:string}[]>([]);
  const [q, setQ] = useState('');
  const [account, setAccount] = useState('');
  const [folder, setFolder] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(API + '/api/accounts').then(r=>r.json()).then(setAccounts);
    load();
  }, []);

  async function load(){
    setLoading(true);
    const url = new URL(API + '/api/emails');
    const res = await fetch(url.toString());
    const json = await res.json();
    setEmails(json.hits || []);
    setLoading(false);
  }

  async function search(e?:React.FormEvent){
    if (e) e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (account) params.set('account', account);
    if (folder) params.set('folder', folder);
    const res = await fetch(API + '/api/emails/search?' + params.toString());
    const json = await res.json();
    setEmails(json.hits || []);
    setLoading(false);
  }

  return (
    <div className="app">
      <header>
        <h1>ReachInbox — Onebox (70%)</h1>
        <div className="controls">
          <form onSubmit={search} style={{display:'flex', gap:8}}>
            <input placeholder="Search emails..." value={q} onChange={e=>setQ(e.target.value)} />
            <select value={account} onChange={e=>setAccount(e.target.value)}>
              <option value="">All accounts</option>
              {accounts.map(a=> <option key={a.id} value={a.id}>{a.name || a.id}</option>)}
            </select>
            <select value={folder} onChange={e=>setFolder(e.target.value)}>
              <option value="">All folders</option>
              <option value="INBOX">INBOX</option>
              <option value="Sent">Sent</option>
            </select>
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main>
        {loading ? <div>Loading...</div> : (
          <div>
            {emails.map(e => (
              <div key={e.id} className="email">
                <div style={{flex:1}}>
                  <div className="subject">{e.subject} <span className="meta">— {e.from}</span></div>
                  <div className="meta">{new Date(e.date).toLocaleString()} • {e.accountId} • {e.folder}</div>
                  <div className="details">{e.body}</div>
                </div>
                <div style={{width:120,textAlign:'right'}}>
                  <div className="tag">{e.aiCategory}</div>
                </div>
              </div>
            ))}
            {emails.length === 0 && <div style={{padding:20}}>No emails found.</div>}
          </div>
        )}
      </main>
    </div>
  )
}
