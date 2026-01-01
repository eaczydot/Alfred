import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';
import { Report, UserStats, UserProfile } from '@/types';
import { ACHIEVEMENTS } from '@/constants/categories';

const STORAGE_KEY = 'civic_ai_data';

export const [AppProvider, useApp] = createContextHook(() => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalReports: 0,
    totalPoints: 0,
    streak: 0,
    level: 1,
    achievements: ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'uuid_v4',
    handle: 'CITIZEN',
    trust_score: 0.85,
    impact_credits: 0,
    linked_channels: ["311_API", "NEXTDOOR_OAUTH"]
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setReports(data.reports || []);
        if (data.stats) setStats(data.stats);
        if (data.userProfile) setUserProfile(data.userProfile);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = async (newReports: Report[], newStats: UserStats, newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        reports: newReports,
        stats: newStats,
        userProfile: newProfile
      }));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const addReport = (report: Report) => {
    const newReports = [report, ...reports];
    const newPoints = stats.totalPoints + report.points;
    const newTotalReports = stats.totalReports + 1;
    const newLevel = Math.floor(newPoints / 100) + 1;

    const updatedAchievements = stats.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      const shouldUnlock = 
        (achievement.id === 'first_report' && newTotalReports >= 1) ||
        (achievement.id === 'reporter_10' && newTotalReports >= 10) ||
        (achievement.id === 'reporter_50' && newTotalReports >= 50) ||
        (achievement.id === 'reporter_100' && newTotalReports >= 100) ||
        (achievement.id === 'points_500' && newPoints >= 500);

      return { ...achievement, unlocked: shouldUnlock };
    });

    const newStats = {
      ...stats,
      totalReports: newTotalReports,
      totalPoints: newPoints,
      level: newLevel,
      achievements: updatedAchievements
    };

    const newProfile = {
      ...userProfile,
      impact_credits: newPoints // Sync for simplicity, though schema separates them
    };

    setReports(newReports);
    setStats(newStats);
    setUserProfile(newProfile);
    saveData(newReports, newStats, newProfile);
  };

  return {
    reports,
    stats,
    userProfile,
    isLoading,
    addReport
  };
});
