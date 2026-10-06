import React, { useState } from 'react';
import { useMembership } from '../context/MembershipContext';
import { getTemplateConfigById } from '../data/templatePacks';
import { TemplateEngine } from '../engine/TemplateEngine';
import type { ResumeData } from '../types/resume';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
}

const SAMPLE_PREVIEW_RESUME: ResumeData = {
  title: 'Sample Candidate Resume',
  templateId: 'modern-minimal',
  themeColor: 'gold',
  personalInfo: {
    fullName: 'Alex Vance',
    jobTitle: 'Senior Product & Engineering Lead',
    email: 'alex.vance.preview@sample.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    website: 'alexvance.sample',
    linkedin: 'linkedin.com/in/alex-sample',
    github: 'github.com/alex-sample',
    summary: 'Accomplished engineering leader with 8+ years of expertise architecting high-throughput distributed systems and leading multidisciplinary product teams. Proven success scaling user infrastructure to 10M+ MAU while maintaining 99.99% uptime and accelerating deployment velocity.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    showPhoto: true,
  },
  experiences: [
    {
      id: 'prev-exp-1',
      company: 'Apex Cloud Innovations',
      role: 'Head of Engineering & Architecture',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      description: 'Directing technical strategy, cloud infrastructure modernization, and high-velocity product delivery across 4 agile engineering teams.',
      bulletPoints: [
        'Spearheaded enterprise microservices migration decreasing AWS infrastructure overhead by $140K/yr.',
        'Engineered real-time analytics pipeline processing 50M+ daily events with sub-50ms latency.',
        'Mentored 18 senior engineers, establishing automated CI/CD and zero-trust security compliance.'
      ]
    },
    {
      id: 'prev-exp-2',
      company: 'Vertex Digital Solutions',
      role: 'Senior Full Stack Software Architect',
      location: 'Austin, TX',
      startDate: '2019',
      endDate: '2022',
      isCurrent: false,
      description: 'Engineered mission-critical customer portal applications and scalable backend APIs serving 350K+ enterprise accounts.',
      bulletPoints: [
        'Architected GraphQL API gateway, reducing client-side network roundtrips by 45%.',
        'Implemented distributed Redis caching layer resulting in a 3x boost to dashboard query speeds.'
      ]
    }
  ],
  education: [
    {
      id: 'prev-edu-1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science & Software Systems',
      startDate: '2017',
      endDate: '2019',
      location: 'Stanford, CA',
      gpa: '3.9 / 4.0'
    },
    {
      id: 'prev-edu-2',
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
      id: 'prev-skills-1',
      categoryName: 'Technical & Architecture',
      skills: ['Distributed Systems', 'TypeScript', 'React', 'Node.js', 'Go', 'AWS & Cloud Infrastructure', 'PostgreSQL', 'Docker/K8s']
    },
    {
      id: 'prev-skills-2',
      categoryName: 'Leadership & Methodologies',
      skills: ['Technical Roadmap', 'Agile/Scrum Leadership', 'Hiring & Mentorship', 'System Reliability (SRE)', 'System Design']
    }
  ],
  projects: [
    {
      id: 'prev-proj-1',
      title: 'Global Event Streaming Broker',
      role: 'Lead Architect',
      link: 'github.com/sample/event-stream',
      description: 'Distributed fault-tolerant messaging system built with Go and Kafka handling multi-region failover.',
      technologies: 'Go, Kafka, Docker, Kubernetes, AWS'
    }
  ],
  certifications: [
    {
      id: 'prev-cert-1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2023'
    }
  ]
};

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  templateId
}) => {
  const { openUpgradeModal } = useMembership();
  const [zoomScale, setZoomScale] = useState<number>(0.9);

  if (!isOpen) return null;

  const config = getTemplateConfigById(templateId);
  const sampleData: ResumeData = {
    ...SAMPLE_PREVIEW_RESUME,
    templateId: config.id
  };

  const handleUpgradeClick = () => {
    openUpgradeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-navy/85 dark:bg-black/90 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full h-[94vh] flex flex-col border border-outline-variant dark:border-slate-800 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-navy dark:bg-slate-950 text-white px-5 py-4 border-b border-gold/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-lg">lock</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                {config.name}
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
                {config.category} • {config.layout.type.replace(/-/g, ' ')} • Standard Blueprint
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-1 text-xs border border-white/10">
              <button 
                onClick={() => setZoomScale(prev => Math.max(0.6, prev - 0.1))}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <span className="px-2 font-mono text-[11px] text-gray-200">
                {Math.round(zoomScale * 100)}%
              </span>
              <button 
                onClick={() => setZoomScale(prev => Math.min(1.2, prev + 0.1))}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded font-bold"
                title="Zoom In"
              >
                +
              </button>
            </div>

            <button
              onClick={handleUpgradeClick}
              className="bg-gold hover:bg-[#8e6f3d] text-navy font-black text-xs px-3.5 py-2 rounded-xl uppercase flex items-center gap-1.5 shadow-md transition-all border border-gold"
            >
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Upgrade to Pro
            </button>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Locked Notice Alert Banner */}
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/30 px-5 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-800 dark:text-amber-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-base shrink-0">info</span>
            <span>
              <strong>Free Plan limit reached (1 CV):</strong> You cannot create a resume with your details using this template. Showing read-only sample preview.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 underline cursor-pointer hover:text-amber-900" onClick={handleUpgradeClick}>
            Unlock with Pro (LKR 2,000/mo) &rarr;
          </span>
        </div>

        {/* Template Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 flex justify-center items-start relative select-none">
          {/* Subtle Watermark Overlay */}
          <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] z-10">
            <span className="text-8xl md:text-9xl font-black uppercase rotate-[-25deg] tracking-widest text-navy dark:text-white">
              PREVIEW ONLY
            </span>
          </div>

          <div 
            className="bg-white text-navy shadow-2xl rounded-lg overflow-hidden border border-slate-300 dark:border-slate-800 max-w-3xl w-full min-h-[750px] relative transition-transform origin-top"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {/* Top locked strip inside the document */}
            <div className="bg-slate-900 text-amber-300 text-[10px] font-bold px-3 py-1 flex items-center justify-between border-b border-amber-500/30">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">lock</span>
                LOCKED TEMPLATE PREVIEW — SAMPLE DETAILS ONLY
              </span>
              <span className="text-slate-400 font-mono text-[9px]">CV PILOT PREVIEW</span>
            </div>

            {/* Template Engine Render */}
            <TemplateEngine 
              data={sampleData} 
              config={config} 
              zoomScale={1.0} 
            />
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="bg-white dark:bg-slate-900 border-t border-outline-variant dark:border-slate-800 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-navy dark:text-slate-300">
            <span className="material-symbols-outlined text-amber-500 text-lg">lock</span>
            <div>
              <p className="font-bold text-navy dark:text-white">
                Want to build your resume with your details using {config.name}?
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Pro members get unlimited resumes, 100+ premium templates, AI tailoring, and watermark-free PDF exports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              Close Preview
            </button>
            <button
              onClick={handleUpgradeClick}
              className="bg-gold hover:bg-[#8e6f3d] text-navy font-black text-xs px-5 py-2 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all border border-gold"
            >
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Upgrade to Pro (LKR 2,000/mo)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
