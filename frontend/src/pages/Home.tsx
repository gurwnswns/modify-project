import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Heart, Send } from "lucide-react";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { useSearchStore } from "@/store/searchStore";

// 🚨 Home.tsx에는 이제 로고나 햄버거 버튼이 필요 없어! (Header가 다 하니까)

export default function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const { addRecentSearch } = useSearchStore();
  const { isListening, startListening } = useVoiceControl((text) => {
    setPrompt((prev) => (prev ? `${prev} ${text}` : text));
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    addRecentSearch(prompt.trim());
    navigate(`/search?q=${encodeURIComponent(prompt)}`);
  };

  const handleKeywordClick = (keyword: string) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const topKeywords = ["봄 데이트룩", "미니멀", "오피스룩", "빈티지"];
  const promptCards = [
    {
      text: "다가오는 벚꽃 축제, 화사하게 입고 싶은데 남자친구랑 시밀러 룩 추천해줘",
    },
    { text: "바리스타로서의 매력이 좋아보이는 편안한 룩을 검색해줘" },
    {
      text: "어른들과 함께하는 격식있는 식사자리에서 입을 만한 마무리 검색해줘",
    },
    { text: "해외여행을 앞두고 캐주얼한 복장과 간편한 착장을 추천해줘" },
  ];

  return (
    // 🚨 [핵심 수정] 여기에 있던 'bg-gradient-to-br...' 배경 코드 삭제!
    // flex랑 정렬 관련 코드만 남겨둠.
    <div className="flex flex-col items-center justify-center p-6 transition-colors duration-300 relative min-h-[calc(100vh-4rem)]">
      {/* 🚨 상단 헤더(햄버거, 로고) 코드도 삭제! (Header.tsx에 있으니까) */}

      {/* 메인 타이틀 */}
      <h1 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-blue-500 pb-2 mt-12 md:mt-0">
        원하시는 스타일이 무엇인가요?
      </h1>

      {/* ... (이하 버튼, 카드, 검색창 코드는 기존과 완벽히 동일) ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl mb-8 px-4">
        {topKeywords.map((keyword, idx) => (
          <button
            key={idx}
            onClick={() => handleKeywordClick(keyword)}
            className="w-full py-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-50 dark:hover:border-indigo-900 transition-all duration-300"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl mb-14 px-4">
        {promptCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => setPrompt(card.text)}
            className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white dark:border-slate-700 hover:border-purple-50 dark:hover:border-slate-600 cursor-pointer hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex items-center h-full min-h-[100px]"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 font-medium">
              {card.text}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-7xl px-4 relative">
        <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 dark:border-slate-700 flex gap-6 transition-all hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] mb-4">
          <button
            onClick={startListening}
            className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300
              ${
                isListening
                  ? "bg-red-500 animate-pulse ring-4 ring-red-100 dark:ring-red-900"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-indigo-200 dark:hover:shadow-none"
              }
            `}
            title="음성으로 입력하기"
          >
            <Mic size={28} className="stroke-[2.5]" />
          </button>

          <div className="flex-1 flex flex-col min-h-[160px]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder={
                isListening
                  ? "말씀해주세요..."
                  : "원하는 스타일을 입력하거나 위의 예시를 클릭 해주세요"
              }
              className="w-full h-full bg-transparent border-none outline-none text-xl resize-none placeholder-slate-300 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100 leading-relaxed pt-2"
            />

            <div className="flex justify-end items-end pb-1">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {prompt.length} / 1000
                </span>

                <button
                  onClick={() => handleSearch()}
                  disabled={!prompt.trim()}
                  className="p-3 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-30"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg">
            <Heart size={14} className="fill-current text-red-500" />
            Wishlist
          </button>
        </div>

        {isListening && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full text-sm font-medium animate-bounce shadow-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            듣고 있어요...
          </div>
        )}
      </div>
    </div>
  );
}
