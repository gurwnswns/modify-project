import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import client from '@/api/client';
import { Camera, X, Save, Settings, LogOut, ArrowLeft } from 'lucide-react'; // 아이콘 추가
import { useNavigate } from 'react-router-dom'; // 페이지 이동용

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore(); // logout 추가
  
  // 상태 관리
  const [nickname, setNickname] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 초기 데이터 세팅
  useEffect(() => {
    if (isOpen && user) {
      setNickname(user.full_name || '');
      setPreviewImage(user.profile_image || null);
      setSelectedFile(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null; 

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setSelectedFile(file);
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");
    setIsLoading(true);

    try {
      let finalImageUrl = user?.profile_image;

      // 1. 이미지 업로드
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await client.post('/utils/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.url;
      }

      // 2. 프로필 정보 업데이트
      const response = await client.patch('/users/me', {
        full_name: nickname,
        profile_image: finalImageUrl 
      });

      setUser(response.data); 
      alert("프로필이 수정되었습니다! ✨");
      onClose(); // 저장 후 닫기

    } catch (error) {
      console.error(error);
      alert("수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🌑 배경 오버레이
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      
      {/* ⬜ 모달 컨텐츠 */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-8 relative animate-scale-up m-4 max-h-[90vh] overflow-y-auto scrollbar-hide">
        
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mt-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">프로필 편집</h2>

          {/* 🖼️ 프사 영역 */}
          <div className="relative group mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-50 flex items-center justify-center">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-300">{user?.email?.[0].toUpperCase()}</span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#7A51A1] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#6941C6] transition-all border-2 border-white"
            >
              <Camera size={18} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* 📝 닉네임 입력 */}
          <div className="w-full space-y-2 mb-8">
            <label className="text-sm font-bold text-gray-600 ml-1">닉네임</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-[54px] px-5 bg-[#F2F4F7] border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#7A51A1] outline-none transition-all text-center text-lg font-medium text-gray-800"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          {/* 저장 버튼 */}
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full h-[54px] bg-gradient-to-r from-[#7A51A1] to-[#5D93D0] hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? '저장 중...' : <><Save size={20} /> 저장하기</>}
          </button>

          {/* --------------------------------------------------------- */}
          {/* ✅ [복구 완료] 계정 설정 페이지로 이동하는 버튼들 */}
          {/* --------------------------------------------------------- */}
          <div className="w-full mt-8 pt-8 border-t border-gray-100 space-y-3">
            <p className="text-xs text-gray-400 font-medium ml-2 mb-2">계정 관리</p>
            
            {/* ⚙️ 계정 설정 버튼 */}
            <button 
              onClick={() => {
                onClose(); // 모달 닫고
                navigate('/account'); // 계정 설정 페이지로 이동!
              }} 
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm group-hover:text-[#7A51A1]">
                  <Settings size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-700">계정 및 보안 설정</p>
                  <p className="text-xs text-gray-400">비밀번호 변경, 전화번호 관리</p>
                </div>
              </div>
              <ArrowLeft size={18} className="text-gray-300 rotate-180" />
            </button>

            {/* 👋 로그아웃 버튼 */}
            <button 
              onClick={() => {
                onClose();
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center p-3 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={16} className="mr-2" /> 로그아웃
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}