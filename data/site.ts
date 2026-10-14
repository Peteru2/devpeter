export const site = {
  name: "Olatunji Peter",
  shortName: "Peter",
  handle: "devpeter",
  alternateNames: ["devpeter", "Peter Olatunji"],
  role: "Full-Stack & Frontend Engineer",
  city: "Ogbomoso",
  location: "Ogbomoso, Nigeria",
  url: "", // your domain once you have one
  email: "polalekan526@gmail.com",
  availableForWork: true,
  cvUrl: "/cv/olatunji-peter-cv.pdf",
  photo: "/images/peter.jpg", // e.g. "/images/peter.jpg"
  socials: {
    github: "https://github.com/Peteru2",
    linkedin: "https://www.linkedin.com/in/TODO",
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
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;