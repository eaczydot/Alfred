import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Report } from '@/types';
import { CATEGORY_CONFIG } from '@/constants/categories';

interface IncidentCardProps {
  report: Report;
  style?: ViewStyle;
}

export function IncidentCard({ report, style }: IncidentCardProps) {
  const category = CATEGORY_CONFIG[report.category];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card 
      variant="glass"
      depth={1}
      style={[styles.reportCard, style]}
    >
      <View style={styles.cardHeader}>
           <View style={styles.userRow}>
               <View style={styles.avatarPlaceholder} />
               <Text style={styles.username}>CITIZEN {report.id.slice(-4)}</Text>
           </View>
           <Text style={styles.timeText}>{formatDate(report.timestamp)}</Text>
      </View>

      <Image 
        source={{ uri: report.imageUri }} 
        style={styles.reportImage}
        resizeMode="cover"
      />

      <View style={styles.reportContent}>
        <View style={styles.tagRow}>
           <Badge label={category.label} variant="glass" />
           <Badge label={`+${report.points} Impact`} variant="accent" />
        </View>
        
        {report.description ? (
          <Text style={styles.reportDescription} numberOfLines={2}>
              {report.description}
          </Text>
        ) : null}

        {report.location.address && (
          <View style={styles.locationContainer}>
            <MapPin size={12} color={Theme.tokens.color.text.tertiary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {report.location.address}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  reportCard: {
    padding: 0, 
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.tokens.color.border.glass,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.tokens.color.accent.primary,
    opacity: 0.8,
  },
  username: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.primary,
  },
  timeText: {
    fontSize: 11,
    color: Theme.tokens.color.text.tertiary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  reportImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#2D2D30',
  },
  reportContent: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reportDescription: {
    ...Theme.tokens.typography.tokens.body_glass,
    color: Theme.tokens.color.text.primary,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 11,
    color: Theme.tokens.color.text.tertiary,
    flex: 1,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
});
