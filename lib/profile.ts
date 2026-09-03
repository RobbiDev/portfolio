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
  role: "IT & Network/Controls Engineer",
  employer: "Imaflex USA",
  location: "Greensboro, North Carolina",
  email: "me@robbyj.dev",
  github: "https://github.com/RobbiDev",
  githubHandle: "RobbiDev",
  linkedin: "https://www.linkedin.com/in/robby-johnson/",
  linkedinHandle: "in/robby-johnson",
  resumeUrl: "https://www.robbyj.dev/@/Robert-Johnson-Resume.pdf",
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
    'Currently balances IT support, network engineering, and controls/automation engineering at <b>Imaflex USA</b> while pursuing a Computer Science degree at <b>UNC Charlotte</b> (Networks & Systems focus, ECE minor).',
  ],

  experience: [
    {
      period: "May 2025 → Present",
      place: "Imaflex USA · Thomasville, NC",
      role: "IT & Network/Controls Engineer",
      detail:
        "Manages IT infrastructure and network systems in a manufacturing environment. Supports PLC control systems, troubleshoots production tech issues, and leads integration of new control systems.",
    },
    {
      period: "Jun 2023 → Nov 2023",
      place: "Chick-fil-A · Grandover Village, NC",
      role: "Back of House Supervisor",
      detail:
        "Managed BOH operations and food prep logistics. Handled restaurant IT issues including POS and hardware. Built internal time-tracking tools for kitchen task compliance.",
    },
  ] satisfies TimelineEntry[],

  education: [
    {
      period: "Jan 2026 → Present",
      place: "UNC Charlotte",
      role: "B.S. Computer Science",
      detail:
        "Networks & Systems focus, minoring in Electrical & Computer Engineering. Expected graduation Jan 2028.",
    },
    {
      period: "Aug 2024 → Dec 2025",
      place: "Guilford Technical CC",
      role: "Associate in Science",
      detail: "Focus on Computer Science and Information Technology. Graduated with a 3.7 GPA.",
    },
  ] satisfies TimelineEntry[],

  skills: [
    {
      name: "Network Engineering",
      items: ["Cisco", "Ubiquiti", "Fortinet", "VLAN & MPLS", "Routing & Switching", "SD-WAN"],
    },
    {
      name: "Software Engineering",
      items: ["Python", "JavaScript", "Java", "RESTful APIs", "Databases", "Git & CI/CD"],
    },
    {
      name: "Control Systems",
      items: ["PLC Programming", "Industrial Wiring", "System Integration", "Automation", "Low Voltage"],
    },
    {
      name: "Information Technology",
      items: ["Tier 2/3 Support", "Windows Server", "Linux", "Active Directory", "Provisioning"],
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
