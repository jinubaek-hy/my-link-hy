import Image from "next/image";

const techStacks = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Git",
];

const socialLinks = [
  {
    title: "GitHub",
    description: "오픈소스 기여 및 프로젝트 저장소",
    href: "https://github.com/jinubaek-hy",
    badge: "@jinubaek-hy",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Portfolio & Projects",
    description: "진행한 웹 애플리케이션 및 사이드 프로젝트 모음",
    href: "https://github.com/jinubaek-hy?tab=repositories",
    badge: "Projects",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Tech Blog",
    description: "개발 기록과 문제 해결 과정을 정리하는 공간",
    href: "#blog",
    badge: "Articles",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Contact Me",
    description: "협업 제안 및 커피챗 문의하기",
    href: "mailto:jinubaek@example.com",
    badge: "Email",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const featuredProjects = [
  {
    name: "MyLink Profile",
    summary: "Next.js 16 & Tailwind CSS 기반의 반응형 개발자 프로필 및 링크 허브",
    tag: "Next.js · Tailwind",
  },
  {
    name: "Vibe Coding Web App",
    summary: "직관적인 UI/UX와 빠른 인터랙션을 목표로 설계한 모던 웹 프로젝트",
    tag: "React · TypeScript",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/60 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* 메인 컨테이너 (모바일에서는 단일 카드, 데스크톱에서는 2단 그리드 레이아웃) */}
      <main className="w-full max-w-md lg:max-w-4xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-500/5 border border-white/60 dark:border-slate-800 overflow-hidden transition-all duration-300">
        {/* 상단 커버 배너 이미지 */}
        <div className="relative h-36 sm:h-48 lg:h-56 w-full overflow-hidden">
          <Image
            src="/profile-banner.jpg"
            alt="Developer Cover Banner"
            fill
            priority
            className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* 상태 배지 */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-xs font-medium border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open to Work &amp; Collaborate
          </div>
        </div>

        {/* 본문 영역: 반응형 그리드 */}
        <div className="px-6 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* 좌측 영역: 프로필 아바타, 소개, 기술 스택 */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left -mt-16 sm:-mt-20 relative z-10">
              {/* 프로필 이미지 */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl p-1.5 bg-white dark:bg-slate-900 shadow-lg ring-1 ring-slate-900/5 mb-4 group">
                <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden">
                  <Image
                    src="/profile-avatar.jpg"
                    alt="백진우 프로필 이미지"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* 이름 및 직함 */}
              <div className="space-y-1.5 mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase">
                  Software Developer
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  백진우 <span className="font-normal text-base text-slate-400 dark:text-slate-500">Jinu Baek</span>
                </h1>
              </div>

              {/* 소개글 */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                안녕하세요! 사용자 중심의 웹 서비스를 만드는 개발자입니다. 깔끔한 코드와 감각적인 인터페이스로 아이디어를 현실로 구현하는 것을 좋아합니다.
              </p>

              {/* 핵심 지표 요약 */}
              <div className="w-full grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6 text-center">
                <div>
                  <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">Web</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Specialty</div>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-700">
                  <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">Clean UI</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Focus</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">Seoul</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Location</div>
                </div>
              </div>

              {/* 기술 스택 태그 */}
              <div className="w-full">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {techStacks.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측 영역: 소셜 링크 카드 & 주요 프로젝트 */}
            <div className="lg:col-span-7 flex flex-col justify-between lg:pt-6 space-y-6">
              {/* 링크 섹션 */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Connect &amp; Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-105 transition-all shrink-0">
                          {link.icon}
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                              {link.title}
                            </span>
                            <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                              {link.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* 주요 프로젝트 섹션 */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredProjects.map((project) => (
                    <div
                      key={project.name}
                      className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-violet-50/40 dark:from-slate-800/60 dark:to-indigo-950/30 border border-indigo-100/80 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {project.name}
                          </h3>
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                          {project.summary}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        {project.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
