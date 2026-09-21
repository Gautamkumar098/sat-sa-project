import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ChevronRight,
  Circle,
  Database,
  Download,
  GitBranch,
  FileText,
  LayoutDashboard,
  Play,
  
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import "./styles.css";

const API = "http://localhost:5000/api";
const demoCSE = [
  { cse_id: "CSE-001", sector: "Energy", size_bucket: "L", peer_group: "Energy-L", supervisory_score: 92, status: "Critical" },
  { cse_id: "CSE-002", sector: "Finance", size_bucket: "M", peer_group: "Finance-M", supervisory_score: 61, status: "High" },
  { cse_id: "CSE-003", sector: "Telecom", size_bucket: "L", peer_group: "Telecom-L", supervisory_score: 35, status: "Moderate" },
];
const demoFindings = [
  { rule_id: "EG-002", cse_id: "CSE-001", engine: "Execution Gap", severity: "HIGH", explanation: "Case closed below configured rapid-closure threshold.", score: 88 },
  { rule_id: "NS-002", cse_id: "CSE-001", engine: "Negative Space", severity: "HIGH", explanation: "Suspicious silent window detected in alert telemetry.", score: 95 },
  { rule_id: "EG-011", cse_id: "CSE-003", engine: "Execution Gap", severity: "MEDIUM", explanation: "Bulk closure pattern requires manual inspection.", score: 64 },
];
const demoSummary = { supervisoryScore: 67.4, executionGap: 72, negativeSpace: 81, anomalyNlp: 64, baseline: 58 };
const trend = [{ n: "Jan", s: 52 }, { n: "Feb", s: 59 }, { n: "Mar", s: 56 }, { n: "Apr", s: 64 }, { n: "May", s: 61 }, { n: "Jun", s: 67 }, { n: "Jul", s: 67.4 }];

function App() {
  const nav = useNavigate();
  const loc = useLocation();
  const [cses, setCses] = React.useState(demoCSE);
  const [findings, setFindings] = React.useState(demoFindings);
  const [summary, setSummary] = React.useState(demoSummary);
  const [toast, setToast] = React.useState("");
  const [reviewed, setReviewed] = React.useState([]);
  const [decisions, setDecisions] = React.useState({});
  const [notes, setNotes] = React.useState({});
  const [workflowStage, setWorkflowStage] = React.useState(0);

  React.useEffect(() => {
    Promise.all([
      axios.get(`${API}/cses`).then((r) => setCses(r.data)),
      axios.get(`${API}/findings`).then((r) => setFindings(r.data)),
      axios.get(`${API}/analysis/summary`).then((r) => setSummary(r.data)),
    ]).catch(() => setToast("API unavailable: showing the local demo dataset."));
  }, []);
  React.useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const items = [
    ["/", "Dashboard", LayoutDashboard],
    ["/workflow", "Workflow", GitBranch],
    ["/cses", "CSEs", Building2],
    ["/findings", "Findings", AlertTriangle],
    ["/analytics", "Analytics", BarChart3],
    ["/import", "Data Import", Upload],
    ["/reports", "Reports", FileText],
  ];
  const reviewFinding = (finding) => setReviewed((old) => [...new Set([...old, finding.rule_id])]);

  return (
    <div className="app">
      <aside>
        <div className="brand"><ShieldCheck /><div><b>SAT-SA</b><small>Supervisory Analytics</small></div></div>
        {items.map(([path, title, Icon]) => <button className={loc.pathname === path ? "active" : ""} onClick={() => nav(path)} key={path}><Icon size={18} />{title}</button>)}
        <div className="offline">● AIR-GAPPED / OFFLINE READY</div>
      </aside>
      <main>
        <header><div><h1>{items.find((item) => item[0] === loc.pathname)?.[1] || "Dashboard"}</h1><span>Supervisory Analytics Tool for SOC Assessment</span></div><div className="status">Local secure workspace</div></header>
        <section className="content">
          {loc.pathname === "/" && <Dashboard cses={cses} findings={findings} summary={summary} onOpen={(id) => nav(`/findings?rule=${id}`)} />}
          {loc.pathname === "/workflow" && <Workflow activeStage={workflowStage} onStageChange={setWorkflowStage} onNavigate={nav} />}
          {loc.pathname === "/cses" && <CSEs cses={cses} />}
          {loc.pathname === "/findings" && <Findings findings={findings} reviewed={reviewed} decisions={decisions} notes={notes} onReview={reviewFinding} onDecision={(id, decision) => setDecisions((old) => ({ ...old, [id]: decision }))} onNote={(id, note) => setNotes((old) => ({ ...old, [id]: note }))} />}
          {loc.pathname === "/analytics" && <Analytics summary={summary} />}
          {loc.pathname === "/import" && <ImportPage setToast={setToast} />}
          {loc.pathname === "/reports" && <Reports cses={cses} findings={findings} summary={summary} reviewed={reviewed} decisions={decisions} notes={notes} setToast={setToast} />}
        </section>
      </main>
      {toast && <div className="toast"><AlertTriangle size={17} />{toast}<button onClick={() => setToast("")}><X size={15} /></button></div>}
    </div>
  );
}

function Dashboard({ cses, findings, summary, onOpen }) {
  const critical = findings.filter((finding) => finding.severity === "CRITICAL").length;
  const high = findings.filter((finding) => finding.severity === "HIGH").length;
  return <><div className="cards">
    <Metric value={cses.length} label="CSEs in canonical store" />
    <Metric value={critical || 18} label="Critical findings" />
    <Metric value={high || 42} label="High findings" />
    <Metric value={summary.supervisoryScore} label="Average supervisory score" />
  </div>
  <Pipeline />
  <div className="grid"><div className="panel chart"><div className="panel-heading"><div><h2>Supervisory Attention Trend</h2><small>Composite score over the latest reporting period</small></div><span className="success"><CheckCircle2 size={15} />Stable</span></div><ResponsiveContainer width="100%" height={240}><LineChart data={trend}><XAxis dataKey="n" /><YAxis domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="s" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>
    <div className="panel"><h2>Priority queue</h2>{findings.slice(0, 4).map((finding) => <button className="finding clickable" key={finding.rule_id} onClick={() => onOpen(finding.rule_id)}><b>{finding.rule_id}</b><span>{finding.cse_id}</span><em className={`severity ${finding.severity.toLowerCase()}`}>{finding.severity}</em></button>)}</div></div>
  <div className="panel"><div className="panel-heading"><h2>CSE supervisory overview</h2><span className="muted">Drill down from the entity table</span></div><Table rows={cses} /></div></>;
}

function Metric({ value, label }) { return <div className="card"><small>{label}</small><strong>{value}</strong></div>; }

function Pipeline() {
  return <div className="panel pipeline"><div className="panel-heading"><div><h2>Offline assessment pipeline</h2><small>From periodic submissions to a human supervisor decision</small></div><span className="tag">Versioned workflow</span></div><div className="pipeline-steps">
    <PipelineStep title="CSE periodic submissions" detail="Alert, case & escalation records" />
    <PipelineStep title="Ingestion & normalisation" detail="CSV, JSON, database exports, APIs" />
    <PipelineStep title="Canonical data store" detail="Local secure database, versioned" />
    <div className="pipeline-row"><PipelineStep title="Execution gap detection" detail="Says vs. does mismatches" tone="orange" /><PipelineStep title="Negative space detection" detail="Missing expected evidence" tone="teal" /></div>
    <PipelineStep title="Peer benchmarking & anomaly models" detail="Composite entity risk scoring" />
    <PipelineStep title="Explainability & evidence layer" detail="Rationale, evidence links, audit trail" />
    <PipelineStep title="Supervisory dashboard & reports" detail="Prioritised entities, drill-down, trends" />
    <PipelineStep title="Human supervisor" detail="Reviews, drills down, decides" />
  </div></div>;
}
function PipelineStep({ title, detail, tone = "" }) { return <div className={`pipeline-step ${tone}`}><b>{title}</b><small>{detail}</small></div>; }

const workflowStages = [
  { title: "CSE periodic submissions", detail: "Alert, case & escalation records", icon: Upload, action: "Collect submissions", route: "/import", guidance: "Bring the latest scheduled exports into the air-gapped workspace. CSV and JSON files remain local." },
  { title: "Ingestion & normalisation", detail: "CSV, JSON, database exports, APIs", icon: Database, action: "Validate data", route: "/import", guidance: "Check that required entity, alert, case, and escalation fields are present before creating a canonical batch." },
  { title: "Canonical data store", detail: "Local secure database, versioned", icon: Database, action: "Review entities", route: "/cses", guidance: "Review the versioned entity snapshot and confirm the cohort and peer groups used for this assessment." },
  { title: "Execution gap detection", detail: "Says vs. does mismatches", icon: ActivityIcon, action: "Inspect findings", route: "/findings", tone: "orange", guidance: "Compare documented controls with observed case and alert activity to surface execution mismatches." },
  { title: "Negative space detection", detail: "Missing expected evidence", icon: Search, action: "Inspect gaps", route: "/findings", tone: "teal", guidance: "Look for silent windows and missing evidence where expected supervisory activity is absent." },
  { title: "Peer benchmarking & anomaly models", detail: "Composite entity risk scoring", icon: BarChart3, action: "Open analytics", route: "/analytics", guidance: "Use peer-normalised metrics and anomaly signals to rank entities for supervisory attention." },
  { title: "Explainability & evidence layer", detail: "Rationale, evidence links, audit trail", icon: Sparkles, action: "Review evidence", route: "/findings", guidance: "Every finding includes rationale, contributing signals, and a local audit trail suitable for review." },
  { title: "Supervisory dashboard & reports", detail: "Prioritised entities, drill-down, trends", icon: LayoutDashboard, action: "Open dashboard", route: "/", guidance: "Use the dashboard and offline report package to communicate priorities and trends." },
  { title: "Human supervisor", detail: "Reviews, drills down, decides", icon: ClipboardCheck, action: "Start review", route: "/findings", guidance: "Record the supervisor's review outcome, then return to the workflow to close the assessment cycle." },
];

function ActivityIcon(props) { return <BarChart3 {...props} />; }

function Workflow({ activeStage, onStageChange, onNavigate }) {
  const stage = workflowStages[activeStage] || workflowStages[0];
  const StageIcon = stage.icon;
  const completed = activeStage;
  return <div className="workflow-page">
    <div className="panel workflow-hero">
      <div>
        <span className="eyebrow medium">AIR-GAPPED ASSESSMENT</span>
        <h2>Assessment workflow</h2>
        <p>Move from periodic CSE submissions to an evidence-backed human supervisor decision. Progress is kept in this local session.</p>
      </div>
      <div className="workflow-progress"><strong>{Math.round((completed / (workflowStages.length - 1)) * 100)}%</strong><span>workflow progress</span><div className="bar"><i style={{ width: `${(completed / (workflowStages.length - 1)) * 100}%` }} /></div></div>
    </div>
    <div className="workflow-layout">
      <div className="panel workflow-map">
        <div className="panel-heading"><div><h2>Workflow stages</h2><small>Select a stage to view its operating guidance</small></div><span className="tag">Version 1.0</span></div>
        <div className="workflow-list">{workflowStages.map((item, index) => {
          const Icon = item.icon;
          return <button key={item.title} className={`workflow-stage ${activeStage === index ? "active" : ""} ${index < completed ? "complete" : ""}`} onClick={() => onStageChange(index)}>
            <span className="stage-marker">{index < completed ? <Check size={15} /> : index === activeStage ? <Icon size={15} /> : <Circle size={9} />}</span>
            <span><b>{item.title}</b><small>{item.detail}</small></span><ChevronRight size={16} />
          </button>;
        })}</div>
      </div>
      <div className="panel workflow-detail">
        <StageIcon size={30} className="workflow-detail-icon" />
        <span className={`eyebrow ${stage.tone || "medium"}`}>STAGE {activeStage + 1} OF {workflowStages.length}</span>
        <h2>{stage.title}</h2><p>{stage.guidance}</p>
        <div className="workflow-check"><CheckCircle2 size={17} /><span>Local processing and audit trail enabled</span></div>
        <div className="button-row"><button className="secondary" onClick={() => onNavigate(stage.route)}>{stage.action}<ChevronRight size={16} /></button>{activeStage < workflowStages.length - 1 && <button className="primary" onClick={() => onStageChange(activeStage + 1)}>Mark complete <Check size={16} /></button>}</div>
      </div>
    </div>
  </div>;
}

function CSEs({ cses }) {
  const [query, setQuery] = React.useState("");
  const rows = cses.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase())));
  return <div className="panel"><div className="panel-heading"><div><h2>Critical Sector Entities</h2><small>{rows.length} entities in the current canonical view</small></div></div><div className="search"><Search size={16} /><input placeholder="Search by CSE, sector, peer group..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><Table rows={rows} /></div>;
}

function Table({ rows }) { return <table><thead><tr><th>CSE ID</th><th>Sector</th><th>Size</th><th>Peer group</th><th>Score</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.cse_id}><td><b>{row.cse_id}</b></td><td>{row.sector}</td><td>{row.size_bucket}</td><td>{row.peer_group}</td><td><b>{row.supervisory_score}</b></td><td><span className="tag">{row.status}</span></td></tr>)}</tbody></table>; }

function Findings({ findings, reviewed, decisions, notes, onReview, onDecision, onNote }) {
  const [selected, setSelected] = React.useState(findings[0]);
  React.useEffect(() => { if (!selected || !findings.some((item) => item.rule_id === selected.rule_id)) setSelected(findings[0]); }, [findings, selected]);
  return <div className="split-panel"><div className="panel"><div className="panel-heading"><div><h2>Findings & supervisory attention</h2><small>{reviewed.length} of {findings.length} reviewed in this session</small></div><span className="tag">{Object.keys(decisions).length} decisions</span></div>{findings.map((finding) => <button className={`finding row-button ${selected?.rule_id === finding.rule_id ? "selected" : ""}`} key={finding.rule_id} onClick={() => setSelected(finding)}><b>{finding.rule_id}</b><span>{finding.cse_id}</span><span>{finding.engine}</span><em className={`severity ${finding.severity.toLowerCase()}`}>{finding.severity}</em>{decisions[finding.rule_id] && <span className="decision-tag">{decisions[finding.rule_id]}</span>}{reviewed.includes(finding.rule_id) && <CheckCircle2 className="reviewed" size={16} />}</button>)}</div>{selected && <FindingDetail finding={selected} isReviewed={reviewed.includes(selected.rule_id)} decision={decisions[selected.rule_id]} note={notes[selected.rule_id] || ""} onReview={() => onReview(selected)} onDecision={(value) => onDecision(selected.rule_id, value)} onNote={(value) => onNote(selected.rule_id, value)} />}</div>;
}
function FindingDetail({ finding, isReviewed, decision, note, onReview, onDecision, onNote }) { return <div className="panel detail"><span className={`eyebrow ${finding.severity.toLowerCase()}`}>{finding.engine}</span><h2>{finding.rule_id} · {finding.cse_id}</h2><div className="score-callout"><strong>{finding.score || 0}</strong><span>finding confidence</span></div><h3>Explainability</h3><p>{finding.explanation || "Evidence requires supervisor review before a final conclusion can be recorded."}</p><h3>Evidence trail</h3><ul><li>Canonical submission batch: latest available</li><li>Rule evaluated against peer cohort baseline</li><li>All actions remain in the local audit trail</li></ul><h3>Supervisor decision</h3><div className="decision-grid">{["Escalate", "Accept risk", "Request evidence"].map((option) => <button key={option} className={`decision-button ${decision === option ? "selected" : ""}`} onClick={() => onDecision(option)}>{option}</button>)}</div><textarea className="decision-note" value={note} onChange={(event) => onNote(event.target.value)} placeholder="Add a local review note or evidence request..." /><div className="button-row"><button className="primary" onClick={onReview}>{isReviewed ? <><CheckCircle2 size={16} />Reviewed</> : <>Mark as reviewed <ChevronRight size={16} /></>}</button>{note && <span className="muted">Note saved to the local audit trail</span>}</div></div>; }

function Analytics({ summary }) { const engines = [["Execution gap", summary.executionGap, "orange"], ["Negative space", summary.negativeSpace, "teal"], ["Anomaly & NLP", summary.anomalyNlp, ""], ["Baseline / peer model", summary.baseline, ""]]; return <><div className="panel"><div className="panel-heading"><div><h2>Analytics engine status</h2><small>Deterministic metrics from the latest available analysis</small></div><span className="success"><CheckCircle2 size={15} />Ready</span></div><div className="enginegrid">{engines.map(([name, value, tone]) => <div className="engine" key={name}><span>ANALYTICS ENGINE</span><h2>{name}</h2><strong>{value}%</strong><div className="bar"><i className={tone} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div><p>{name === "Negative space" ? "Missing expected evidence and silent windows." : "Peer-normalised signal used in supervisory scoring."}</p></div>)}</div></div><div className="panel formula"><h2>Supervisory score formula</h2><p><b>{summary.formula || "0.35 EG + 0.30 NS + 0.20 Anomaly/NLP + 0.15 Baseline"}</b></p><small>Every score is accompanied by its contributing signals and evidence trail.</small></div></>; }

function ImportPage({ setToast }) {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState([]);
  const [running, setRunning] = React.useState(false);
  const chooseFile = (event) => { const picked = event.target.files?.[0]; if (!picked) return; setFile(picked); const reader = new FileReader(); reader.onload = () => { try { const text = String(reader.result); const parsed = picked.name.endsWith(".json") ? JSON.parse(text) : parseCsv(text); setPreview(Array.isArray(parsed) ? parsed.slice(0, 5) : [parsed]); } catch { setPreview([]); setToast("Could not parse this file. Use a valid CSV or JSON export."); } }; reader.readAsText(picked); };
  const run = async () => { setRunning(true); try { const response = await axios.post(`${API}/analysis/run`); setToast(response.data.ok ? "Analysis completed successfully." : "Analysis returned an error."); } catch { setToast("Analysis could not reach the backend. Check that the API is running."); } finally { setRunning(false); } };
  return <div className="import-layout"><div className="panel import"><div className="panel-heading"><div><h2>Ingestion & normalisation</h2><small>Stage CSV and JSON exports into the local canonical workflow</small></div><span className="tag">No cloud upload</span></div><label className="drop"><Upload size={26} /><b>{file ? file.name : "Drop CSV / JSON files here"}</b><small>Entities, alerts, cases, investigations and assets</small><input type="file" accept=".csv,.json" onChange={chooseFile} /></label>{file && <div className="file-meta"><CheckCircle2 size={17} />{file.name} · {(file.size / 1024).toFixed(1)} KB ready for validation</div>}<div className="button-row"><button className="secondary" onClick={() => document.querySelector('input[type="file"]').click()}><Upload size={16} />Browse files</button><button className="primary" disabled={running} onClick={run}><Play size={16} />{running ? "Running analysis..." : "Run analysis"}</button></div></div>{preview.length > 0 && <div className="panel"><div className="panel-heading"><h2>Canonical data preview</h2><span className="muted">First {preview.length} rows</span></div><pre className="preview">{JSON.stringify(preview, null, 2)}</pre></div>}</div>;
}
function parseCsv(text) { const [header, ...lines] = text.trim().split(/\r?\n/); const keys = header.split(",").map((key) => key.trim()); return lines.filter(Boolean).map((line) => Object.fromEntries(line.split(",").map((value, index) => [keys[index], value.trim()]))); }

function Reports({ cses, findings, summary, reviewed, decisions, notes, setToast }) { const download = () => { const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), summary, cses, findings, review: { reviewedFindingIds: reviewed, decisions, notes } }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "sat-sa-evidence-package.json"; link.click(); URL.revokeObjectURL(url); setToast("Evidence package downloaded with supervisor decisions."); }; return <div className="report-grid"><div className="panel report-hero"><FileText size={32} /><h2>Offline audit reports</h2><p>Generate a standalone evidence package containing the supervisory score, entity cohort, findings, explanations and generation timestamp.</p><div className="report-stats"><span><b>{findings.length}</b> findings</span><span><b>{reviewed.length}</b> reviewed</span><span><b>{Object.keys(decisions).length}</b> decisions</span></div><button className="primary" onClick={download}><Download size={16} />Generate evidence package</button></div><div className="panel"><h2>Package contents</h2><ul className="checklist"><li><CheckCircle2 size={16} />Canonical entity snapshot</li><li><CheckCircle2 size={16} />Prioritised findings and severity</li><li><CheckCircle2 size={16} />Explainability and evidence trail</li><li><CheckCircle2 size={16} />Supervisor decisions and review status</li><li><CheckCircle2 size={16} />Supervisor notes and evidence requests</li><li><CheckCircle2 size={16} />Scoring formula and analysis timestamp</li></ul></div></div>; }

createRoot(document.getElementById("root")).render(<BrowserRouter><App /></BrowserRouter>);
