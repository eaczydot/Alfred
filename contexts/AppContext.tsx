import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';
import { Report, UserStats } from '@/types';
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
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setReports(data.reports || []);
        setStats(s => data.stats || s);
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

  const saveData = async (newReports: Report[], newStats: UserStats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        reports: newReports,
        stats: newStats
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

    setReports(newReports);
    setStats(newStats);
    saveData(newReports, newStats);
  };

  return {
    reports,
    stats,
    isLoading,
    addReport
  };
});
