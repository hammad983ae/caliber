# PRD: Voice-Driven Automation App
**Version:** 0.2
**Status:** Draft

---

## 1. Summary

An app where users describe what they want in natural language (spoken or typed), and the AI interprets that intent, proposes an automation, and — once confirmed — executes it against real apps, web services, and devices. Supports single-step and multi-step (chained) automations, for both individual users and teams.

## 2. Problem statement

Setting up automations today (Zapier, IFTTT, Shortcuts, etc.) requires users to know what's possible and manually configure triggers/actions. Most people can describe what they want in plain language far more easily than they can build it. This product removes that translation step and closes the loop all the way to execution.

## 3. Goals

- Capture user intent reliably from voice or text.
- Have the AI propose correct, specific automations from that intent.
- Execute those automations against real connected systems, with a permission model the user trusts.
- Support automations that chain multiple steps together, not just single actions.
- Support team/business use: shared automations, roles, and approval where relevant.

## 4. Users

- **Primary:** individual consumers automating personal digital tasks (email, calendar, reminders, smart home).
- **Secondary:** small business/team users automating shared workflows (e.g. "when a new lead comes in, notify sales and create a task").

## 5. Feature 1: Voice/Text Input

### 5.1 Description
A single input surface where the user can either speak or type a request.

### 5.2 User stories
- As a user, I want to press a mic button and say what I want, so I don't have to type.
- As a user, I want to type instead, when voice isn't convenient.
- As a user, I want to see my spoken words transcribed in real time, so I can confirm it understood me.
- As a user, I want to edit the transcribed text before submitting.

### 5.3 Functional requirements
| ID | Requirement |
|----|-------------|
| F1.1 | Tap a mic icon to start/stop voice capture |
| F1.2 | Speech transcribed to text and shown live (streaming) |
| F1.3 | User can edit transcribed text before submitting |
| F1.4 | User can type directly into the same input field, bypassing voice |
| F1.5 | Graceful handling of no-speech-detected / low-confidence transcription (re-prompt, don't fail silently) |
| F1.6 | Input history saved so users can view/reuse past requests |

### 5.4 Non-functional requirements
- Partial transcription within ~300ms of speech; final transcript within ~1s of the user stopping.
- Works across modern browsers' mic permission model (web app).

### 5.5 Open questions
- STT provider: browser-native Web Speech API (free, lower quality) vs. hosted model (Whisper-class, better accuracy, added latency/cost)?
- Multi-language support now or later?
- Auto-submit after a pause, or always require explicit submit?

---

## 6. Feature 2: AI Suggesting Automations

### 6.1 Description
Given the input, the AI interprets intent and returns one or more concrete automation suggestions for the user to review before anything runs.

### 6.2 User stories
- As a user, I want the AI to propose a specific automation based on what I said, so I know exactly what it will do.
- As a user, if my request is ambiguous, I want a clarifying question rather than a guess.
- As a user, if multiple interpretations are reasonable, I want a short ranked list of options.
- As a user, I want to see why the AI suggested this (trigger, action, data used), so I can trust it.

### 6.3 Functional requirements
| ID | Requirement |
|----|-------------|
| F2.1 | AI parses input into structured intent (trigger, condition, action, and — where relevant — subsequent steps) |
| F2.2 | AI returns a plain-language summary plus a structured breakdown |
| F2.3 | Low confidence or ambiguity → clarifying follow-up instead of a guess |
| F2.4 | Multiple reasonable interpretations → up to 3 ranked suggestions |
| F2.5 | User can accept, edit, reject, or ask for a different suggestion |
| F2.6 | Accept/reject/edit outcomes are logged to measure suggestion quality over time |
| F2.7 | Suggestions are scoped to automations the connector layer can actually run (see Feature 3) — no proposing things it can't execute |

### 6.4 Non-functional requirements
- Suggestion latency target: under ~3s from submission to displayed suggestion.
- Clearly say "I can't automate that yet" for out-of-scope requests rather than hallucinating.

### 6.5 Open questions
- Exact shape of a "suggestion" object — plain sentence, structured card, or both — and how that same object gets handed to the execution layer once accepted.
- How to measure suggestion quality: acceptance rate, plus manual review of a sample.

---

## 7. Feature 3: Execution Engine

### 7.1 Description
Once a suggested automation is accepted, this layer actually performs it — calling the relevant connectors (apps, web APIs, IoT devices) in the right order, and reporting back what happened.

### 7.2 User stories
- As a user, once I accept a suggestion, I want it to actually run — not just be logged as a plan.
- As a user, I want to know when an automation succeeded, partially succeeded, or failed, in plain language.
- As a user, I want a history/log of everything the app has done on my behalf.
- As a user, I want to undo an action where that's possible.

### 7.3 Functional requirements
| ID | Requirement |
|----|-------------|
| F3.1 | Connector framework: each integration (Gmail, Calendar, Slack, Hue, etc.) is a self-contained module with its own auth and API calls |
| F3.2 | Execution engine runs an accepted automation's steps in order, handling per-step success/failure |
| F3.3 | Partial-failure handling: if step 2 of 3 fails, the system reports exactly what completed and what didn't — never silently rolls forward |
| F3.4 | Every execution is logged with timestamp, inputs, outputs, and status, in an auditable activity log |
| F3.5 | Undo is supported wherever the underlying API allows it (e.g. delete a created event); where it isn't possible, this is stated clearly to the user before execution |
| F3.6 | Retry logic for transient failures (rate limits, timeouts) with backoff, distinct from genuine action failures |

### 7.4 Non-functional requirements
- Each connector call should complete or fail within a bounded timeout; the user should never be left wondering if something is stuck.
- Connector framework should let a new integration be added without touching the orchestrator or permission logic.

### 7.5 Open questions
- Initial connector set for launch — which 5-6 integrations give the best first-impression coverage across apps, web services, and IoT?
- How much retry/backoff logic lives in each connector vs. shared in the engine?

---

## 8. Feature 4: Permission / Confirm-Before-Execute Flow

### 8.1 Description
A safety layer that gates execution — especially for destructive or hard-to-reverse actions — behind explicit user confirmation, with the ability to loosen this over time as trust is established.

### 8.2 User stories
- As a user, I want to confirm before anything destructive or hard-to-reverse happens (sending an email, deleting something, unlocking a door).
- As a user, I want to grant "always allow" for specific low-risk, repeated actions, so I'm not confirming the same thing every time.
- As a user, I want to see exactly what permissions/scopes each connector has been granted, and revoke them.
- As a business/team admin, I want certain automations to require a second person's approval before running.

### 8.3 Functional requirements
| ID | Requirement |
|----|-------------|
| F4.1 | Every automation is classified by risk tier (e.g. read-only, reversible-write, destructive/irreversible) |
| F4.2 | Destructive/irreversible actions always require explicit confirmation by default |
| F4.3 | Users can mark specific automations as "always allow" to skip repeated confirmation |
| F4.4 | Per-connector permission/scope view, with revoke capability |
| F4.5 | (Team) Admin-configurable approval chains: certain automations require sign-off from a second user before executing |
| F4.6 | Confirmation prompts show the same structured breakdown from Feature 2, so what's approved matches exactly what runs |

### 8.4 Open questions
- Who defines the risk-tier classification per action type — a fixed rule set, or connector-declared metadata?
- Default "always allow" behavior — opt-in only, or suggested after N successful confirmations of the same action?

---

## 9. Feature 5: Multi-Step Chained Automations

### 9.1 Description
Automations that involve more than one action, potentially across multiple connectors, executed in sequence (and eventually with conditional branching).

### 9.2 User stories
- As a user, I want to say "block my calendar for the next 3 hours and mute Slack" and have both happen together.
- As a user, I want a multi-step automation to stop and tell me clearly if one step fails partway through.
- As a user, I want to save a multi-step automation as a reusable shortcut I can trigger again later.

### 9.3 Functional requirements
| ID | Requirement |
|----|-------------|
| F5.1 | AI orchestrator can decompose a request into an ordered list of steps across one or more connectors |
| F5.2 | Execution engine runs steps in order (or in parallel where independent), respecting Feature 7's partial-failure handling |
| F5.3 | User can save an accepted multi-step automation as a named, reusable shortcut |
| F5.4 | Basic conditional logic supported ("if it rains, do X, else Y") — scope conditions to a defined set for v1 |
| F5.5 | Saved shortcuts appear in a library the user can browse, edit, or delete |

### 9.4 Open questions
- How far should conditional logic go in v1 — simple if/else, or something closer to a full workflow builder? (Recommend starting simple; this can expand significantly in scope.)
- Do chained steps across different connectors need a shared "context" object (e.g. the meeting time chosen in step 1 needs to be available to step 2)?

---

## 10. Feature 6: Business / Team Features

### 10.1 Description
Support for teams sharing automations, with role-based permissions and visibility, on top of the individual-user experience.

### 10.2 User stories
- As a team admin, I want to create automations that any team member can trigger by voice.
- As a team admin, I want to control who can create, edit, or run which automations.
- As a team member, I want to see a shared log of team automations that have run, not just my own.
- As a team admin, I want certain automations to require approval before running (ties to Feature 4).

### 10.3 Functional requirements
| ID | Requirement |
|----|-------------|
| F6.1 | Workspace/team concept distinct from individual accounts |
| F6.2 | Role-based access: who can create, edit, run, and approve automations |
| F6.3 | Shared connector credentials at the team level (e.g. a shared Slack workspace connection), separate from personal connectors |
| F6.4 | Team-visible activity log, filterable by automation, user, or connector |
| F6.5 | Approval chains from Feature 4 configurable per automation at the team level |

### 10.4 Open questions
- Do individual users and team workspaces share the same connector/permission model, or does the team layer need its own?
- Billing/seat model isn't covered in this PRD — flag as a dependency for whoever owns pricing.

---

## 11. UX & UI Flow

### 11.1 Core screens

| Screen | Purpose | Key elements |
|--------|---------|---------------|
| Home / Input | Entry point for every request | Mic button, text field, live transcript, input history |
| Suggestion review | Show what the AI proposed | Plain-language summary, structured trigger/action breakdown, accept / edit / reject / "suggest another" actions |
| Clarification (in-line chat) | Resolve ambiguity before a suggestion is finalized | Short back-and-forth thread, appears inline under the input, not a separate screen |
| Confirmation modal | Gate execution for risky actions | Restates exactly what will run, risk-tier indicator, confirm / cancel / "always allow this" |
| Execution status | Show what's happening / happened | Per-step progress, success / partial / failure state, plain-language outcome |
| Activity log | Full history, auditable | Filterable by date, connector, status; undo action where available |
| Automation library | Saved multi-step shortcuts | List of named shortcuts, run / edit / delete, trigger phrase shown |
| Connector settings | Manage integrations | Connected apps/services/devices, per-connector scopes, revoke access |
| Team workspace (admin) | Shared automations & governance | Shared automation list, role management, approval-chain configuration, team activity log |

### 11.2 Primary flow (individual user, single-step)

1. **Input** — user speaks or types a request on the Home screen.
2. **Clarify (conditional)** — if ambiguous, an inline follow-up question appears; user answers before continuing.
3. **Suggestion review** — AI presents the proposed automation as a summary + structured breakdown. User accepts, edits, rejects, or asks for another option.
4. **Confirmation (conditional)** — if the action is risky/irreversible, a confirmation modal restates it exactly; user confirms or cancels.
5. **Execution status** — real-time progress shown; on completion, a plain-language outcome ("Done — event moved to 4pm") appears.
6. **Activity log** — the completed automation is recorded automatically; undo is offered here if available.

### 11.3 Multi-step flow (variation)

Same as above, but the suggestion review screen shows an ordered list of steps rather than one action, and the user can accept/reject at the whole-automation level or edit individual steps. On completion, the user is offered the option to save the automation as a reusable shortcut into the Automation library.

### 11.4 Team flow (variation)

An admin builds or approves a shared automation the same way an individual would, but with an added visibility toggle ("make available to team") and, where configured, an approval-chain step: the automation is proposed, routed to an approver, and only executes after sign-off. Team members can trigger existing shared automations by voice without going through suggestion review again (it's already approved) — only new/modified automations go through the full flow.

### 11.5 States to design for explicitly

- **Empty state** (no history yet) — should invite a first request, not just show a blank box.
- **Low-confidence transcription** — re-prompt rather than silently proceeding on a bad guess.
- **No reasonable suggestion available** — clear "can't automate that yet" message, not a fabricated suggestion.
- **Partial execution failure** — explicit about what completed and what didn't, never a generic error.
- **Revoked/expired connector auth** — surfaced proactively (not just at execution time), with a clear path to reconnect.

### 11.6 Open questions
- Does clarification happen as inline chat under the input, or does it interrupt with a modal? (Recommend inline — keeps the voice-first feel conversational rather than form-like.)
- For team members triggering pre-approved shared automations, how much of the structured breakdown should still be spoken back for confirmation vs. just running silently?

---

## 12. Success metrics

- % of voice inputs transcribed without correction
- % of AI suggestions accepted as-is
- % of executions that succeed fully / partially / fail
- % of confirmations approved vs. rejected (signals whether the risk-tiering is calibrated correctly)
- Adoption of saved multi-step shortcuts (reuse rate)
- Team: # of shared automations created, # of team members actively triggering them

## 13. Risks

- Combining execution + multi-step + permissions in one build is a lot of surface area — sequencing within engineering (even if all in scope for the product) matters a lot. Recommend confirming build order with engineering even though all six features are in scope for this PRD.
- Getting the risk-tier classification wrong (Feature 8) is the single biggest trust risk — an automation that should have required confirmation but didn't is worse than an overly cautious one.
- Team/approval features (Features 6 and 10) add real complexity to the permission model; make sure Feature 4's design anticipates this from the start rather than retrofitting it.
- Multi-step conditional logic (F5.4) can expand scope indefinitely if not bounded early.

## 14. Out of scope (explicitly, for now)

- Proactive/trigger-based automation not invoked by voice or text (e.g. "automatically do X whenever Y happens" without the user asking in the moment) — this is a natural next step after the above but is a distinct feature set
- Public connector marketplace / third-party-built integrations
- Billing and seat management for teams

---

*Open decisions that should be resolved before engineering scoping: connector launch set (7.5), risk-tier classification method (8.4), and how far conditional logic goes in v1 (9.4).*
