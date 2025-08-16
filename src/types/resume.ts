export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: Array<{
    label: string;
    url: string;
  }>;
}

export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  bullets: Array<{
    text: string;
    metrics?: {
      impact: number;
    };
  }>;
}

export interface Project {
  name: string;
  link: string;
  stack: string[];
  bullets: string[];
  stackInput?: string; // Raw input for tech stack (allows comma typing)
}

export interface Education {
  school: string;
  degree: string;
  grad: string;
}

export interface ResumeData {
  profile: Profile;
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  awards: string[];
}

export interface ResumeVersion {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: Date;
  updatedAt: Date;
}

export interface SectionConfig {
  id: keyof ResumeData;
  label: string;
  enabled: boolean;
  order: number;
}

export type SectionId = keyof ResumeData;
