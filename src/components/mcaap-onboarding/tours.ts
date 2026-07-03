/* tours.ts — content model for the MCAAP onboarding tours.
   Edit this file to add / reorder tours and steps. Each step targets a real
   [data-tour] element on the page named by `page`. Steps with no `target`
   render as a centered card (used only for the intro). */

export interface Step {
  title: string;
  body: string;
  illus: string;                 // key into ILLUS (illustrations.ts)
  target?: string;               // CSS selector to spotlight; omit for a centered card
  page?: string;                 // navigate the host app here before painting the step
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Tour {
  id: string;
  title: string;
  tagline: string;
  icon: string;                  // key into the component's ICONS map
  color: string;
  minutes: number;
  primary?: boolean;             // rendered full-width at the top of the menu
  steps: Step[];
}

const NAVY = '#1D3557', BLUE = '#0073E6', GOLD = '#B5851C', GREEN = '#16A34A';

export const TOURS: Tour[] = [
    {
      id: 'getting-started', title: 'Getting Started', tagline: 'The whole platform in nine stops',
      icon: 'map', color: NAVY, minutes: 3, primary: true,
      steps: [
        { illus: 'gs_welcome', title: 'Welcome to MCAAP', body: 'Your agency operations command center — tasks, clearance, memos, briefings and an AI agent fleet, all in one place. This quick tour shows where everything lives and how the pieces fit together. Use the arrow keys or the buttons below to move; press Esc to leave anytime — you can pick right back up from the “?” menu.', page: 'dashboard' },
        { illus: 'gs_explore', target: '[data-tour="nav-explore"]', placement: 'bottom', title: 'Explore', page: 'dashboard', body: 'Your window into the underlying data. Search or browse every collection, device, topic and person that has been ingested — plus a map view and saved subscriptions. Everything else in the platform draws on what lives here.' },
        { illus: 'gs_tasks', target: '[data-tour="nav-tasks"]', placement: 'bottom', title: 'Tasks', page: 'dashboard', body: 'The production board — every piece of work moving from Backlog to Done. It’s where you plan the day, hand work to your AI agent fleet, and watch pieces advance across each workflow’s pipeline.' },
        { illus: 'gs_workspaces', target: '[data-tour="nav-workspaces"]', placement: 'bottom', title: 'Workspaces', page: 'dashboard', body: 'Your specialized workflows live behind this menu: Clearance, Memos, Prep, Briefing Books, Language Exploitation, Data Upload and Triage. Each one is a focused space for a single kind of work — open the menu to jump into any of them.' },
        { illus: 'gs_termbase', target: '[data-tour="termbase"]', placement: 'bottom', title: 'The term base', page: 'dashboard', body: 'Shared, agency-approved terminology, translations and entity names. Anything you or an agent produces draws on the same vocabulary, so names and phrasing stay consistent across every document.' },
        { illus: 'gs_agents', target: '[data-tour="agents"]', placement: 'bottom', title: 'Your agent fleet', page: 'dashboard', body: 'Watch AI agents work in real time. The badge tells you how many runs are live and how many are paused waiting for your sign-off. Open it to peek at any run’s step-by-step activity, approve a gate, or pause it.' },
        { illus: 'gs_profile', target: '[data-tour="avatar"]', placement: 'bottom', title: 'You & your settings', page: 'dashboard', body: 'Your profile, notification preferences and sign-out live under your avatar. It’s also where your assigned queues and personal defaults are set.' },
        { illus: 'gs_help', target: '[data-tour="help"]', placement: 'bottom', title: 'Help is always here', page: 'dashboard', body: 'Reopen this tutorial anytime from the “?” button. Every workflow has its own short tour, and you can follow a role-based learning path — pick the one that matches how you work.' },
        { illus: 'gs_celebrate', title: 'That’s the lay of the land', body: 'You’ve seen the whole platform. From here, pick the workflow you live in — Tasks, Clearance, Triage, and the rest each have a focused tour that goes deeper. Choose one from the menu, or dive straight into your work.', page: 'dashboard' }
      ]
    },
    {
      id: 'tasks-agents', title: 'Tasks & AI Agents', tagline: 'Run the board and delegate to your fleet',
      icon: 'check_square', color: BLUE, minutes: 4,
      steps: [
        { illus: 'ta_board', target: '[data-tour="tasks-title"]', placement: 'bottom', page: 'tasks-board', title: 'This is Tasks', body: 'Every piece of production work — from press clearance to deposition prep — tracked in one place and moving from intake to done. It’s the single board the whole team plans around.' },
        { illus: 'ta_views', target: '[data-tour="tasks-views"]', placement: 'bottom', title: 'Three ways to see the work', body: 'Board groups work by status into columns. List flattens everything into a sortable table for triage. Calendar plots items by due date so you can spot crunch. Switch freely — it’s the same work, framed differently.' },
        { illus: 'ta_new', target: '[data-tour="tasks-new"]', placement: 'bottom', title: 'Add a request', body: 'New Request opens a card in seconds — give it a title, a workflow, an owner and a due date. It lands in Backlog, ready to be picked up or assigned.' },
        { illus: 'ta_workflows', target: '[data-tour="tasks-workflows"]', placement: 'bottom', title: 'Filter by pipeline', body: 'Each workflow — press clearance, relevance coding, brief review, privilege sign-off and more — has its own pipeline with its own columns. Pick one to focus the board on just that kind of work; the count next to each chip shows what’s open.' },
        { illus: 'ta_move', target: '[data-tour="tasks-board"]', placement: 'top', title: 'Move work across columns', body: 'Drag a card from one column to the next to advance it. Whatever column it sits in is its status — there’s no separate “update status” step. Drop it in Done and it’s closed out.' },
        { illus: 'ta_card', target: '[data-tour="tasks-board"]', placement: 'top', title: 'What’s on a card', body: 'Each card carries the essentials at a glance: title, workflow, assignee, due date and a priority flag. Overdue items are marked so nothing slips. Click a card to open the full item and its history.' },
        { illus: 'ta_assignee', target: '[data-tour="tasks-assignee"]', placement: 'bottom', title: 'People or agents', body: 'Split the board between People and AI Agents. Any card can be handed to an agent to run — look for “Run with…” on a card. Agent-owned cards move themselves as the run progresses.' },
        { illus: 'ta_autonomy', target: '[data-tour="tasks-board"]', placement: 'top', title: 'Three levels of autonomy', body: 'When you delegate, you choose how much rope the agent gets. Autonomous runs to completion, then reports back. Checkpoints pauses at key gates for your sign-off. Co-pilot proposes every step for you to accept. Pick the trust level that fits the task.', page: 'tasks-board' },
        { illus: 'ta_fleet', target: '[data-tour="agents"]', placement: 'bottom', title: 'Watch & approve your fleet', body: 'Your agent fleet lives up here. It shows how many runs are working now and how many are paused waiting on you. Open any run to follow its steps live, approve a checkpoint, or take the work back.' }
      ]
    },
    {
      id: 'clearance', title: 'Clearance', tagline: 'Screen statements before they go public',
      icon: 'megaphone', color: GREEN, minutes: 3,
      steps: [
        { illus: 'cl_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'clearance', title: 'This is Clearance', body: 'Clearance screens public statements — press releases, media statements, talking points — before they’re released to the world.' },
        { illus: 'cl_protect', target: '[data-tour="ws-blurb"]', placement: 'bottom', title: 'What it protects against', body: 'Every draft is checked against the case’s privileged material, active protective orders, and professional-conduct rules like Rule 3.6 on trial publicity — so nothing sensitive or improper goes out the door.' },
        { illus: 'cl_screen', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Screen or add a statement', body: 'Run VESTA to AI-screen a draft against the case’s confidential materials, or add a new statement to begin. VESTA reads the draft, cross-references it, and returns findings ranked by risk.' },
        { illus: 'cl_queue', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Your queue', body: 'Switch between Assigned to me, My team and All to control which statements you see. The count on each tab tells you how much is waiting.' },
        { illus: 'cl_table', target: '[data-tour="ws-table"]', placement: 'top', title: 'The clearance queue', body: 'Every statement in flight, with its current stage and owner. Open any row to drop into the review — the AI findings sit alongside the draft, each one linked to the material it’s concerned about.' },
        { illus: 'cl_route', target: '[data-tour="ws-table"]', placement: 'top', title: 'Review, revise, route', body: 'Inside a statement you work each finding in turn: accept a suggested revision, edit it, or dismiss it with a reason. When it’s clean, route it to counsel for final clearance. Every action is stamped into an audit trail, so there’s always a record of who cleared what.', page: 'clearance' }
      ]
    },
    {
      id: 'memos', title: 'Memos', tagline: 'Concur and pass memos up the chain',
      icon: 'route', color: NAVY, minutes: 3,
      steps: [
        { illus: 'me_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'memos', title: 'This is Memos', body: 'Memos move decision documents upward — each one is read, concurred on, and passed to the next person in the chain until it reaches the deciding authority.' },
        { illus: 'me_why', target: '[data-tour="ws-blurb"]', placement: 'bottom', title: 'Why memos are routed', body: 'A memo isn’t just a document — it’s a decision working its way up. Routing captures who has seen it, who agreed, and who still needs to weigh in, so accountability is never in question.' },
        { illus: 'me_start', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a memo', body: 'Create a new memo when you need to put a decision or recommendation in writing. You set the routing chain — the people who must concur, in order — as you send it.' },
        { illus: 'me_awaiting', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'What’s awaiting you', body: 'Your queue surfaces memos waiting on your concurrence, held separate from what the rest of your team is handling, so your action items never get buried.' },
        { illus: 'me_track', target: '[data-tour="ws-table"]', placement: 'top', title: 'Read, concur, track', body: 'Open a memo to read it, add your concurrence, or send it back with comments. A routing timeline shows exactly where it sits — who’s signed off, who’s next, and how long each stage has taken.' }
      ]
    },
    {
      id: 'prep', title: 'Prep', tagline: 'Draft memos & assessments from templates',
      icon: 'pen', color: GOLD, minutes: 3,
      steps: [
        { illus: 'pr_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'prep', title: 'This is Prep', body: 'Prep is your drafting workspace — start memos and assessments from proven templates instead of a blank page.' },
        { illus: 'pr_why', target: '[data-tour="ws-blurb"]', placement: 'bottom', title: 'Why start from a template', body: 'Templates carry the structure, required sections and boilerplate your agency expects. Starting from one means the format is right from the first keystroke, so review later is about substance, not formatting.' },
        { illus: 'pr_start', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a draft', body: 'Spin up a new draft from a template. The skeleton and standard language come pre-filled; you drop in the specifics and let AI assist help with phrasing, citations and consistency.' },
        { illus: 'pr_scope', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Yours vs the team’s', body: 'Filter to the drafts you’re collaborating on, or see everything your team has in flight so nothing is duplicated or forgotten.' },
        { illus: 'pr_handoff', target: '[data-tour="ws-table"]', placement: 'top', title: 'Write, then hand off', body: 'Open a draft to write with AI assist. When it’s ready, send it straight into Memos for concurrence or Clearance for screening — the document carries its context with it, so the next workspace picks up where you left off.' }
      ]
    },
    {
      id: 'briefings', title: 'Briefing Books', tagline: 'Build and collate briefing books',
      icon: 'book', color: GOLD, minutes: 3,
      steps: [
        { illus: 'br_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'briefings', title: 'This is Briefing Books', body: 'Assemble polished, multi-section books that pull together everything a principal needs for a meeting or event — in one shareable package.' },
        { illus: 'br_stats', target: '[data-tour="brief-stats"]', placement: 'bottom', title: 'Track the pipeline', body: 'The stats up top show your build queue, what’s been distributed, what’s awaiting feedback, and your average receiver rating — so you can see the whole operation at a glance.' },
        { illus: 'br_views', target: '[data-tour="brief-views"]', placement: 'bottom', title: 'Queue vs history', body: 'Flip between books you’re still building and the history of distributed books. The history view carries the feedback and ratings readers left, so you learn what worked.' },
        { illus: 'br_start', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a new book', body: 'Create a book and give it a purpose and audience. That framing shapes which sections and sources you’ll want to collate into it.' },
        { illus: 'br_collate', target: '[data-tour="brief-grid"]', placement: 'top', title: 'Open and collate a book', body: 'Open any book to add and reorder sections — memos, assessments, maps, source excerpts — pulling directly from the rest of the platform. Reorder by dragging until the narrative flows.' },
        { illus: 'br_publish', target: '[data-tour="brief-grid"]', placement: 'top', title: 'Publish, distribute, learn', body: 'When the book is complete, publish it and distribute it to your readers. Recipients can rate it and leave feedback, which flows back into the history view — closing the loop so each book is better than the last.', page: 'briefings' }
      ]
    },
    {
      id: 'language', title: 'Language Exploitation', tagline: 'Turn what your team knows into shared knowledge',
      icon: 'bulb', color: GREEN, minutes: 3,
      steps: [
        { illus: 'la_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'knowledge', title: 'This is Language Exploitation', body: 'This workspace turns what your team knows — including knowledge that only lives in people’s heads — into shared, searchable, endorsed articles.' },
        { illus: 'la_why', target: '[data-tour="lang-banner"]', placement: 'bottom', title: 'Why capture knowledge', body: 'Hard-won context — how a source phrases things, what an acronym really means, who’s connected to whom — usually evaporates when a person moves on. Capturing it here means the next analyst inherits it instead of relearning it.' },
        { illus: 'la_capture', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Capture knowledge', body: 'Start a capture from a source document or a quick note whenever you learn something worth keeping. It becomes a draft article you can refine and share.' },
        { illus: 'la_articles', target: '[data-tour="lang-articles"]', placement: 'top', title: 'Knowledge articles', body: 'Documented know-how, written up and endorsed by the team so it can be trusted. Each article is searchable across the platform and linked to the entities and sources it describes.' },
        { illus: 'la_endorse', target: '[data-tour="lang-articles"]', placement: 'top', title: 'Endorsed, so it’s trusted', body: 'An article isn’t just one person’s opinion — teammates endorse it, and those endorsements travel with it. When you find an article later, you can see who stands behind it and how current it is.', page: 'knowledge' },
        { illus: 'la_sources', target: '[data-tour="lang-sources"]', placement: 'left', title: 'Connect the sources', body: 'Link the tools where notes already live — so nothing stays stranded outside the ecosystem. Connected sources feed straight into capture.' },
        { illus: 'la_stuck', target: '[data-tour="lang-capture"]', placement: 'left', title: 'Capture what’s stuck', body: 'The system surfaces knowledge trapped in one person’s notes and suggests it for capture. Turn a private note into a shared, endorsed article in a click.' }
      ]
    },
    {
      id: 'upload', title: 'Data Upload', tagline: 'Bring datasets into the ecosystem',
      icon: 'database', color: NAVY, minutes: 3,
      steps: [
        { illus: 'up_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'upload', title: 'This is Data Upload', body: 'The front door for new material — datasets, device extractions and files entering the ecosystem. Everything downstream starts with a clean intake here.' },
        { illus: 'up_describe', target: '[data-tour="upload-details"]', placement: 'right', title: 'Describe the dataset', body: 'Name it and set the source, category and classification. Good intake metadata is what makes the data findable, filterable and trusted later — so it’s worth getting right up front.' },
        { illus: 'up_classify', target: '[data-tour="upload-details"]', placement: 'right', title: 'Set the classification', body: 'The classification you choose controls who can see the data once it’s ingested. It travels with every file and every downstream artifact, so access control is enforced automatically from this point on.' },
        { illus: 'up_files', target: '[data-tour="upload-files"]', placement: 'top', title: 'Add the files', body: 'Drag files onto the dropzone — TIFF, CSV, GeoJSON, PDF, ZIP and more — and watch each one upload with a progress bar. Mixed file types in one dataset are fine.' },
        { illus: 'up_submit', target: '[data-tour="upload-checklist"]', placement: 'left', title: 'Submit to ingest', body: 'The intake checklist tracks what’s still required before you can submit. Complete it, hit submit, and the dataset is validated and queued for ingest.' },
        { illus: 'up_next', target: '[data-tour="upload-checklist"]', placement: 'left', title: 'What happens next', body: 'Once submitted, the platform validates the files, indexes their contents, links geotags and entities, and applies your classification. When it finishes, the dataset appears in Explore — searchable by everyone cleared to see it.', page: 'upload' }
      ]
    },
    {
      id: 'triage', title: 'Triage', tagline: 'First-pass coding & sign-offs',
      icon: 'eye', color: GREEN, minutes: 3,
      steps: [
        { illus: 'tr_intro', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'review', title: 'This is Triage', body: 'Triage gives new items their first pass — coded for relevance, signed off, and tracked with a full change history.' },
        { illus: 'tr_gate', target: '[data-tour="ws-blurb"]', placement: 'bottom', title: 'The first gate', body: 'Triage is where raw material becomes usable. A quick, consistent first read separates what’s relevant from what’s noise, so second-level reviewers and agents only spend time on what matters.' },
        { illus: 'tr_jump', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Jump in', body: 'Start review opens the first item in your queue and puts you straight into the coding view — no hunting for where to begin.' },
        { illus: 'tr_scope', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Focus your queue', body: 'Work what’s assigned to you, or take on the whole team’s backlog when you have capacity. The counts show how deep each queue runs.' },
        { illus: 'tr_queue', target: '[data-tour="ws-table"]', placement: 'top', title: 'The review queue', body: 'Every item waiting for a first pass, with its type and current state. Open one to start coding; the queue advances you to the next as you go.' },
        { illus: 'tr_signoff', target: '[data-tour="ws-table"]', placement: 'top', title: 'Code, flag, sign off', body: 'Inside an item you tag it with issue codes, mark it relevant or not, and flag anything hot for a closer look. Sign off to commit your decision — every call is recorded with who, what and when, so the chain of review is fully auditable.', page: 'review' }
      ]
    },
    {
      id: 'explore', title: 'Explore & Search', tagline: 'Find anything in the ecosystem',
      icon: 'search', color: BLUE, minutes: 3,
      steps: [
        { illus: 'ex_search', target: '[data-tour="explore-search"]', placement: 'bottom', page: 'explore', title: 'Search across everything', body: 'One search bar spans every ingested source — files, folders and people. Type keywords, or narrow with the query builder and search within file contents.' },
        { illus: 'ex_ai', target: '[data-tour="explore-search"]', placement: 'bottom', title: 'Or just ask, in plain language', body: 'Flip on AI Mode and ask the way you’d ask a colleague — “which devices were near the warehouse in March?” The system interprets intent instead of matching keywords, and shows you what it drew on.' },
        { illus: 'ex_browse', target: '[data-tour="explore-browse"]', placement: 'bottom', title: 'Or browse', body: 'Don’t have a query yet? Browse by Collections, Topics, Devices and People. The graph is fully linked, so from any one you can pivot to everything connected to it.' },
        { illus: 'ex_tabs', target: '[data-tour="explore-tabs"]', placement: 'bottom', title: 'Map & subscriptions', body: 'Switch tabs to work geospatially or stay current. Map lets you draw an area and pull everything inside it; Subscriptions saves a search to re-run automatically.' },
        { illus: 'ex_map', target: '[data-tour="explore-tabs"]', placement: 'bottom', title: 'Draw an area on the map', body: 'In Map view, draw a polygon around anywhere on earth and the platform returns every geotagged item inside it — reports, imagery, signals, sensors. Drag a vertex to reshape the area, and save it to the polygon repo to reuse later.', page: 'explore' },
        { illus: 'ex_subscribe', target: '[data-tour="explore-tabs"]', placement: 'bottom', title: 'Subscribe to a search', body: 'Save any search as a subscription and it re-runs on its own, flagging new results as they arrive. It’s how you keep watch on a topic, a person or an area without checking back manually.', page: 'explore' }
      ]
    }
];

export interface Role {
  id: string;
  label: string;
  icon: string;
  color: string;
  blurb: string;
  tours: string[];   // recommended tour ids, in order (Getting Started auto-pinned)
}

export const ROLES: Role[] = [
  { id: 'ops',       label: 'Operations Lead',    icon: 'map',       color: NAVY,  blurb: 'Run the board, delegate to agents, keep work moving.',        tours: ['tasks-agents', 'explore', 'clearance', 'briefings'] },
  { id: 'cmo',       label: 'Collection Manager', icon: 'database',  color: NAVY,  blurb: 'Bring data in and make it findable across the ecosystem.',    tours: ['upload', 'explore', 'tasks-agents'] },
  { id: 'exploiter', label: 'Language Exploiter', icon: 'bulb',      color: GREEN, blurb: 'Turn source material & tribal knowledge into shared intel.',  tours: ['language', 'upload', 'explore'] },
  { id: 'clearance', label: 'Clearance Officer',  icon: 'megaphone', color: GREEN, blurb: 'Screen statements and route decisions for sign-off.',        tours: ['clearance', 'memos', 'explore'] },
  { id: 'briefer',   label: 'Reports & Briefings',icon: 'book',      color: GOLD,  blurb: 'Draft, concur, and assemble briefing books.',                tours: ['prep', 'memos', 'briefings', 'explore'] },
  { id: 'reviewer',  label: 'Triage Reviewer',    icon: 'eye',       color: GREEN, blurb: 'First-pass coding, relevance calls and sign-offs.',           tours: ['triage', 'explore', 'tasks-agents'] },
];

