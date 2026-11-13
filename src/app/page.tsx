import Image from "next/image";

const techChips = [
  { name: "TypeScript", primary: true },
  { name: "React 19", primary: true },
  { name: "Next.js 16", primary: true },
  { name: "Tailwind CSS", primary: false },
  { name: "Node.js", primary: false },
  { name: "Git & GitHub", primary: false },
];

const channelRows = [
  {
    id: "github",
    title: "GitHub",
    subtitle: "작성한 코드와 오픈소스 기여 내역을 모아뒀어요",
    meta: "@jinubaek-hy",
    positive: true,
    href: "https://github.com/jinubaek-hy",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: "projects",
    title: "프로젝트 보관함",
    subtitle: "직접 기획하고 만든 웹 서비스를 한눈에 볼 수 있어요",
    meta: "저장소 보기",
    positive: false,
    href: "https://github.com/jinubaek-hy?tab=repositories",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "blog",
    title: "개발 노트",
    subtitle: "문제를 해결한 과정과 배운 점을 기록하고 있어요",
    meta: "글 읽기",
    positive: false,
    href: "#projects",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
];

const projectRows = [
  {
    title: "마이링크 프로필",
    description: "토스 디자인 시스템(TDS)의 시각 언어와 해요체를 적용해 만든 반응형 프로필 페이지예요.",
    stack: "Next.js 16 · Tailwind CSS",
    metrics: "100%",
    metricsLabel: "반응형 지원",
    href: "https://github.com/jinubaek-hy/my-link-hy",
  },
  {
    title: "바이브 코딩 웹 워크스페이스",
    description: "복잡한 기능을 덜어내고 사용자가 원하는 행동에 바로 집중할 수 있도록 설계한 웹 서비스예요.",
    stack: "React 19 · TypeScript",
    metrics: "v1.2",
    metricsLabel: "운영 중",
    href: "https://github.com/jinubaek-hy",
  },
];

const activityStats = [
  { label: "집중 분야", value: "웹 프론트엔드", isNumber: false },
  { label: "주요 기술", value: "6개", isNumber: true },
  { label: "응답 시간", value: "24시간 이내", isNumber: true },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--tds-bg-canvas)] text-[var(--tds-fg-primary)] pb-32">
      {/* Top App Bar (56pt height, left-aligned title, right action slot) */}
      <header className="sticky top-0 z-20 h-[56px] bg-[var(--tds-bg-canvas)]/90 backdrop-blur-md border-b border-[var(--tds-border-hairline)]">
        <div className="max-w-[640px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-semibold tracking-[-0.01em] text-[var(--tds-fg-primary)]">
              백진우 프로필
            </span>
          </div>
          <a
            href="https://github.com/jinubaek-hy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 열기"
            className="w-10 h-10 -mr-2 rounded-[12px] flex items-center justify-center text-[var(--tds-fg-secondary)] hover:bg-[var(--tds-bg-secondary)] active:opacity-70 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.67} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
      </header>

      {/* Main Single-Column Container (TDS Mobile-First: single column across mobile & tablet) */}
      <main className="max-w-[640px] mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Hero Profile Card (radius-3xl: 24px, flat surface) */}
        <section className="bg-[var(--tds-bg-surface)] rounded-[24px] p-6 border border-[var(--tds-border-hairline)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar Container */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] overflow-hidden bg-[var(--tds-bg-secondary)] border border-[var(--tds-border-hairline)] shrink-0">
              <Image
                src="/profile-avatar.jpg"
                alt="백진우 프로필 사진"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                priority
                className="object-cover"
              />
            </div>

            {/* Name & Role */}
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[6px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)] text-[12px] font-medium mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--tds-blue-500)]" />
                함께 일할 팀을 찾고 있어요
              </div>
              <h1 className="text-[24px] sm:text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-fg-primary)]">
                백진우
              </h1>
              <p className="text-[15px] leading-[1.5] text-[var(--tds-fg-secondary)] mt-1 break-keep">
                안녕하세요, 사용자 중심의 웹 서비스를 만드는 개발자예요. 복잡한 문제를 단순하고 쓰기 편한 화면으로 풀어내는 일을 좋아해요.
              </p>
            </div>
          </div>

          {/* Table-Row / Key Metrics Summary (1px hairline divider, tabular-nums) */}
          <div className="mt-6 pt-5 border-t border-[var(--tds-border-hairline)] grid grid-cols-3 gap-2">
            {activityStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[12px] font-medium text-[var(--tds-fg-tertiary)] leading-[1.4]">
                  {stat.label}
                </span>
                <span
                  className={`text-[15px] sm:text-[17px] font-semibold text-[var(--tds-fg-primary)] mt-0.5 ${
                    stat.isNumber ? "tds-tabular" : ""
                  }`}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section (TDS Chip: 34px height, radius-full 999px) */}
        <section className="bg-[var(--tds-bg-surface)] rounded-[24px] p-6 border border-[var(--tds-border-hairline)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--tds-fg-primary)]">
              주로 쓰는 기술이에요
            </h2>
            <span className="text-[13px] font-normal text-[var(--tds-fg-tertiary)] tds-tabular">
              총 6개
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {techChips.map((chip) =>
              chip.primary ? (
                <span
                  key={chip.name}
                  className="inline-flex items-center h-[34px] px-3.5 rounded-full bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)] text-[13px] font-semibold leading-[1.25]"
                >
                  {chip.name}
                </span>
              ) : (
                <span
                  key={chip.name}
                  className="inline-flex items-center h-[34px] px-3.5 rounded-full bg-[var(--tds-bg-surface)] text-[var(--tds-fg-secondary)] border border-[var(--tds-border-hairline)] text-[13px] font-semibold leading-[1.25]"
                >
                  {chip.name}
                </span>
              )
            )}
          </div>
        </section>

        {/* Channels & Links Section (TDS List-Header + List-Row) */}
        <section className="bg-[var(--tds-bg-surface)] rounded-[24px] py-3 border border-[var(--tds-border-hairline)]">
          {/* List-Header */}
          <div className="px-6 pt-3 pb-2 flex items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--tds-fg-primary)]">
              채널 바로가기
            </h2>
            <span className="text-[13px] text-[var(--tds-fg-tertiary)]">
              한번에 모아봤어요
            </span>
          </div>

          {/* List-Row items (padding 14x24, gap 14px, 44px avatar with radius 14px) */}
          <div className="divide-y divide-[var(--tds-border-hairline)]">
            {channelRows.map((row) => (
              <a
                key={row.id}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between gap-[14px] px-6 py-[14px] min-h-[72px] hover:bg-[var(--tds-bg-secondary)]/60 active:bg-[var(--tds-bg-secondary)] transition-colors duration-150"
              >
                <div className="flex items-center gap-[14px] min-w-0 flex-1">
                  {/* 44px Avatar Container (radius-l: 14px) */}
                  <div className="w-[44px] h-[44px] rounded-[14px] bg-[var(--tds-bg-secondary)] text-[var(--tds-fg-primary)] flex items-center justify-center shrink-0">
                    {row.icon}
                  </div>

                  {/* Title & Subtitle Stack */}
                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--tds-fg-primary)] truncate">
                      {row.title}
                    </div>
                    <p className="text-[13px] font-normal leading-[1.5] text-[var(--tds-fg-secondary)] line-clamp-2 sm:truncate break-keep">
                      {row.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Slot (meta + chevron) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`hidden sm:inline text-[15px] font-semibold tds-tabular ${
                      row.positive
                        ? "text-[var(--tds-blue-500)]"
                        : "text-[var(--tds-fg-secondary)]"
                    }`}
                  >
                    {row.meta}
                  </span>
                  <svg
                    className="w-5 h-5 text-[var(--tds-grey-400)] group-hover:translate-x-0.5 transition-transform duration-150"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" className="bg-[var(--tds-bg-surface)] rounded-[24px] p-6 border border-[var(--tds-border-hairline)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--tds-fg-primary)]">
                대표 프로젝트예요
              </h2>
              <p className="text-[13px] text-[var(--tds-fg-secondary)] mt-0.5">
                직접 설계하고 구현한 결과물만 추렸어요
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {projectRows.map((project) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-[16px] bg-[var(--tds-bg-secondary)] hover:opacity-90 active:opacity-75 transition-opacity duration-150"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-[17px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--tds-fg-primary)]">
                    {project.title}
                  </h3>
                  <span className="inline-flex items-center h-[22px] px-2 rounded-[6px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)] text-[12px] font-medium tds-tabular shrink-0">
                    {project.metrics} · {project.metricsLabel}
                  </span>
                </div>

                <p className="text-[15px] font-normal leading-[1.5] text-[var(--tds-fg-secondary)] mb-3 break-keep">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--tds-fg-tertiary)]">
                  <span>{project.stack}</span>
                  <span className="text-[var(--tds-blue-500)]">자세히 보기</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Info + Bottom CTA (Single Primary Action on Screen in Toss Blue #3182F6) */}
      <div className="fixed bottom-0 inset-x-0 z-30 pointer-events-none">
        {/* Top Protective Gradient (white/canvas -> transparent, 28px) */}
        <div className="h-7 bg-gradient-to-t from-[var(--tds-bg-canvas)] to-transparent" />

        <div className="bg-[var(--tds-bg-canvas)] pb-[max(16px,env(safe-area-inset-bottom))] pt-1 px-4">
          <div className="max-w-[640px] mx-auto flex flex-col items-center gap-2.5 pointer-events-auto">
            {/* Bottom-Info Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)] text-[12px] font-medium">
              <span>새로운 프로젝트나 커피챗 제안을 기다리고 있어요</span>
            </div>

            {/* Bottom-CTA (56pt height, radius-xl 16px, label-l 17px Bold, single primary blue fill) */}
            <a
              href="mailto:jinubaek@example.com"
              className="relative overflow-hidden w-full h-[56px] rounded-[16px] bg-[var(--tds-blue-500)] text-white text-[17px] font-bold leading-[1.25] tracking-[-0.005em] flex items-center justify-center transition-transform duration-120 active:scale-[0.99] after:content-[''] after:absolute after:inset-0 after:bg-black/0 active:after:bg-[var(--tds-press-overlay)] after:transition-colors"
            >
              이메일로 연락하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
