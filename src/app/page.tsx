export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
        {/* 프로필 아바타 */}
        <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold mb-4">
          백
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">백진우</h1>

        {/* 소개글 */}
        <p className="text-gray-600 text-base leading-relaxed">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다!
        </p>
      </main>
    </div>
  );
}
