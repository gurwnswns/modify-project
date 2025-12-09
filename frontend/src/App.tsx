import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUIStore } from '@/store/uiStore';

import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import ProductDetail from '@/pages/ProductDetail';

// 🚨 [수정 포인트 1] Import 경로와 이름을 명확하게 분리!
import Account from '@/pages/Account'; // (구) Profile.tsx -> 계정 설정 페이지
import Profile from '@/pages/Profile'; // (신) Profile.tsx -> 프로필 꾸미기 페이지
import Settings from '@/pages/Settings';

import Dashboard from '@/pages/admin/Dashboard';
import ProductUpload from '@/pages/admin/ProductUpload';
import AdminRoute from '@/components/routes/AdminRoute'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { isDarkMode } = useUIStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
          <Routes>
            {/* 🟢 레이아웃이 적용되는 페이지들 (헤더/사이드바 있음) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* 관리자 라우트 */}
              <Route element={<AdminRoute />}> 
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/upload" element={<ProductUpload />} />
              </Route>
            </Route>
            
            {/* 🔴 레이아웃 없이 단독으로 뜨는 페이지들 */}
            <Route path="/login" element={<Login />} />
            
            {/* 🚨 [수정 포인트 2] 라우터 경로 분리 */}
            <Route path="/profile" element={<Profile />} />   {/* 예쁜 프로필 화면 */}
            <Route path="/account" element={<Account />} />   {/* 계정/보안 설정 화면 */}
            
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}