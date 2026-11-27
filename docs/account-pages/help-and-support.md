# Help and support (`/settings/help`)

Figma: "7 · Help and support" (phone home, phone report form, desktop, and the
"Report sent" state).
Code: `src/components/settings/account/HelpPage.jsx`,
`src/components/settings/account/help/ReportForm.jsx`, `src/lib/support.js`.

## What it does

| Part | Behaviour |
| --- | --- |
| Chat on WhatsApp | Green card, "Fastest way to reach us · 09:00–21:00". **Start a chat →** opens `wa.me/<WHATSAPP_NUMBER>` (number from `src/lib/contact.js`) in a new tab with a short greeting. Hidden if no number is configured. |
| FAQ | Row expands in place and lists the questions from `src/data/faq.json` (the same data as the landing page). Each answer opens with a native `<details>`. |
| Report an issue | **Desktop**: the form is a card on the page; the row scrolls to it and focuses the text box. **Phone**: the row opens a full-screen "Report an issue" page. |
| Email us instead | `mailto:support@esweet.ng`. |
| Legal (phone) | Terms of service and Privacy policy are shown as plain rows marked "Coming soon", because those pages do not exist yet. Make them links when they do. |
| Footer (phone) | "e'sweet · version 1.0.0 · 20A Idiroko Road, Sango Otta". |

### The report form

- Topic pills: App problem (default), Payment, My account, Something else.
- Description: at least 10 and at most 1000 characters. Too short shows
  "Tell us a little more about the problem."
- Phone only: optional screenshot, and a read-only "Reply to" with the
  person's number and a link to Profile (matches Figma).
- **Send report** validates, then calls `sendReport` (`src/lib/support.js`).
  On success the form clears, the phone page closes, and the toast reads
  "Report sent · we'll reply on WhatsApp". If WhatsApp cannot be opened
  (for example a blocked pop-up) an error toast points to the email address.

### Prototype limits (read before demoing)

- **There is no support API.** `sendReport` opens WhatsApp with the report
  typed out (topic, name, email, description) and the person presses send
  there. So the toast text from Figma is slightly ahead of reality until a
  real endpoint exists. When one does, replace the body of `sendReport` (same
  signature) and nothing else changes. The copy is the constant
  `REPORT_SENT_MESSAGE` if the team wants it softened meanwhile.
- A screenshot cannot travel inside a link. Its file name is added to the
  message and the person attaches the file in the chat (the form says so).
- Contact details (`SUPPORT_EMAIL`, `SUPPORT_HOURS`, `SHOP_ADDRESS`) are
  constants at the top of `src/lib/support.js`.

## Design decisions to confirm

- Legal rows are not links yet (see above).
- The FAQ expands in place instead of opening a separate screen, because no
  FAQ screen is designed.

## Manual test script

1. Open the page signed in on a phone width: WhatsApp card, three rows, legal
   rows, footer.
2. Tap **Start a chat**: WhatsApp opens in a new tab.
3. Tap **FAQ**: questions list; open one; tap FAQ again to close.
4. Tap **Report an issue**: full-screen form. Send with an empty description
   (error), then a real one: WhatsApp opens, page closes, toast shows.
5. Attach a screenshot: its name shows, with the note about attaching it.
6. Desktop width: the form is on the page; the row scrolls to it; no screenshot
   or "Reply to" fields (as designed).
7. Tab through everything; Escape closes the phone form.
