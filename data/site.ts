export const site = {
  name: "Olatunji Peter",
  shortName: "Peter",
  handle: "devpeter",
  alternateNames: ["devpeter", "Peter Olatunji"],
  role: "Software Engineer",
  city: "Ogbomoso",
  location: "Ogbomoso, Nigeria",
  url: "https://devpeter.xyz/",
  email: "hello@devpeter.xyz",
  availableForWork: true,
  cvUrl: "/cv/Olatunji_Peter_Software_Engineer_CV.pdf",
  photo: "/images/peter.jpg", 

  experience: "4+ years",
  currentRole: {
    title: "Software Engineer & Educator",
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
    "Software engineering roles (remote, in Nigeria and across Africa) and freelance projects.",
} as const;

export const navItems = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Contact", id: "contact" },
] as const;