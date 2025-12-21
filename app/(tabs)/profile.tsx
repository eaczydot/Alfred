import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Star, TrendingUp, Award, Flame, Gem, Shield, Activity, Target, Zap } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

const ICON_MAP: Record<string, any> = {
  trophy: Trophy,
  star: Star,
  award: Award,
  shield: Shield,
  flame: Flame,
  gem: Gem,
};

export default function ProfileScreen() {
  const { stats } = useApp();
  
  const levelProgress = (stats.totalPoints % 100) / 100;
  const pointsToNextLevel = 100 - (stats.totalPoints % 100);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
            <View>
                <Text style={styles.kicker}>CITIZEN PROFILE</Text>
                <Text style={styles.headerTitle}>Impact Report</Text>
            </View>
            <View style={styles.idBadge}>
                <Text style={styles.idText}>ID: CITIZEN-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</Text>
            </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card variant="glass" style={styles.levelCard}>
            <View style={styles.levelHeader}>
                <View>
                    <Text style={styles.levelLabel}>CURRENT TIER</Text>
                    <Text style={styles.levelValue}>TIER {stats.level}</Text>
                </View>
                <View style={styles.rankIcon}>
                    <Shield size={32} color={Theme.tokens.color.accent.primary} />
                </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>PROGRESS TO NEXT TIER</Text>
                  <Text style={styles.progressValue}>{Math.floor(levelProgress * 100)}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${levelProgress * 100}%` }]} />
              </View>
              <Text style={styles.progressSubtext}>
                {pointsToNextLevel} IMPACT POINTS REQUIRED FOR PROMOTION
              </Text>
            </View>
          </Card>

          <View style={styles.statsGrid}>
            <Card style={styles.statCard} variant="default">
              <View style={styles.statHeader}>
                <TrendingUp size={16} color={Theme.tokens.color.accent.info} />
                <Text style={styles.statLabel}>TOTAL IMPACT</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalPoints}</Text>
            </Card>

            <Card style={styles.statCard} variant="default">
              <View style={styles.statHeader}>
                <Target size={16} color={Theme.tokens.color.status.ok} />
                <Text style={styles.statLabel}>REPORTS</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalReports}</Text>
            </Card>

            <Card style={styles.statCard} variant="default">
              <View style={styles.statHeader}>
                <Zap size={16} color={Theme.tokens.color.status.warn} fill={Theme.tokens.color.status.warn} />
                <Text style={styles.statLabel}>STREAK</Text>
              </View>
              <Text style={styles.statValue}>{stats.streak}</Text>
            </Card>

            <Card style={styles.statCard} variant="default">
              <View style={styles.statHeader}>
                <Trophy size={16} color={Theme.tokens.color.accent.primary} />
                <Text style={styles.statLabel}>MILESTONES</Text>
              </View>
              <Text style={styles.statValue}>
                {stats.achievements.filter(a => a.unlocked).length}/{stats.achievements.length}
              </Text>
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MILESTONES</Text>
            <View style={styles.achievementsList}>
              {stats.achievements.map((achievement) => {
                const IconComponent = ICON_MAP[achievement.icon] || Trophy;
                return (
                  <Card 
                    key={achievement.id} 
                    variant={achievement.unlocked ? "glass" : "default"}
                    style={[
                      styles.achievementCard,
                      !achievement.unlocked && styles.achievementLocked
                    ]}
                  >
                    <View style={styles.achievementRow}>
                        <View style={[
                            styles.achievementIcon,
                            achievement.unlocked 
                            ? { borderColor: Theme.tokens.color.accent.primary }
                            : { borderColor: Theme.tokens.color.border.default }
                        ]}>
                            <IconComponent 
                            size={20} 
                            color={achievement.unlocked ? Theme.tokens.color.accent.primary : Theme.tokens.color.text.secondary}
                            />
                        </View>
                        <View style={styles.achievementContent}>
                            <Text style={[
                                styles.achievementTitle,
                                !achievement.unlocked && styles.textMuted
                            ]}>
                                {achievement.title.toUpperCase()}
                            </Text>
                            <Text style={styles.achievementDescription}>
                                {achievement.description}
                            </Text>
                            {!achievement.unlocked && (
                                <Text style={styles.achievementProgress}>
                                    TARGET: {achievement.threshold}
                                </Text>
                            )}
                        </View>
                        {achievement.unlocked && (
                            <View style={styles.unlockedBadge}>
                                <Text style={styles.unlockedText}>ACQUIRED</Text>
                            </View>
                        )}
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Card variant="glass" style={styles.impactCard}>
              <View style={styles.terminalHeader}>
                  <Activity size={14} color={Theme.tokens.color.status.ok} />
                  <Text style={styles.terminalTitle}>SYSTEM LOG</Text>
              </View>
              <Text style={styles.impactText}>
                <Text style={styles.prompt}>{'>'}</Text> Citizen has contributed <Text style={styles.highlight}>{stats.totalReports}</Text> verified reports.{'\n'}
                <Text style={styles.prompt}>{'>'}</Text> Total community impact value evaluated at <Text style={styles.highlight}>{stats.totalPoints}</Text> points.{'\n'}
                <Text style={styles.prompt}>{'>'}</Text> Status: <Text style={{color: Theme.tokens.color.status.ok}}>ACTIVE</Text>
              </Text>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.tokens.color.bg[0],
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.tokens.color.border.default,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Theme.tokens.color.text.tertiary,
    marginBottom: 4,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: Theme.tokens.color.text.primary,
    letterSpacing: -0.5,
  },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
  },
  idText: {
    fontSize: 10,
    color: Theme.tokens.color.text.tertiary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  levelCard: {
    marginBottom: 20,
    borderRadius: 12,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  levelLabel: {
    fontSize: 10,
    color: Theme.tokens.color.text.tertiary,
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  levelValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Theme.tokens.color.text.primary,
    letterSpacing: -1,
  },
  rankIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.1)', // Cyan
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)', // Cyan
  },
  progressContainer: {
    gap: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    color: Theme.tokens.color.text.tertiary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  progressValue: {
    fontSize: 12,
    color: Theme.tokens.color.accent.primary,
    fontWeight: '700',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.tokens.color.accent.primary,
    borderRadius: 2,
  },
  progressSubtext: {
    fontSize: 10,
    color: Theme.tokens.color.text.tertiary,
    marginTop: 4,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    color: Theme.tokens.color.text.secondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: Theme.tokens.color.text.primary,
    letterSpacing: -0.5,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.tokens.color.text.secondary,
    marginBottom: 12,
    letterSpacing: 1,
    paddingHorizontal: 4,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 12,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.tokens.color.text.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  textMuted: {
    color: Theme.tokens.color.text.secondary,
  },
  achievementDescription: {
    fontSize: 12,
    color: Theme.tokens.color.text.tertiary,
    lineHeight: 16,
  },
  achievementProgress: {
    fontSize: 10,
    color: Theme.tokens.color.accent.primary,
    marginTop: 6,
    fontWeight: '600',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  unlockedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.15)', // Cyan
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)', // Cyan
  },
  unlockedText: {
    fontSize: 10,
    color: Theme.tokens.color.accent.primary,
    fontWeight: '700',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  impactCard: {
    padding: 16,
    borderRadius: 12,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  terminalTitle: {
    fontSize: 10,
    color: Theme.tokens.color.status.ok,
    letterSpacing: 1,
    fontWeight: '700',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  impactText: {
    fontSize: 13,
    color: Theme.tokens.color.text.secondary,
    lineHeight: 22,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  prompt: {
    color: Theme.tokens.color.text.tertiary,
  },
  highlight: {
    color: Theme.tokens.color.text.primary,
    fontWeight: '700',
  },
});
