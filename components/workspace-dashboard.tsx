"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/firebase";
import { Calendar, Mail, FileText, CheckSquare, MessageSquare, Loader2, ExternalLink } from "lucide-react";

export function WorkspaceDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    async function loadWorkspaceData() {
      const accessToken = await getAccessToken();
      setToken(accessToken);
      
      if (!accessToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch Calendar Events
        const timeMin = new Date().toISOString();
        const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&maxResults=5&singleEvents=true&orderBy=startTime`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (calRes.ok) {
          const calData = await calRes.json();
          setCalendarEvents(calData.items || []);
        }

        // Fetch Gmail (Unread)
        const gmailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=3`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (gmailRes.ok) {
          const gmailData = await gmailRes.json();
          const messages = gmailData.messages || [];
          const emailDetails = await Promise.all(
            messages.map(async (msg: any) => {
              const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`, {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              if (msgRes.ok) return await msgRes.json();
              return null;
            })
          );
          setEmails(emailDetails.filter(Boolean));
        }

        // Fetch Drive Files
        const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=5&orderBy=modifiedTime%20desc&fields=files(id,name,webViewLink)`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (driveRes.ok) {
          const driveData = await driveRes.json();
          setFiles(driveData.files || []);
        }

        // Fetch Tasks (Default list)
        const taskListsRes = await fetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (taskListsRes.ok) {
          const taskListsData = await taskListsRes.json();
          const defaultList = taskListsData.items?.[0];
          if (defaultList) {
            const tasksRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList.id}/tasks?maxResults=5`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (tasksRes.ok) {
              const tasksData = await tasksRes.json();
              setTasks((tasksData.items || []).filter((t: any) => t.status !== "completed"));
            }
          }
        }

      } catch (err) {
        console.error("Failed to load Workspace data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceData();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ display: "flex", justifyContent: "center", padding: 40, color: "var(--muted)" }}>
        <Loader2 size={24} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", marginTop: 32 }}>
      
      {/* Calendar */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, marginBottom: 16 }}>
          <Calendar size={18} color="#4285F4" /> Upcoming Schedule
        </h3>
        {calendarEvents.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>No upcoming events.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {calendarEvents.map(event => {
              const date = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);
              const timeString = event.start.dateTime ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day';
              return (
                <li key={event.id} style={{ fontSize: 14 }}>
                  <a href={event.htmlLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ fontWeight: 500, color: "var(--foreground)" }}>{event.summary || "Busy"}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      {date.toLocaleDateString()} at {timeString}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Gmail */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, marginBottom: 16 }}>
          <Mail size={18} color="#EA4335" /> Recent Unread Mails
        </h3>
        {emails.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Inbox zero! No unread emails.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {emails.map(email => {
              const headers = email.payload?.headers || [];
              const subject = headers.find((h: any) => h.name === 'Subject')?.value || "No Subject";
              const from = headers.find((h: any) => h.name === 'From')?.value || "Unknown";
              return (
                <li key={email.id} style={{ fontSize: 14, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                  <a href={`https://mail.google.com/mail/u/0/#inbox/${email.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subject}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{from}</div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Tasks */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, marginBottom: 16 }}>
          <CheckSquare size={18} color="#34A853" /> Google Tasks
        </h3>
        {tasks.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>No pending tasks.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map(task => (
              <li key={task.id} style={{ fontSize: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 14, height: 14, border: "1px solid var(--muted)", borderRadius: 2, flexShrink: 0, marginTop: 3 }}></div>
                <div style={{ color: "var(--foreground)" }}>{task.title}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Drive */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, marginBottom: 16 }}>
          <FileText size={18} color="#FBBC05" /> Recent Drive Files
        </h3>
        {files.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>No recent files.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {files.map(file => (
              <li key={file.id} style={{ fontSize: 14 }}>
                <a href={file.webViewLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                  <ExternalLink size={14} color="var(--muted)" />
                  <div style={{ color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
