import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid, List as ListIcon } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Theme } from '@/constants/theme';
import { IncidentCard } from '@/components/IncidentCard';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export default function FeedScreen() {
  const { reports, stats } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>NEIGHBORHOOD WATCH</Text>
            <Text style={styles.headerTitle}>Incident Feed</Text>
          </View>
          <View style={styles.headerRight}>
             <View style={styles.pointsBadge}>
               <Text style={styles.pointsText}>{stats.totalPoints} PTS</Text>
             </View>
             <TouchableOpacity 
                style={styles.viewToggle}
                onPress={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
             >
                {viewMode === 'list' ? 
                  <Grid size={20} color={Theme.tokens.color.text.secondary} /> : 
                  <ListIcon size={20} color={Theme.tokens.color.text.secondary} />
                }
             </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NO DATA</Text>
              <Text style={styles.emptyText}>
                System waiting for input.
              </Text>
            </View>
          ) : (
             <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
              {reports.map((report) => {
                if (viewMode === 'grid') {
                    return (
                        <TouchableOpacity 
                            key={report.id}
                            style={styles.gridItem}
                            activeOpacity={0.7}
                        >
                            <Image 
                                source={{ uri: report.imageUri }} 
                                style={styles.gridImage}
                                resizeMode="cover"
                            />
                            <View style={styles.gridOverlay}>
                                <Badge label={`+${report.points}`} variant="accent" style={styles.gridBadge} />
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                  <IncidentCard 
                    key={report.id} 
                    report={report}
                    style={styles.reportCard}
                  />
                );
              })}
            </View>
          )}
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
    backgroundColor: Theme.tokens.color.bg[0],
    zIndex: 10,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255, 159, 10, 0.1)', // Amber
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 10, 0.2)', // Amber
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.tokens.color.accent.info,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Theme.tokens.color.surface.card,
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.tokens.color.text.secondary,
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: 14,
    color: Theme.tokens.color.text.tertiary,
    textAlign: 'center',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  listContainer: {
    gap: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: (Dimensions.get('window').width - 42) / 2,
    height: (Dimensions.get('window').width - 42) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Theme.tokens.color.surface.card,
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  gridBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(4px)',
      }
    }),
  },
  reportCard: {
    marginBottom: 16,
  },
});
