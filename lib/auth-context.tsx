'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BeneficiaryProfile, UserAuth } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';

interface AuthContextType {
  user: UserAuth | null;
  profile: BeneficiaryProfile;
  savedCourseIds: string[];
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<BeneficiaryProfile>) => void;
  toggleSaveCourse: (courseId: string) => void;
}

const defaultProfile: BeneficiaryProfile = DEMO_BENEFICIARIES[0].profile;

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: defaultProfile,
  savedCourseIds: [],
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  toggleSaveCourse: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [profile, setProfile] = useState<BeneficiaryProfile>(defaultProfile);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(['nsqf-app-01', 'nsqf-nielit-01']);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('saksham_user');
      const storedProfile = localStorage.getItem('saksham_profile');
      const storedSaved = localStorage.getItem('saksham_saved_courses');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedSaved) setSavedCourseIds(JSON.parse(storedSaved));
    }
  }, []);

  const login = (email: string, name: string) => {
    const authUser: UserAuth = {
      userId: `user-${Date.now()}`,
      email,
      name
    };
    setUser(authUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saksham_user', JSON.stringify(authUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('saksham_user');
    }
  };

  const updateProfile = (updated: Partial<BeneficiaryProfile>) => {
    setProfile((prev) => {
      const newProf = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('saksham_profile', JSON.stringify(newProf));
      }
      return newProf;
    });
  };

  const toggleSaveCourse = (courseId: string) => {
    setSavedCourseIds((prev) => {
      const isSaved = prev.includes(courseId);
      const newSaved = isSaved ? prev.filter((id) => id !== courseId) : [...prev, courseId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('saksham_saved_courses', JSON.stringify(newSaved));
      }
      return newSaved;
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, savedCourseIds, login, logout, updateProfile, toggleSaveCourse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
