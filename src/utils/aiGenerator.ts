import type { ResumeData, SkillCategory } from '../types/resume';

/**
 * AI Service for CV PILOT
 * Generates tailored executive summaries, enhances experience bullet points,
 * suggests key skills, and auto-populates rich resume samples.
 */

export const generateAISummary = (jobTitle: string, userSummary?: string, _tone: 'professional' | 'executive' | 'creative' = 'professional'): string => {
  const role = (jobTitle || '').trim();
  const roleLower = role.toLowerCase();

  // If user already has an existing summary to enhance
  if (userSummary && userSummary.length > 20) {
    return `Dedicated ${role} with proven experience in ${userSummary.toLowerCase().replace(/^(results-driven|experienced|accomplished|dedicated)\s*/i, '')}. Demonstrated track record of reliability, quality output, and operational excellence.`;
  }

  // Cleaning / Facilities / Maintenance / Housekeeping
  if (roleLower.includes('clean') || roleLower.includes('housekeep') || roleLower.includes('janitor') || roleLower.includes('custodian') || roleLower.includes('maid') || roleLower.includes('sanitat')) {
    const cleaningSummaries = [
      `Dedicated and detail-oriented ${role} with proven experience in maintaining high standards of cleanliness, hygiene, and facility safety. Skilled in operating cleaning equipment, handling sanitization protocols, and executing daily maintenance schedules with exceptional reliability.`,
      `Reliable and hardworking ${role} with strong expertise in deep cleaning, waste management, and surface sanitization for commercial and residential premises. Known for punctuality, attention to detail, and adherence to safety guidelines.`,
      `Thorough and energetic ${role} committed to creating spotless, hygienic, and welcoming environments. Adept at room turnover, inventory restocking, and working efficiently with minimal supervision.`
    ];
    return cleaningSummaries[Math.floor(Math.random() * cleaningSummaries.length)];
  }

  // Hospitality / Food & Beverage / Retail (waiter, chef, barista, cashier, sales)
  if (roleLower.includes('waiter') || roleLower.includes('waitress') || roleLower.includes('chef') || roleLower.includes('cook') || roleLower.includes('barista') || roleLower.includes('cashier') || roleLower.includes('retail') || roleLower.includes('server')) {
    const hospitalitySummaries = [
      `Customer-focused and energetic ${role} with proven experience delivering prompt, friendly service in fast-paced environments. Adept at customer relations, order accuracy, and maintaining spotless workstations.`,
      `Detail-oriented ${role} known for strong interpersonal skills, high punctuality, and efficient multitasking under pressure. Committed to providing exceptional guest experiences and building repeat business.`
    ];
    return hospitalitySummaries[Math.floor(Math.random() * hospitalitySummaries.length)];
  }

  // Drivers / Logistics / Security / Trades
  if (roleLower.includes('driver') || roleLower.includes('security') || roleLower.includes('guard') || roleLower.includes('warehouse') || roleLower.includes('electric') || roleLower.includes('mechanic') || roleLower.includes('plumb')) {
    const tradeSummaries = [
      `Reliable and safety-conscious ${role} with a strong track record of punctuality, equipment maintenance, and adherence to safety regulations. Known for dependability, physical stamina, and professional work ethic.`,
      `Skilled and dependable ${role} experienced in fast-paced operational workflows, routine inspections, and technical troubleshooting. Committed to error-free task completion and strict timeline compliance.`
    ];
    return tradeSummaries[Math.floor(Math.random() * tradeSummaries.length)];
  }

  // Healthcare / Nursing / Caregiving
  if (roleLower.includes('nurse') || roleLower.includes('care') || roleLower.includes('medic') || roleLower.includes('doctor') || roleLower.includes('dental') || roleLower.includes('health')) {
    const healthSummaries = [
      `Compassionate and patient-centered ${role} committed to delivering high-quality healthcare assistance and maintaining rigorous clinical hygiene standards. Known for empathetic communication and reliable care delivery.`,
      `Dedicated ${role} with strong background in patient monitoring, compassionate care support, and collaborative team communication in demanding healthcare settings.`
    ];
    return healthSummaries[Math.floor(Math.random() * healthSummaries.length)];
  }

  // Tech / Software / IT
  if (roleLower.includes('engineer') || roleLower.includes('developer') || roleLower.includes('software') || roleLower.includes('tech') || roleLower.includes('data') || roleLower.includes('devops')) {
    const techSummaries = [
      `Results-driven ${role} with expertise in building scalable, robust software solutions and optimizing development workflows. Proven ability to translate complex technical requirements into high-performance deliverables.`,
      `Passionate ${role} experienced in modern frameworks, system design, and collaborative development. Committed to delivering clean, maintainable code that drives operational efficiency.`
    ];
    return techSummaries[Math.floor(Math.random() * techSummaries.length)];
  }

  // Design / Creative
  if (roleLower.includes('design') || roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('creative') || roleLower.includes('art')) {
    const designSummaries = [
      `Creative and user-focused ${role} with a proven record of crafting engaging visual assets and intuitive digital experiences. Skilled in turning abstract concepts into high-impact designs.`,
      `Innovative ${role} passionate about elevating brand narratives, user empathy, and delivering clean, memorable aesthetics across touchpoints.`
    ];
    return designSummaries[Math.floor(Math.random() * designSummaries.length)];
  }

  // Admin / Support / Office
  if (roleLower.includes('admin') || roleLower.includes('assistant') || roleLower.includes('reception') || roleLower.includes('support') || roleLower.includes('clerk')) {
    const adminSummaries = [
      `Organized and proactive ${role} experienced in calendar management, correspondence, record maintenance, and providing stellar day-to-day administrative support.`,
      `Detail-oriented ${role} with proven ability to optimize office operations, facilitate smooth communications, and maintain organized documentation under tight deadlines.`
    ];
    return adminSummaries[Math.floor(Math.random() * adminSummaries.length)];
  }

  // Default / General
  const generalSummaries = [
    `Dedicated and results-oriented ${role} with proven expertise in driving operational excellence, high-quality deliverables, and team success. Recognized for strong work ethic, adaptability, and consistent performance.`,
    `Accomplished ${role} with a proven track record of dependability, attention to detail, and collaborative problem-solving. Committed to achieving organizational goals and maintaining superior service standards.`
  ];
  return generalSummaries[Math.floor(Math.random() * generalSummaries.length)];
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

  if (titleLower.includes('clean') || titleLower.includes('housekeep') || titleLower.includes('janitor') || titleLower.includes('custodian')) {
    return [
      { id: '1', categoryName: 'Sanitization & Cleaning', skills: ['Deep Cleaning', 'Chemical Safety & Handling', 'Surface Disinfection', 'Waste Disposal', 'Floor Care & Buffing'] },
      { id: '2', categoryName: 'Equipment & Maintenance', skills: ['Industrial Vacuuming', 'Pressure Washing', 'Facility Inspection', 'Inventory Restocking'] },
      { id: '3', categoryName: 'Work Standards', skills: ['Health & Safety Compliance', 'Time Management', 'Attention to Detail', 'Reliability'] }
    ];
  }

  if (titleLower.includes('waiter') || titleLower.includes('waitress') || titleLower.includes('server') || titleLower.includes('barista') || titleLower.includes('cashier')) {
    return [
      { id: '1', categoryName: 'Customer Service', skills: ['Order Taking', 'POS Systems', 'Menu Knowledge', 'Customer Relations', 'Cash Handling'] },
      { id: '2', categoryName: 'Operations', skills: ['Table Turnover', 'Food Hygiene & Safety', 'Beverage Preparation', 'Inventory Check'] },
      { id: '3', categoryName: 'Interpersonal', skills: ['Active Listening', 'Multitasking', 'Patience', 'Team Collaboration'] }
    ];
  }

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

  // Default general business/trades
  return [
    { id: '1', categoryName: 'Core Competencies', skills: ['Task Execution', 'Quality Assurance', 'Process Optimization', 'Safety Compliance', 'Problem Solving'] },
    { id: '2', categoryName: 'Communication & Teamwork', skills: ['Team Collaboration', 'Reporting', 'Customer Service', 'Conflict Resolution'] },
    { id: '3', categoryName: 'Personal Attributes', skills: ['Punctuality', 'Attention to Detail', 'Adaptability', 'Time Management'] }
  ];
};

export const getEmptyResumeData = (userDisplayName?: string, userEmail?: string): ResumeData => {
  return {
    title: 'New Resume',
    templateId: 'modern-minimal',
    themeColor: 'gold',
    personalInfo: {
      fullName: userDisplayName || '',
      jobTitle: '',
      email: userEmail || '',
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
