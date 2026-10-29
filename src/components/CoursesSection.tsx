import React from 'react';
import { CourseItem } from '../types';
import { Sparkles, ArrowRight, BookOpen, Clock, Code, Terminal } from 'lucide-react';

interface CoursesSectionProps {
  courses: CourseItem[];
  onOpenJoin: () => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onOpenJoin }) => {
  // Neo-Brutalism color accents for category boxes
  const badgeColors = ['bg-[#FFE600]', 'bg-[#10B981]', 'bg-[#60A5FA]', 'bg-[#FF5A5F]', 'bg-[#A78BFA]', 'bg-[#F472B6]', 'bg-[#FBBF24]'];

  return (
    <section id="courses" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 neo-badge bg-[#FFE600] text-black text-xs font-black uppercase mb-3 hover:rotate-1 transition-transform">
          <Terminal className="w-3.5 h-3.5 text-black stroke-[3]" />
          <span>Industry Oriented Curriculum</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
          Our Courses &amp; Tech Tracks
        </h2>
        <div className="w-24 h-1.5 bg-black mx-auto mt-3"></div>
        <p className="text-slate-700 font-medium mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Specialized tech training tracks designed for CST students to bridge academic syllabus with real-world industry engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, idx) => {
          const accentBg = badgeColors[idx % badgeColors.length];
          return (
            <div
              key={course.id}
              className="neo-card bg-white p-6 rounded-xl flex flex-col justify-between group cursor-pointer relative"
            >
              {/* Tech corner accent markers */}
              <span className="absolute top-2 right-2 text-[10px] font-mono font-bold text-slate-400 group-hover:text-black transition-colors">
                TRK://0{idx + 1}
              </span>

              <div>
                {/* Icon box in neo-brutalist style with dynamic micro-tilt */}
                <div className={`w-14 h-14 ${accentBg} border-2 border-black rounded-xl flex items-center justify-center text-2xl mb-5 shadow-[3px_3px_0px_#000] text-black group-hover:-translate-y-1 group-hover:rotate-6 group-hover:shadow-[5px_5px_0px_#000] transition-all duration-200`}>
                  <i className={`${course.icon.includes('fa-brands') || course.icon.includes('fa-solid') ? course.icon : `fa-solid ${course.icon}`} text-2xl`}></i>
                </div>

                <h3 className="font-black text-xl text-black mb-2 leading-tight group-hover:text-[#003366] transition-colors">
                  {course.title}
                </h3>

                {course.duration && (
                  <div className="inline-flex items-center gap-1.5 neo-badge bg-white text-black text-[11px] font-bold mb-3 group-hover:border-[#003366] transition-colors">
                    <Clock className="w-3 h-3 text-[#003366] stroke-[2.5]" />
                    <span>{course.duration} Hands-on</span>
                  </div>
                )}

                <p className="text-slate-700 text-sm leading-relaxed mb-6 font-medium">
                  {course.desc}
                </p>
              </div>

              <button
                onClick={onOpenJoin}
                className="mt-auto pt-3 border-t-2 border-black text-xs font-black text-black group-hover:text-[#003366] flex items-center justify-between w-full transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 stroke-[2.5] group-hover:scale-110 transition-transform" />
                  <span>Enroll in track</span>
                </span>
                <span className="w-6 h-6 rounded border-2 border-black bg-[#FFE600] flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] group-hover:translate-x-1.5 group-hover:bg-[#10B981] group-hover:text-white transition-all duration-150">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
