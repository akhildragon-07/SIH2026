'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BeneficiaryProfile, UserAuth } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';

interface AuthContextType {
  user: UserAuth | null;
  profile: BeneficiaryProfile;
  savedCourseIds: string[];
  registeredBeneficiaries: BeneficiaryProfile[];
  isSyncing: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  registerBeneficiary: (profileData: Partial<BeneficiaryProfile>) => Promise<BeneficiaryProfile>;
  updateProfile: (updated: Partial<BeneficiaryProfile>) => Promise<BeneficiaryProfile>;
  toggleSaveCourse: (courseId: string) => void;
  syncWithBackend: () => Promise<void>;
  switchBeneficiary: (target: string | BeneficiaryProfile) => Promise<void>;
}

const defaultSeedList: BeneficiaryProfile[] = DEMO_BENEFICIARIES.map((d, index) => ({
  ...d.profile,
  beneficiaryId: `SC-AJAY-2026-100${index + 1}`,
  userId: `user-00${index + 1}`,
  phone: `984802233${8 + index}`,
  email: `${d.profile.name.toLowerCase().replace(/\s+/g, '')}@pmajay.gov.in`,
  category: 'Scheduled Caste (SC)',
  isBackendSynced: true,
  giaEligibilityStatus: 'Eligible for 100% GIA Toolkit Grant'
}));

const defaultProfile: BeneficiaryProfile = defaultSeedList[0];

const AuthContext = createContext<AuthContextType>({
  user: {
    userId: 'user-001',
    beneficiaryId: 'SC-AJAY-2026-1001',
    email: 'ravi.kumar@pmajay.gov.in',
    phone: '9848022338',
    name: 'Ravi Kumar',
    isAuthenticated: true
  },
  profile: defaultProfile,
  savedCourseIds: [],
  registeredBeneficiaries: defaultSeedList,
  isSyncing: false,
  login: () => {},
  logout: () => {},
  registerBeneficiary: async () => defaultProfile,
  updateProfile: async () => defaultProfile,
  toggleSaveCourse: () => {},
  syncWithBackend: async () => {},
  switchBeneficiary: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>({
    userId: defaultProfile.userId || 'user-001',
    beneficiaryId: defaultProfile.beneficiaryId || 'SC-AJAY-2026-1001',
    email: defaultProfile.email || 'ravi.kumar@pmajay.gov.in',
    phone: defaultProfile.phone || '9848022338',
    name: defaultProfile.name,
    isAuthenticated: true
  });
  const [profile, setProfile] = useState<BeneficiaryProfile>(defaultProfile);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(['nsqf-app-01', 'nsqf-elec-01']);
  const [registeredBeneficiaries, setRegisteredBeneficiaries] = useState<BeneficiaryProfile[]>(defaultSeedList);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initialize from LocalStorage and sync with backend on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('saksham_user');
      const storedProfile = localStorage.getItem('saksham_profile');
      const storedSaved = localStorage.getItem('saksham_saved_courses');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedSaved) setSavedCourseIds(JSON.parse(storedSaved));

      syncInitialBackend();
    }
  }, []);

  const syncInitialBackend = async () => {
    try {
      const res = await fetch('/api/beneficiaries');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setRegisteredBeneficiaries(json.data);
        }
      }
    } catch (e) {
      console.warn('Backend initial ping note:', e);
    }
  };

  const registerBeneficiary = async (profileData: Partial<BeneficiaryProfile>): Promise<BeneficiaryProfile> => {
    setIsSyncing(true);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBeneficiaryId = profileData.beneficiaryId || `SC-AJAY-2026-${randomSuffix}`;
    const newUserId = profileData.userId || `user-${Date.now()}`;

    const fullProfile: BeneficiaryProfile = {
      ...defaultProfile,
      ...profileData,
      id: newBeneficiaryId,
      beneficiaryId: newBeneficiaryId,
      userId: newUserId,
      category: profileData.category || 'Scheduled Caste (SC)',
      giaEligibilityStatus: 'Eligible for 100% GIA Toolkit Grant',
      isBackendSynced: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Save to Backend Database
    try {
      const res = await fetch('/api/beneficiaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProfile)
      });
      const json = await res.json();
      if (json.success && json.data) {
        fullProfile.isBackendSynced = true;
      }
      await syncInitialBackend();
    } catch (err) {
      console.error('Failed to register beneficiary on backend API:', err);
      fullProfile.isBackendSynced = false;
    } finally {
      setIsSyncing(false);
    }

    // 2. Set Active Session & Local Storage
    const authUser: UserAuth = {
      userId: newUserId,
      beneficiaryId: newBeneficiaryId,
      email: fullProfile.email || `${fullProfile.name.toLowerCase().replace(/\s+/g, '')}@pmajay.gov.in`,
      phone: fullProfile.phone || '9848022338',
      name: fullProfile.name,
      isAuthenticated: true
    };

    setUser(authUser);
    setProfile(fullProfile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('saksham_user', JSON.stringify(authUser));
      localStorage.setItem('saksham_profile', JSON.stringify(fullProfile));
    }

    return fullProfile;
  };

  const updateProfile = async (updated: Partial<BeneficiaryProfile>): Promise<BeneficiaryProfile> => {
    const newProf: BeneficiaryProfile = {
      ...profile,
      ...updated,
      updatedAt: new Date().toISOString()
    };

    setProfile(newProf);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saksham_profile', JSON.stringify(newProf));
    }

    // Sync update to backend API
    if (newProf.beneficiaryId) {
      try {
        setIsSyncing(true);
        const res = await fetch(`/api/beneficiaries/${encodeURIComponent(newProf.beneficiaryId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProf)
        });
        const json = await res.json();
        if (json.success && json.data) {
          newProf.isBackendSynced = true;
          setProfile(newProf);
          localStorage.setItem('saksham_profile', JSON.stringify(newProf));
        }
        await syncInitialBackend();
      } catch (err) {
        console.warn('Backend update sync note:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    return newProf;
  };

  const syncWithBackend = async () => {
    if (!profile.beneficiaryId) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/beneficiaries/${encodeURIComponent(profile.beneficiaryId)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setProfile(json.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('saksham_profile', JSON.stringify(json.data));
        }
      }
      await syncInitialBackend();
    } catch (err) {
      console.error('Failed to sync beneficiary from backend:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const switchBeneficiary = async (target: string | BeneficiaryProfile) => {
    let targetProfile: BeneficiaryProfile | undefined;
    if (typeof target === 'string') {
      targetProfile = registeredBeneficiaries.find(
        (b) => b.beneficiaryId === target || b.id === target || b.userId === target
      );
      if (!targetProfile) {
        try {
          const res = await fetch(`/api/beneficiaries/${encodeURIComponent(target)}`);
          const json = await res.json();
          if (json.success && json.data) {
            targetProfile = json.data;
          }
        } catch (e) {}
      }
    } else {
      targetProfile = target;
    }

    if (!targetProfile) return;

    const authUser: UserAuth = {
      userId: targetProfile.userId || `user-${Date.now()}`,
      beneficiaryId: targetProfile.beneficiaryId || targetProfile.id || `SC-AJAY-2026-1001`,
      email: targetProfile.email || `${targetProfile.name.toLowerCase().replace(/\s+/g, '')}@pmajay.gov.in`,
      phone: targetProfile.phone || '9848022338',
      name: targetProfile.name,
      isAuthenticated: true
    };

    setUser(authUser);
    setProfile(targetProfile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('saksham_user', JSON.stringify(authUser));
      localStorage.setItem('saksham_profile', JSON.stringify(targetProfile));
    }
  };

  const login = (email: string, name: string) => {
    const authUser: UserAuth = {
      userId: `user-${Date.now()}`,
      beneficiaryId: profile.beneficiaryId || `SC-AJAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      email,
      name,
      isAuthenticated: true
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
    <AuthContext.Provider value={{
      user,
      profile,
      savedCourseIds,
      registeredBeneficiaries,
      isSyncing,
      login,
      logout,
      registerBeneficiary,
      updateProfile,
      toggleSaveCourse,
      syncWithBackend,
      switchBeneficiary
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


