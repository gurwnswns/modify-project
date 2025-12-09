import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. User 타입 정의 (회원가입 시 받는 모든 정보 추가!)
export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;

  // 🚨 [핵심 수정] 프로필 이미지 필드 추가! (이게 있어야 빨간 줄이 사라짐)
  profile_image?: string | null;

  // ✨ 추가된 필드들 (회원가입 & 프로필용)
  phone_number?: string; // 전화번호
  birth_date?: string; // 생년월일 (YYYY-MM-DD 형식 권장)
  address?: string; // 주소
  detail_address?: string; // 상세 주소 (필요하다면)
  zip_code?: string; // 우편번호 (Location)
  country?: string; // 국가 (Location)

  is_marketing_agreed?: boolean; // 마케팅 동의 여부
  provider?: string; // 소셜 로그인 제공자 (google, kakao 등)
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAdmin: boolean;

  // 로그인 함수
  login: (token: string, refreshToken: string, user: User) => void;

  // Access Token만 교체하는 함수
  setAccessToken: (token: string) => void;

  // 로그아웃
  logout: () => void;

  // ✨ 프로필 업데이트용 함수
  setUser: (user: Partial<User>) => void; // Partial<User>로 변경해서 일부만 업데이트 가능하게!
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAdmin: false,

      // 로그인 시 실행
      login: (token, refreshToken, user) => {
        set({
          token: token,
          refreshToken: refreshToken,
          user: user,
          isAdmin: user.is_superuser,
        });
        console.log("✅ Logged In:", user.email);
      },

      // 토큰 갱신 시 실행
      setAccessToken: (token) => {
        set({ token: token });
      },

      // 로그아웃 시 실행
      logout: () => {
        set({ token: null, refreshToken: null, user: null, isAdmin: false });
        localStorage.removeItem("auth-storage");
      },

      // ✨ 프로필 정보 업데이트 (기존 정보를 유지하면서 덮어쓰기)
      // Partial<User>를 받도록 해서, 이름만 바꾸거나 전화번호만 바꿀 때도 OK!
      setUser: (updatedUser) => {
        set((state) => {
          if (!state.user) return state; // 로그인 안 된 상태면 무시

          const newUser = { ...state.user, ...updatedUser };
          return {
            user: newUser,
            isAdmin: newUser.is_superuser,
          };
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
