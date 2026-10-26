import React from 'react';
import { CourseItem } from '../types';
import { Sparkles, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface CoursesSectionProps {
  courses: CourseItem[];
  onOpenJoin: () => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onOpenJoin }) => {
  return (
    <section id="courses" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] bg-[#F5B012]/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F5B012]" />
          <span>Industry Oriented Curriculum</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#003366] tracking-tight">
          Our Courses &amp; Tech Domains
        </h2>
        <div className="w-20 h-1.5 bg-[#F5B012] mx-auto rounded-full mt-3"></div>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Specialized tech training domains meticulously designed for CST students to bridge academic theory with real-world development.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#003366]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div>
              <div className="w-14 h-14 bg-[#003366]/10 text-[#003366] rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-[#003366] group-hover:text-[#F5B012] transition-colors duration-300 shadow-xs">
                <i className={`${course.icon.includes('fa-brands') || course.icon.includes('fa-solid') ? course.icon : `fa-solid ${course.icon}`} text-2xl`}></i>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-xl text-[#003366] group-hover:text-[#00A896] transition-colors">
                  {course.title}
                </h3>
              </div>

              {course.duration && (
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mb-3">
                  <Clock className="w-3 h-3 text-[#F5B012]" />
                  <span>{course.duration} Hands-on</span>
                </div>
              )}

              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                {course.desc}
              </p>
            </div>

            <button
              onClick={onOpenJoin}
              className="mt-auto pt-3 border-t border-slate-100 text-xs font-bold text-[#003366] group-hover:text-[#00A896] flex items-center justify-between w-full transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Join this track</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
