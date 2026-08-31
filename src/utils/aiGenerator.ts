import type { ResumeData, SkillCategory } from '../types/resume';

/**
 * AI Service for CV PILOT
 * Generates tailored executive summaries, enhances experience bullet points,
 * suggests key skills, and auto-populates rich resume samples.
 */

export const generateAISummary = (jobTitle: string, userSummary?: string, tone: 'professional' | 'executive' | 'creative' = 'executive'): string => {
  const role = jobTitle.trim() || 'Software Professional';
  
  if (userSummary && userSummary.length > 20) {
    // Enhance existing summary
    return `Results-driven ${role} with proven experience in ${userSummary.toLowerCase().replace(/^(results-driven|experienced|accomplished)\s*/i, '')}. Demonstrated track record of driving cross-functional alignment, optimizing system performance, and delivering high-ROI initiatives under tight deadlines.`;
  }

  const summariesByTone: Record<string, string[]> = {
    executive: [
      `Strategic and results-driven ${role} with 7+ years of experience leading high-impact initiatives, driving operational efficiency, and scaling cross-functional operations. Recognized for bridging strategic vision with tactical execution to achieve measurable business growth.`,
      `Accomplished ${role} adept at steering multi-faceted projects from concept to execution. Expert in stakeholder management, architecture performance, and building resilient scalable solutions that drive organizational success.`
    ],
    professional: [
      `Detail-oriented ${role} with comprehensive experience executing complex projects and delivering top-tier solutions. Proven capability in optimizing workflows, mentoring team members, and maintaining stringent quality standards.`,
      `Passionate ${role} specialized in problem-solving, modern best practices, and collaborative delivery. Consistently delivers reliable high-quality outputs while driving continuous process improvement.`
    ],
    creative: [
      `Forward-thinking ${role} crafting innovative digital solutions at the intersection of design, technology, and user strategy. Passionate about elevating brand narratives and delivering memorable user experiences.`,
      `Dynamic ${role} known for blending creative problem-solving with rigorous execution to solve complex user and technical challenges.`
    ]
  };

  const options = summariesByTone[tone] || summariesByTone.executive;
  return options[Math.floor(Math.random() * options.length)];
};

export const enhanceBulletPoint = (rawText: string, _jobTitle?: string): string => {
  if (!rawText.trim()) {
    return 'Spearheaded end-to-end development of key deliverables, boosting operational efficiency by 35%.';
  }

  const trimmed = rawText.trim();

  // If already starts with action verb and has details, refine with metric impact
  const actionVerbs = ['Led', 'Spearheaded', 'Engineered', 'Orchestrated', 'Designed', 'Architected', 'Pioneered', 'Optimized', 'Accelerated', 'Managed', 'Developed', 'Executed'];
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

  if (!actionVerbs.some(verb => trimmed.startsWith(verb))) {
    // Capitalize first letter and prepend action verb
    const normalized = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
    return `${randomVerb} ${normalized}, resulting in a 25% increase in throughput and improved quality standards.`;
  }

  return `${trimmed} — achieving 99.9% uptime and reducing cycle times across team workflows.`;
};

export const suggestSkillsForRole = (jobTitle: string): SkillCategory[] => {
  const titleLower = jobTitle.toLowerCase();

  if (titleLower.includes('designer') || titleLower.includes('ux') || titleLower.includes('ui') || titleLower.includes('product designer')) {
    return [
      { id: '1', categoryName: 'Design & Prototyping', skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'User Research', 'Prototyping'] },
      { id: '2', categoryName: 'Methods & Testing', skills: ['Usability Testing', 'Information Architecture', 'Interaction Design', 'Agile/Scrum', 'A/B Testing'] },
      { id: '3', categoryName: 'Tools', skills: ['Adobe CC', 'Principle', 'Framer', 'Storybook', 'Miro', 'Zeplin'] }
    ];
  }

  if (titleLower.includes('engineer') || titleLower.includes('developer') || titleLower.includes('software') || titleLower.includes('frontend') || titleLower.includes('backend') || titleLower.includes('tech')) {
    return [
      { id: '1', categoryName: 'Core Technologies', skills: ['TypeScript', 'React.js', 'Node.js', 'Python', 'Next.js', 'PostgreSQL', 'REST & GraphQL APIs'] },
      { id: '2', categoryName: 'DevOps & Architecture', skills: ['AWS', 'Docker', 'CI/CD Pipelines', 'System Design', 'Git / GitHub', 'Firebase', 'Microservices'] },
      { id: '3', categoryName: 'Practices', skills: ['Agile Execution', 'TDD / Automated Testing', 'Performance Optimization', 'Code Review', 'Security Best Practices'] }
    ];
  }

  if (titleLower.includes('manager') || titleLower.includes('product') || titleLower.includes('lead')) {
    return [
      { id: '1', categoryName: 'Product Strategy', skills: ['Product Roadmap', 'Market Analysis', 'Feature Prioritization', 'OKRs & KPIs', 'User Centric Strategy'] },
      { id: '2', categoryName: 'Leadership & Process', skills: ['Agile / Scrum Master', 'Cross-Functional Leadership', 'Stakeholder Management', 'Sprint Planning'] },
      { id: '3', categoryName: 'Analytics & Tools', skills: ['Jira / Confluence', 'Mixpanel', 'Google Analytics', 'SQL Data Analysis', 'Figma'] }
    ];
  }

  // Default general business/tech
  return [
    { id: '1', categoryName: 'Core Competencies', skills: ['Project Management', 'Strategic Planning', 'Process Optimization', 'Data Analysis', 'Problem Solving'] },
    { id: '2', categoryName: 'Technical Proficiency', skills: ['Microsoft Office 365', 'Google Workspace', 'CRM Tools', 'SQL Basics', 'Workflow Automation'] },
    { id: '3', categoryName: 'Soft Skills', skills: ['Cross-Team Communication', 'Leadership', 'Critical Thinking', 'Client Relations', 'Adaptability'] }
  ];
};

export const getEmptyResumeData = (): ResumeData => {
  return {
    title: 'New Resume',
    templateId: 'modern-minimal',
    themeColor: 'gold',
    personalInfo: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
      photoUrl: '',
      showPhoto: false,
    },
    experiences: [],
    education: [],
    skillCategories: [],
    projects: [],
    certifications: []
  };
};

export const getInitialResumeData = (userDisplayName?: string, userEmail?: string): ResumeData => {
  return {
    title: 'Professional CV',
    templateId: 'modern',
    themeColor: 'gold',
    personalInfo: {
      fullName: userDisplayName || 'Alex Mercer',
      jobTitle: 'Senior Software Architect',
      email: userEmail || 'alex.mercer@cvpilot.dev',
      phone: '+1 (555) 389-2041',
      location: 'San Francisco, CA',
      website: 'alexmercer.dev',
      linkedin: 'linkedin.com/in/alexmercer',
      github: 'github.com/alexmercer',
      summary: 'Architecting high-performance scalable software systems and leading cross-functional engineering teams. Specialized in cloud infrastructure, distributed microservices, and modern web application development.',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      showPhoto: true,
    },
    experiences: [
      {
        id: '1',
        company: 'CloudScale Innovations',
        role: 'Lead Systems Architect',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        isCurrent: true,
        description: 'Spearheaded enterprise cloud transformation reducing overall infrastructure latency by 42% and monthly AWS operating costs by $120K.',
        bulletPoints: [
          'Architected real-time event processing pipeline using Kafka and AWS Lambda handling 10M+ daily events.',
          'Mentored and managed a team of 14 senior engineers across backend and DevOps disciplines.',
          'Established automated CI/CD security scanning, decreasing post-release vulnerabilities by 65%.'
        ]
      },
      {
        id: '2',
        company: 'Apex Data Systems',
        role: 'Senior Software Engineer',
        location: 'San Jose, CA',
        startDate: '2019',
        endDate: '2022',
        isCurrent: false,
        description: 'Designed and deployed high-throughput GraphQL APIs and customer dashboard interfaces used by over 200k daily active users.',
        bulletPoints: [
          'Engineered microservices caching layer with Redis, improving database query speed by 4x.',
          'Collaborated with Product and UX teams to overhaul customer onboarding workflow, boosting user conversion by 28%.'
        ]
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Stanford University',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science & Artificial Intelligence',
        startDate: '2017',
        endDate: '2019',
        location: 'Stanford, CA',
        gpa: '3.9 / 4.0'
      },
      {
        id: '2',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Electrical Engineering & Computer Sciences',
        startDate: '2013',
        endDate: '2017',
        location: 'Berkeley, CA'
      }
    ],
    skillCategories: [
      {
        id: '1',
        categoryName: 'Technical Core',
        skills: ['TypeScript', 'React.js', 'Node.js', 'Python', 'Go', 'GraphQL', 'PostgreSQL', 'Redis']
      },
      {
        id: '2',
        categoryName: 'Cloud & Infrastructure',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Kafka', 'System Design']
      }
    ],
    projects: [
      {
        id: '1',
        title: 'NeuralTrace AI',
        role: 'Creator & Maintainer',
        link: 'https://github.com/alexmercer/neuraltrace',
        description: 'Open-source distributed tracing library for LLM applications with over 2.4k GitHub stars.',
        technologies: 'Python, React, WebSockets, ClickHouse'
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect – Professional',
        issuer: 'Amazon Web Services',
        date: '2023'
      }
    ]
  };
};
