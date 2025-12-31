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
              <Text style={styles.emptyTitle}>NO SIGNAL</Text>
              <Text style={styles.emptyText}>
                Local grid silent. Initiate patrol.
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
                                <Badge label={`+${report.points}`} variant="glass" style={styles.gridBadge} />
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
    backgroundColor: 'rgba(3, 3, 4, 0.8)', // Obsidian void with some transparency
    zIndex: 10,
    ...Platform.select({
        web: {
            backdropFilter: 'blur(10px)',
        }
    })
  },
  kicker: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.tertiary,
    marginBottom: 4,
  },
  headerTitle: {
    ...Theme.tokens.typography.tokens.heading_lens,
    color: Theme.tokens.color.text.primary,
    letterSpacing: -0.5,
    fontSize: 24, // Override for header size
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255, 159, 10, 0.1)', // Amber/Warning base
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.tokens.radius.sm,
    borderWidth: 1,
    borderColor: Theme.tokens.color.status.warn,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.tokens.color.status.warn,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  viewToggle: {
    padding: 8,
    borderRadius: Theme.tokens.radius.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
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
    ...Theme.tokens.typography.tokens.display_impact,
    fontSize: 24, // Scaled down
    color: Theme.tokens.color.text.secondary,
    marginBottom: 8,
  },
  emptyText: {
    ...Theme.tokens.typography.tokens.body_glass,
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
    borderRadius: Theme.tokens.radius.md,
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
    // handled by badge component
  },
  reportCard: {
    marginBottom: 16,
  },
});
