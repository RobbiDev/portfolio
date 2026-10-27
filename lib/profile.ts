/**
 * Everything the About panel and the resume "quick look" render.
 * Kept here rather than in markdown because it is structured data, not prose —
 * editing this file is the way to update the drive's evidence files.
 */

export interface TimelineEntry {
  period: string
  place: string
  role: string
  detail: string
}

export interface SkillGroup {
  name: string
  items: string[]
}

export const profile = {
  name: "Robert Johnson",
  nickname: "Robby",
  role: "Digital Systems Engineer",
  employer: "Imaflex USA",
  location: "Greensboro, North Carolina",
  email: "me@robbyj.dev",
  github: "https://github.com/RobbiDev",
  githubHandle: "RobbiDev",
  linkedin: "https://www.linkedin.com/in/robby-johnson/",
  linkedinHandle: "in/robby-johnson",
  /** Served from public/; replace that file to update the download. */
  resumeUrl: "/Robert-Johnson-Resume.pdf",
  availability: "Remote friendly · worldwide",
  status: "Open to projects & opportunities",
  /** Drop a portrait in public/ and point this at it to fill the ID badge. */
  photo: "",
  tagline: "Networks · Software · Systems",
  headline: { lead: "Networks, Software", tail: "& ", accent: "Systems" },
  summary:
    "Obsessed with how things work and how to make them work better. Network engineering, industrial control systems, and software, currently studying Computer Science at UNC Charlotte.",
  bio: [
    'Subject has always been obsessed with how things work and, more importantly, how to make them work even better. Specializes in <b>Network Engineering</b> with a focus on infrastructure and implementation, with deep experience designing and managing <b>Industrial Control Systems</b>.',
    'Currently the Digital Systems Engineer at <b>Imaflex USA</b>, building custom software for the plant floor and running its IT, network and industrial systems, while pursuing a Computer Science degree at <b>UNC Charlotte</b> (minor in Computer Engineering) and co-leading Microsoft Learn at UNCC.',
  ],

  experience: [
    {
      period: "Dec 2023 – Present",
      place: "Imaflex USA · Thomasville, NC",
      role: "Digital Systems Engineer",
      detail:
        "Builds end-to-end software that modernizes legacy manufacturing processes. Administers the IT ecosystem and Microsoft tenant, managing devices with Intune. Sole technical engineer for the facility's network, hardware, software and PLC interfaces, holding 99.8% system uptime.",
    },
    {
      period: "Jan 2026 – Present",
      place: "Microsoft Learn at UNCC · Charlotte, NC",
      role: "Co-President & Co-Founder",
      detail:
        "Grew the organization to 100+ active members with certification study tracks in Azure and Excel. Raised workshop attendance 45% through department outreach and guest speakers, and secured 10 donated enterprise workstations.",
    },
    {
      period: "Apr 2021 – Nov 2023",
      place: "Chick-fil-A · Jamestown, NC",
      role: "Kitchen Supervisor",
      detail:
        "Ran kitchen operations and food-safety compliance, earning two consecutive years of 100 health inspection scores. Pitched and built KitchenWatch with restaurant leadership, which went on to run in production.",
    },
  ] satisfies TimelineEntry[],

  education: [
    {
      period: "Jan 2026 – May 2028",
      place: "UNC Charlotte · Charlotte, NC",
      role: "B.S. Computer Science",
      detail: "Minor in Computer Engineering. Expected graduation May 2028.",
    },
    {
      period: "Aug 2024 – Dec 2025",
      place: "Guilford Technical CC · Jamestown, NC",
      role: "Associate in Science",
      detail: "Focus on Computer Science and Information Technology. Graduated with a 3.7 GPA.",
    },
  ] satisfies TimelineEntry[],

  skills: [
    {
      name: "Languages",
      items: ["Python", "C", "C++", "TypeScript", "JavaScript", "SQL"],
    },
    {
      name: "Systems & Administration",
      items: ["Microsoft Intune", "Microsoft 365 Tenant", "Windows Server", "Linux", "Docker"],
    },
    {
      name: "Networking & Hardware",
      items: ["Ubiquiti UniFi", "VLAN Routing", "Custom Firewalls", "PLC Interfaces", "Industrial Telemetry"],
    },
    {
      name: "Frameworks & Technologies",
      items: ["Next.js", "React.js", "Node.js", "REST APIs", "Microsoft Power Platform", "Git"],
    },
  ] satisfies SkillGroup[],
}

/**
 * Projects are grouped onto coloured "lines", the way a transit board groups
 * services. The first category a project declares picks its line.
 */
export interface Line {
  key: string
  dot: "rd" | "yl" | "gr" | "bl"
  initial: string
  label: string
}

const LINES: Line[] = [
  { key: "software", dot: "rd", initial: "S", label: "Red Line · Software" },
  { key: "network", dot: "yl", initial: "N", label: "Yellow Line · Network" },
  { key: "controls", dot: "gr", initial: "C", label: "Green Line · Controls" },
  { key: "it", dot: "bl", initial: "I", label: "Blue Line · Infrastructure" },
]

const LINE_KEYWORDS: Record<string, string[]> = {
  software: ["software", "web", "app", "saas", "full-stack", "development"],
  network: ["network", "networking", "wireless", "infrastructure"],
  controls: ["controls", "control", "automation", "plc", "industrial", "hardware"],
  it: ["it", "systems", "support", "cloud", "devops"],
}

export function lineFor(categories: string[]): Line {
  for (const category of categories) {
    const value = category.toLowerCase()
    for (const line of LINES) {
      if (LINE_KEYWORDS[line.key].some((keyword) => value.includes(keyword))) return line
    }
  }
  return LINES[0]
}
