import React from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ 로고 이미지 경로 확인!
import logoModifyColor from "@/assets/images/logo-modify-color.png";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    // 🚨 [핵심 수정] bg-transparent 적용, border-b 제거!
    <header className="fixed top-0 left-0 right-0 h-16 z-30 px-4 flex items-center justify-between transition-colors duration-300 bg-transparent">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex items-center">
          <img
            src={logoModifyColor}
            alt="MODIFY"
            className="h-5 w-auto hover:opacity-80 transition-opacity mb-0.5"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/cart"
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative"
        >
          <ShoppingBag size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </Link>
      </div>
    </header>
  );
}
