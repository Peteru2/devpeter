export const site = {
  name: "Olatunji Peter",
  shortName: "Peter",
  handle: "devpeter",
  alternateNames: ["devpeter", "Peter Olatunji"],
  role: "Full-Stack & Frontend Engineer",
  city: "Ogbomoso",
  location: "Ogbomoso, Nigeria",
  url: "https://mydevpeter.netlify.app/", // your live URL or domain
  email: "polalekan526@gmail.com",
  availableForWork: true,
  cvUrl: "/cv/olatunji-peter-cv.pdf",
  photo: "/images/peter.jpg", // e.g. "/images/peter.jpg"
  experience: "4+ years",
  currentRole: {
    title: "Full-Stack Engineer & Educator",
    org: "JAARC",
    location: "Ogbomoso",
  },
  teaching: {
    students: "10+",
    subjects: ["HTML, CSS & JavaScript", "React", "AI", "digital literacy"],
  },
  socials: {
    github: "https://github.com/Peteru2",
    linkedin: "https://www.linkedin.com/in/peter-olatunji-5ab9841bb/",
    x: "https://x.com/Devpeter5",
  },
  focusAreas: [
    "Fintech & payment systems",
    "EdTech & digital literacy",
    "Full-stack product engineering",
    "Admin dashboards & content platforms",
    "Software for real-world conditions",
  ],
  openTo:
    "Full-stack and frontend engineering roles (remote, in Nigeria and across Africa) and freelance projects.",
} as const;

export const navItems = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Contact", id: "contact" },
] as const;