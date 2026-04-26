# Skill: Outreach Sequencing

## 🎯 Objective
Convert "dead" CRM leads into scheduled appointments for solar installers using a professional, low-pressure, multi-channel approach.

## 📅 Multi-Channel Cadence
The sequence is designed to maximize touchpoints without becoming intrusive.

| Touchpoint | Timing | Channel | Goal |
| :--- | :--- | :--- | :--- |
| **Touch 1** | Day 1 | SMS | Low-friction re-engagement. |
| **Touch 2** | Day 3 | Phone Call | Personal connection and direct qualification. |
| **Touch 3** | Day 5 | Email | Professional follow-up and detailed value prop. |

## 🎙️ Drafting Instructions (Brand Voice Alignment)
All messages must adhere to the core strategy defined in `vault/business-context/core-strategy.md`.

### Core Principles:
- **Professional & Result-Oriented:** Focus on the outcome (revenue recovery) rather than the process.
- **Low-Pressure:** Avoid "hard sell" tactics. Position as a partner helping them reclaim lost value.
- **High-Integrity:** Be transparent about the intent—reactivating old leads they've already paid for or acquired.

### Voice Guidelines:
- **Do:** Use phrases like "reclaiming lost revenue," "forgotten opportunities," and "no-risk partnership."
- **Don't:** Use desperation-driven language ("Last chance!"), overly aggressive sales jargon, or generic templates that feel robotic.

## ✍️ Formatting the Draft for Approval
Before any message is sent, it must be prepared for the `founder-approval-loop`. Use the following format to ensure the founder has full context:

**Format:**
`[Lead Name] | [Channel] | [Draft Content] | [Context/Reasoning]`

**Example:**
`John Doe | SMS | "Hi John, this is [Name] from SolarReclaim. We're helping [Installer Name] reconnect with a few homeowners who looked at solar last year. Still interested in lowering your bill?" | Re-engaging a lead from 6 months ago who never closed.`

## ⚙️ Protocol for Approval Stage
1. **Drafting:** The agent generates the message based on the cadence and brand voice.
2. **Staging:** The draft is formatted according to the "Formatting the Draft" section above.
3. **Submission:** The draft is moved to the `founder-approval-loop` (see `skills/founder-approval-loop.md`).
4. **Execution:** 
    - If **Approved**: Mark as "Sent" in `vault/memory/leads.md` and schedule the next touchpoint.
    - If **Edited**: Incorporate founder changes and re-submit or send if final.
    - If **Rejected**: Archive the lead in `vault/memory/leads.md` and cease outreach.
