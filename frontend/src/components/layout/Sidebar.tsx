import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, ChevronRight, Star, Trash2, Settings, User, 
  Sun, Moon, LogOut 
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/searchStore';
import { useUIStore } from '@/store/uiStore';

// ✅ [1] 로고 이미지 불러오기 (경로가 정확한지 꼭 확인!)
import logoModifyColor from '@/assets/images/logo-modify-color.png'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const { recentSearches, favorites, removeRecentSearch, clearRecentSearches, toggleFavorite } = useSearchStore();

  const handleItemClick = (keyword: string) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    onClose();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/60 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* 배경색 및 스타일 설정 */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#F7F8FA] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-300 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col rounded-r-[20px] overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* 1. 상단: 헤더 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
             
             {/* ✅ [2] 텍스트 로고 삭제 -> 이미지 로고 교체 */}
             <img 
               src={logoModifyColor} 
               alt="MODIFY" 
               className="h-4 w-auto cursor-pointer" // 높이는 원하는 대로 조절 가능 (h-5, h-6, h-7 등)
               onClick={() => {
                 navigate('/');
                 onClose(); // 로고 클릭 시 홈 이동 & 사이드바 닫기
               }}
             />

             <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {user ? (
            <div 
              onClick={() => { navigate('/profile'); onClose(); }}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-lg group-hover:scale-105 transition-transform">
                {user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email.split('@')[0]}</p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-gray-400" />
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={onClose}
              className="flex items-center justify-between w-full p-3 bg-white dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors shadow-sm border border-purple-100 dark:border-purple-800"
            >
              <div className="flex items-center gap-2">
                <User size={20} />
                <span>로그인하기</span>
              </div>
              <ChevronRight size={18} />
            </Link>
          )}
        </div>

        {/* 2. 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* ⭐ 즐겨찾기 섹션 */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
              <Star 
                size={16} 
                className="text-orange-500 fill-orange-500" 
              /> 
              즐겨찾기
            </h3>

            {favorites.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-600 py-2">즐겨찾는 스타일이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((item, idx) => (
                  <li key={idx} className="group flex justify-between items-center p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer hover:shadow-sm" onClick={() => handleItemClick(item)}>
                    <span className="text-sm font-medium truncate w-full text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {item}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🕒 최근 검색 섹션 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">최근 검색</h3>
              
              {recentSearches.length > 0 && (
                <button 
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-white dark:hover:bg-red-900/20 hover:shadow-sm"
                >
                  <Trash2 size={12} />
                  <span>기록 삭제</span>
                </button>
              )}
            </div>
            
            {recentSearches.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-600 py-2">최근 검색 기록이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {recentSearches.map((item, idx) => (
                  <li key={idx} className="group flex justify-between items-center p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer hover:shadow-sm" onClick={() => handleItemClick(item)}>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 truncate w-full">
                      {item}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeRecentSearch(item); }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 3. 하단: 설정 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#1a1a1a] space-y-3 backdrop-blur-sm">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDarkMode ? <Moon size={16} className="text-purple-400" /> : <Sun size={16} className="text-orange-500" />}
              {isDarkMode ? '다크 모드' : '라이트 모드'}
            </span>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-purple-600' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          <div className="flex items-center justify-between px-2 pt-2">
            <button onClick={() => { navigate('/settings'); onClose(); }} className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
              <Settings size={14} /> 설정
            </button>
            {user && (
              <button onClick={() => { logout(); onClose(); }} className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-600">
                <LogOut size={14} /> 로그아웃
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}