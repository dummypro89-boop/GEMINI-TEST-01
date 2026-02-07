export type NavItem = {
  label: string;
  href: string;
};

export type ProgramStep = {
  title: string;
  description: string;
};

export type Instructor = {
  name: string;
  bio: string;
};

export type AcademyFeature = {
  title: string;
  description: string;
};

export type ContactInfo = {
  label: string;
  value: string;
};

export type SiteContent = {
  brand: string;
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  nav: NavItem[];
  about: {
    title: string;
    description: string;
    bullets: string[];
  };
  program: {
    title: string;
    steps: ProgramStep[];
  };
  teacher: {
    title: string;
    instructors: Instructor[];
  };
  academy: {
    title: string;
    features: AcademyFeature[];
  };
  schedule: {
    title: string;
    entries: Array<{
      day: string;
      sessions: string[];
    }>;
  };
  pricing: {
    title: string;
    plans: Array<{
      name: string;
      price: string;
      note: string;
    }>;
  };
  journal: {
    title: string;
    posts: Array<{
      title: string;
      summary: string;
      date: string;
    }>;
  };
  contact: {
    title: string;
    infos: ContactInfo[];
    ctaLabel: string;
    ctaHref: string;
  };
};
