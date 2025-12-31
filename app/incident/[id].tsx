import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/contexts/AppContext';
import { CATEGORY_CONFIG } from '@/constants/categories';

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reports } = useApp();
  const report = reports.find(r => r.id === id);

  const [isBacking, setIsBacking] = useState(false);
  const [hasBacked, setHasBacked] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Incident not found.</Text>
      </View>
    );
  }

  const category = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG['other'];

  // Interaction: Long-press 'Back This'
  const handlePressIn = () => {
    if (hasBacked) return;
    setIsBacking(true);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 1500, // 1.5s hold to confirm
      useNativeDriver: false, // width/backgroundColor changes
    }).start(({ finished }) => {
      if (finished) {
        setHasBacked(true);
        // Haptic feedback would go here
      }
    });
  };

  const handlePressOut = () => {
    if (hasBacked) return;
    setIsBacking(false);
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const buttonColor = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.tokens.color.surface.card, Theme.tokens.color.status.ok]
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Image 
        source={{ uri: report.imageUri }} 
        style={[StyleSheet.absoluteFillObject, { opacity: 0.3 }]}
        blurRadius={20}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Button 
            variant="glass" 
            size="sm" 
            icon={<ArrowLeft size={20} color={Theme.tokens.color.text.primary} />} 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>INCIDENT DETAILS</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card variant="glass" depth={2} style={styles.mainCard}>
            <Image 
                source={{ uri: report.imageUri }} 
                style={styles.heroImage}
                resizeMode="cover"
            />
            
            <View style={styles.cardBody}>
                <View style={styles.metaRow}>
                    <Badge label={category.label} variant="accent" />
                    <Badge label={report.status.toUpperCase()} variant={report.status === 'resolved' ? 'success' : 'glass'} />
                </View>

                <Text style={styles.description}>{report.description}</Text>

                <View style={styles.divider} />

                <View style={styles.dataGrid}>
                    <View style={styles.dataItem}>
                        <Text style={styles.dataLabel}>SEVERITY</Text>
                        <View style={styles.severityBar}>
                            <View style={[styles.severityFill, { width: '75%', backgroundColor: Theme.tokens.color.status.warn }]} />
                        </View>
                    </View>
                    <View style={styles.dataItem}>
                        <Text style={styles.dataLabel}>IMPACT YIELD</Text>
                        <Text style={styles.dataValue}>+{report.points} PTS</Text>
                    </View>
                </View>

                <View style={styles.locationSection}>
                     <View style={styles.locationRow}>
                        <MapPin size={16} color={Theme.tokens.color.accent.primary} />
                        <Text style={styles.locationText}>{report.location.address || "Unknown Location"}</Text>
                     </View>
                     <View style={styles.mapPlaceholder}>
                        <Text style={styles.mapText}>GEOSPATIAL DATA VISUALIZATION</Text>
                        <Text style={styles.latLong}>
                            {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                        </Text>
                     </View>
                </View>
            </View>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
            <Text style={styles.footerHint}>
                {hasBacked ? "VERIFICATION COMPLETE" : "LONG PRESS TO VERIFY"}
            </Text>
            
            <View style={styles.actionContainer}>
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.backingButtonWrapper}
                    disabled={hasBacked}
                >
                    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: Theme.tokens.color.surface.card, borderRadius: Theme.tokens.radius.pill }]} />
                    
                    <Animated.View 
                        style={[
                            StyleSheet.absoluteFill, 
                            { 
                                backgroundColor: Theme.tokens.color.accent.primary, 
                                width: fillWidth,
                                borderRadius: Theme.tokens.radius.pill
                            }
                        ]} 
                    />
                    
                    <View style={styles.buttonContent}>
                        {hasBacked ? (
                            <ShieldCheck size={24} color="#fff" />
                        ) : (
                            <ShieldCheck size={24} color={Theme.tokens.color.text.secondary} />
                        )}
                        <Text style={[styles.buttonText, hasBacked && { color: '#fff' }]}>
                            {hasBacked ? "COMMUNITY BACKED" : "BACK THIS REPORT"}
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
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
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.primary,
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  mainCard: {
    padding: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#333',
  },
  cardBody: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  description: {
    ...Theme.tokens.typography.tokens.body_glass,
    color: Theme.tokens.color.text.primary,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.tokens.color.border.default,
    marginBottom: 24,
  },
  dataGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  dataItem: {
    flex: 1,
  },
  dataLabel: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.tertiary,
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.tokens.color.text.primary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  severityBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  severityFill: {
    height: '100%',
    borderRadius: 3,
  },
  locationSection: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationText: {
    color: Theme.tokens.color.text.primary,
    fontSize: 14,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    flex: 1,
  },
  mapPlaceholder: {
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mapText: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.tertiary,
    marginBottom: 4,
  },
  latLong: {
    fontSize: 10,
    color: Theme.tokens.color.text.secondary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(3,3,4,0.8)',
    borderTopWidth: 1,
    borderTopColor: Theme.tokens.color.border.default,
  },
  footerHint: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.tertiary,
    textAlign: 'center',
    marginBottom: 12,
  },
  actionContainer: {
    width: '100%',
  },
  backingButtonWrapper: {
    height: 56,
    borderRadius: Theme.tokens.radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.accent,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 12,
  },
  buttonText: {
    ...Theme.tokens.typography.tokens.label_technical,
    fontSize: 14,
    color: Theme.tokens.color.text.primary,
    fontWeight: '700',
  },
});
