export interface Decision {
  title: string;
  risk: string;
  solution: string[];
  code?: string;
}

export interface CaseStudy {
  intro: string;
  problem: string[];
  decisions: Decision[];
  extras?: { title: string; items: string[] };
  outcome: string[];
  next?: string[];
}

export const caseStudies: Record<string, CaseStudy> = {
  buydair: {
    intro:
      "Buydair lets people top up a prepaid wallet through Paystack, by card, bank transfer or USSD, and buy airtime, data, electricity tokens and TV subscriptions for themselves or family in seconds. Alongside payments, free short courses teach digital literacy and how to recognise fake alerts, phishing and SIM-swap scams.",
    problem: [
      "Buying airtime or paying a bill should take seconds. The hard part isn’t the happy path; it’s what happens when the network drops mid-payment, the user taps Pay twice, or a provider takes too long to answer. Each of those moments can turn into a double charge or money that seems to disappear.",
      "The goal was a wallet where money is never charged twice, never lost halfway and never guessed at, plus a learning side that helps people avoid the scams that target anyone paying online.",
    ],
    decisions: [
      {
        title: "A payment never happens twice",
        risk: "Networks drop, users double-tap and apps retry. Every repeated request could charge the user again.",
        solution: [
          "Every payment carries a unique idempotency key, created when the user taps Pay and sent with the request.",
          "The server stores each key with a unique index per user. A repeat of a finished request gets the saved reply back instead of a second charge; a repeat of one still in progress is refused.",
          "If a payment fails on a wrong PIN, its key is released so the user can try again properly.",
          "A retry test proves it: send the same payment again and the charge count stays at one.",
        ],
      },
      {
        title: "Top-ups are credited exactly once",
        risk: "Paystack confirms a payment through a webhook, and the app can also ask whether it went through. Both can arrive at the same moment.",
        solution: [
          "Both paths run the same settle step, which credits with a conditional update that only succeeds while the top-up is still uncredited.",
          "One path wins; the other finds nothing left to update and stops.",
        ],
        code: `Funding.findOneAndUpdate(
  { _id, credited: false },
  { $set: { credited: true } }
)`,
      },
      {
        title: "Money can’t vanish halfway",
        risk: "If the server fails between debiting one wallet and crediting another, money could leave without arriving. Two payments at once could both spend the same balance.",
        solution: [
          "The debit, the credit and the record run inside one database transaction: all of it happens, or none of it does.",
          "The balance check is part of the debit itself, so two simultaneous payments can’t both spend the same ₦1,000.",
        ],
        code: `Wallet.findOneAndUpdate(
  { user, balance: { $gte: amount } },
  { $inc: { balance: -amount } }
)`,
      },
      {
        title: "Never guess the outcome",
        risk: "A bill provider that times out hasn’t necessarily failed. Calling it failed invites a second payment; calling it successful can lose money.",
        solution: [
          "Every purchase ends in one of three clear states: successful, failed and refunded, or pending.",
          "Money is taken first and recorded as pending. A clear failure is refunded automatically; an unclear answer stays pending and is never guessed.",
          "A background job re-checks pending purchases every few minutes using each purchase’s own request ID. It settles them, refunds ones the provider never received after ten minutes, and hands anything older than two days to a human.",
          "Unpaid top-ups are marked abandoned after 30 minutes but still re-checked, so a late bank transfer is still credited.",
          "If the phone loses connection mid-payment, the app shows a “we’re confirming this” screen instead of “failed”, so nobody is tempted to pay again.",
        ],
      },
      {
        title: "Trust nothing from the outside",
        risk: "Anyone can try to send a fake “payment successful” message, or edit a request to pay less.",
        solution: [
          "Every Paystack webhook is verified with an HMAC-SHA512 signature, and the amount and currency must match what was expected before anything is credited.",
          "Prices are calculated on the server, never taken from the app.",
          "Purchases are refused early if the bill-payment float can’t cover them.",
          "The main balance is deliberately capped at ₦2,000, a risk limit while the product is young.",
          "Practice money can’t buy anything; it only works for demo transfers between users.",
        ],
      },
      {
        title: "Accounts and admin built for real money",
        risk: "A wallet is only as safe as its accounts, and the people who manage it.",
        solution: [
          "Passwords are hashed with bcrypt, login errors never reveal whether an email exists, every request is validated with Zod, and sensitive routes are rate-limited.",
          "Access tokens are short-lived; refresh tokens live in an http-only cookie and only their hash is stored.",
          "A hashed transaction PIN guards every payment, locks after repeated wrong attempts, and weak PINs like 1234 are refused.",
          "Admin rights are checked against the database on every request. Refunds and suspensions need the admin’s PIN and a written reason, and every admin action is recorded in an audit log.",
          "Balances are never edited by hand: money only moves through the same settle and refund steps the app itself uses.",
        ],
      },
    ],
    extras: {
      title: "Beyond payments",
      items: [
        "Three courses with scam drills, read-aloud and adjustable text size",
        "Certificates anyone can verify",
        "Practice money for safe demo transfers",
        "Buying for saved family contacts, with birthday reminders",
        "Live balance updates over Socket.IO",
        "Admin dashboard: user search, stuck-transaction recovery and growth metrics",
        "Landing page with an interactive purchase demo, branded emails and an installable mobile web app",
      ],
    },
    outcome: [
      "Built and in pre-launch: transactions have already been processed through it, and public launch is waiting on Paystack’s business verification.",
      "Retries, double taps and dropped connections are safe by design: a payment is charged once, credited once, and every purchase ends in a clear, recoverable state.",
      "Built solo, covering product, design and engineering.",
    ],
    next: [
      "Launch the “Grown-ups & elders” learning track, already marked as coming soon in the app.",
      "Raise the balance cap gradually as monitoring and fraud checks mature.",
    ],
  },

  "offline-cbt": {
        intro:
      "A computer-based testing system built for JAARC in Ogbomoso, running entirely over a local network. One machine acts as the exam server, students sit at terminals connected by LAN, and no internet connection is needed at any point. More than 1,000 students have sat exams and tests on it, and they can access their report sheets afterwards.",
    problem: [
      "Exams can’t depend on an internet connection that might drop halfway through a paper. And every student has to be graded fairly, even when a whole room starts and submits at the same moment.",
      "Terminals also lose power. A student whose machine goes off shouldn’t lose their answers or their time.",
    ],
    decisions: [
      {
        title: "Answers are saved where the student is",
        risk: "Sending every click to the server would make a busy room compete for the same machine.",
        solution: [
          "Answering and moving between questions happen entirely in the browser. Each click is written to that terminal’s own storage, so nothing collides and the interface stays instant.",
        ],
      },
      {
        title: "Every student gets their own exam",
        risk: "Starting an exam is the one moment the whole room hits the server together.",
        solution: [
          "Start Exam creates a separate session for each student, with their own shuffled question order. The only shared data is the read-only question bank.",
          "Early on, some students saw “cannot load exam” when everyone started at once. Reworking the start step around a confirmed start time fixed it.",
        ],
      },
      {
        title: "A timer that survives a reboot",
        risk: "A countdown that lives only in the browser resets if the machine restarts.",
        solution: [
          "The timer is calculated from the session’s real start time instead of a ticking counter.",
          "If a terminal loses power, the student logs back in with their PIN on the same machine: same question order, answers restored from local storage, and a clock that shows the true time remaining.",
        ],
      },
      {
        title: "Fair grading when everyone submits at once",
        risk: "A room of simultaneous submissions can overwhelm a server or mix up results.",
        solution: [
          "Each submission runs in its own database transaction on a pooled connection; under heavy load, requests queue instead of crashing.",
          "Grading happens on the server, so students can’t influence their own score or anyone else’s.",
          "Per-question analytics use an atomic increment, so simultaneous submissions are all counted correctly.",
        ],
      },
    ],
    outcome: [
      "Used by more than 1,000 students for exams and tests.",
      "Exams run with no internet at all, and students can access their report sheets afterwards.",
      "A power cut on a terminal costs the student neither their answers nor their time.",
    ],
    next: [
      "Moving to a backup terminal mid-exam: today, answers reach the server only at submit, so a student who switches machines keeps their question order and clock but not their answers.",
      "The fix: debounced autosave checkpoints to the server, with versioned, newest-wins writes so a late request never overwrites a fresher answer.",
      "Alongside it: one active terminal per session, invigilator approval to switch machines, and the option to add back lost minutes.",
    ],
  },

  "true-worshippers-church": {
    intro:
      "A website and admin platform for True Worshippers Church. Members find events, stream and download sermons, send prayer requests and join the community online, while the church’s own team manages everything from a dashboard, without needing a developer.",
    problem: [
      "The church needed one place for its life online: services and events, sermons with video, prayer requests, first-time visitors, member registrations, celebrations and a newsletter.",
      "It had to be run day to day by non-technical staff, and sermon videos are large files.",
    ],
    decisions: [
      {
        title: "Sermon videos go straight to Cloudinary",
        risk: "Routing large video files through the backend ties up server memory and bandwidth, and risks timeouts and upload size limits.",
        solution: [
          "Videos upload directly from the admin’s browser to Cloudinary. The backend only saves the resulting video URL, alongside the sermon’s title, speaker and date.",
          "Uploads are faster for the team, the server stays light, and Cloudinary handles streaming and delivery to members.",
        ],
      },
      {
        title: "A dashboard the team can run alone",
        risk: "Different people on the team need different levels of control, and nobody should be able to break the site by accident.",
        solution: [
          "Role-based access with admin and superadmin roles.",
          "JWT authentication with bcrypt-hashed passwords and http-only cookies.",
          "Full create, edit and delete for every content type, with validation and clear error handling at the API layer.",
        ],
      },
      {
        title: "Events that sort themselves",
        risk: "Manually moving events from “upcoming” to “past” is exactly the kind of job that gets forgotten.",
        solution: [
          "Each event’s status (upcoming, ongoing or past) is worked out from its dates, so the site is always correct without anyone touching it.",
        ],
      },
      {
        title: "Built to be found and used on phones",
        risk: "Most visitors arrive on mobile, many through search.",
        solution: [
          "A reusable SEO component gives every page proper titles and descriptions.",
          "Mobile-first layouts tested on phone, tablet and desktop, lazy-loaded pages, and a responsive admin sidebar.",
        ],
      },
    ],
    extras: {
      title: "What the team manages",
      items: [
        "Events and services",
        "Sermon library with video",
        "Prayer requests",
        "First-time visitors",
        "Member registrations",
        "Celebrations",
        "Community",
        "Newsletter subscribers",
      ],
    },
    outcome: [
      "Live at twcglobal.org and actively used by the church.",
      "Members stream and download sermons; the team publishes everything themselves.",
      "Built solo, from database design to deployment.",
    ],
    
  },
    bfe: {
    intro:
      "An ordering platform for Becca’s Food & Events. Customers browse the menu, order for delivery or pickup, pay with Paystack and follow their order live, while the owner and staff run the menu, orders and delivery from an admin panel.",
    problem: [
      "A catering business needs to take orders online, get paid reliably and keep customers informed, without anyone spending the day answering “where is my food?”.",
      "Several people work in the admin with different responsibilities, and past orders have to stay accurate even when the menu or prices change.",
    ],
    decisions: [
      {
        title: "Orders keep their own copy of the details",
        risk: "If an order simply pointed at the menu, editing a dish or a price would silently rewrite old orders and receipts.",
        solution: [
          "Each order stores its own copy of the item names, prices and delivery fee at the time of purchase.",
          "Later menu changes never alter past orders.",
        ],
      },
      {
        title: "Payment is confirmed two ways, through one function",
        risk: "A customer can close the tab right after paying, or a webhook can arrive late. Either way, an order could sit unpaid or be confirmed twice.",
        solution: [
          "Checkout creates the order and starts the Paystack payment. Payment is confirmed by both the verify page and the Paystack webhook.",
          "Both paths share one safe confirmation function, so an order is confirmed correctly whichever arrives first.",
        ],
      },
      {
        title: "Tracking without a login, and without guessable links",
        risk: "Forcing customers to sign up just to check on a meal adds friction, but easy-to-guess order URLs would expose other people’s orders.",
        solution: [
          "Each order gets a readable number (#10001 and up) for conversations, and a separate private random tracking link.",
          "The tracking page shows a live timeline and refreshes every 30 seconds. Signed-in customers also see their order history, matched by email.",
        ],
      },
      {
        title: "Admin access that changes instantly",
        risk: "A staff member who is demoted or removed shouldn’t keep access until their session happens to expire.",
        solution: [
          "Admin sessions are JWTs in an httpOnly cookie, checked against the database on every request, so deactivation, role changes and “log out everywhere” take effect immediately.",
          "Three roles (exactly one owner, plus managers and staff) are enforced on the server. Passwords are bcrypt-hashed, with a lockout after repeated failures.",
        ],
      },
      {
        title: "Passwordless sign-in for customers",
        risk: "Passwords add friction to a food order, and they’re one more thing to leak or forget.",
        solution: [
          "Signing in is optional: a 6-digit code is emailed through Resend, works once, expires after 10 minutes and is rate-limited.",
          "The session is a separate 30-day cookie, and guest checkout still works.",
        ],
      },
    ],
    extras: {
      title: "What the team manages",
      items: [
        "Menu and products",
        "Orders, from New to Delivered",
        "Delivery areas and fees",
        "Catering enquiries",
        "Admin accounts and roles",
        "New-order alerts every 15 seconds, with sound, a pop-up and a tab badge",
      ],
    },
       outcome: [
      "Deployed and working end to end: menu, Paystack checkout, live tracking and an admin panel. Payments run in Paystack’s test mode until the business is ready to go live.",
      "Orders move through New, Processing, Ready, Out for delivery and Delivered (pickup skips delivery), with every change recorded in a status history.",
      "Built solo, from database design to deployment.",
    ],
  },
};