import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Send } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useApp } from '@/contexts/AppContext';
import { IssueCategory, Report } from '@/types';
import { CATEGORY_CONFIG } from '@/constants/categories';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ReportScreen() {
  const params = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const { addReport } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const analyzeImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const base64 = await fetch(imageUri)
        .then(res => res.blob())
        .then(blob => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        }));

      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: base64
              },
              {
                type: 'text',
                text: `Analyze this image and identify what type of civic issue it shows. Choose the most appropriate category:
- graffiti: Vandalism and graffiti
- pothole: Road damage and potholes
- encampment: Homeless encampments
- drug_use: Public drug use or paraphernalia
- trash: Illegal dumping or excessive litter
- broken_streetlight: Broken or non-functioning street lights
- abandoned_vehicle: Abandoned or illegally parked vehicles
- other: Other civic issues

Also provide a brief description of what you see (2-3 sentences).`
              }
            ]
          }
        ],
        schema: z.object({
          category: z.enum([
            'graffiti',
            'pothole',
            'encampment',
            'drug_use',
            'trash',
            'broken_streetlight',
            'abandoned_vehicle',
            'other'
          ]),
          description: z.string(),
        })
      });

      return result;
    },
    onSuccess: (result) => {
      setSelectedCategory(result.category);
      setDescription(result.description);
    },
    onError: (error) => {
      console.error('Error analyzing image:', error);
    }
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        if (Platform.OS === 'web') {
          setLocation({
            latitude: 37.7749,
            longitude: -122.4194,
            address: 'San Francisco, CA'
          });
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation({
            latitude: 37.7749,
            longitude: -122.4194,
            address: 'Location permission denied'
          });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const addresses = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const addr = addresses[0];
        const address = addr ? 
          `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim() : 
          'Unknown location';

        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          address
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setLocation({
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'Location unavailable'
        });
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (params.imageUri) {
      analyzeImageMutation.mutate(params.imageUri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.imageUri]);

  const submitReport = () => {
    if (!selectedCategory || !location || !params.imageUri) {
      Alert.alert('Error', 'Please select a category and ensure location is available');
      return;
    }

    const categoryConfig = CATEGORY_CONFIG[selectedCategory];
    const points = categoryConfig.points;
    
    const report: Report = {
      id: Date.now().toString(),
      category: selectedCategory,
      imageUri: params.imageUri,
      description: description || `${categoryConfig.label} issue reported`,
      location,
      timestamp: Date.now(),
      points: points,
      status: 'submitted'
    };

    addReport(report);
    setEarnedPoints(points);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <View style={styles.successContent}>
          <View style={styles.successIconContainer}>
             <Badge label="TRANSMISSION COMPLETE" variant="accent" style={{ marginBottom: 20, alignSelf: 'center' }} />
             <Text style={styles.pointsLarge}>+{earnedPoints}</Text>
             <Text style={styles.pointsLabel}>IMPACT POINTS RECORDED</Text>
          </View>
          
          <Card variant="glass" style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>STATUS</Text>
              <Text style={styles.statValue}>VERIFIED</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>UPLOAD</Text>
              <Text style={styles.statValue}>100%</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>SYNC</Text>
              <Text style={styles.statValue}>COMPLETE</Text>
            </View>
          </Card>

          <Button 
            title="RETURN TO BASE"
            onPress={() => router.replace('/(tabs)/feed')}
            variant="primary"
            style={{ width: '100%', marginTop: 40 }}
          />
        </View>
      </View>
    );
  }

  if (!params.imageUri) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>NO SIGNAL DETECTED</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
            <Image 
            source={{ uri: params.imageUri }} 
            style={styles.image}
            resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
                <View style={styles.hudChip}>
                    <View style={[styles.indicator, { backgroundColor: analyzeImageMutation.isPending ? Theme.tokens.color.status.warn : Theme.tokens.color.status.ok }]} />
                    <Text style={styles.hudText}>{analyzeImageMutation.isPending ? "ANALYZING TARGET..." : "TARGET ACQUIRED"}</Text>
                </View>
            </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.kicker}>{'// INCIDENT REPORT'}</Text>
          <Text style={styles.headerTitle}>New Entry</Text>
          
          <Card variant="glass" style={styles.sectionCard}>
             <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CLASSIFICATION</Text>
                {analyzeImageMutation.isPending && <ActivityIndicator size="small" color={Theme.tokens.color.accent.primary} />}
             </View>

             <View style={styles.categoriesGrid}>
              {(Object.keys(CATEGORY_CONFIG) as IssueCategory[]).map((category) => {
                const config = CATEGORY_CONFIG[category];
                const isSelected = selectedCategory === category;
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                        {config.label}
                    </Text>
                    {isSelected && <Badge label={`+${config.points}`} variant="accent" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card variant="glass" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>OBSERVATIONS</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="// Enter detailed description..."
              placeholderTextColor={Theme.tokens.color.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Card>

          <Card variant="glass" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>COORDINATES</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color={Theme.tokens.color.accent.info} />
              <Text style={styles.locationText}>
                {location?.address || 'TRIANGULATING...'}
              </Text>
            </View>
            {location && (
                <Text style={styles.latLong}>
                    LAT: {location.latitude.toFixed(6)} • LONG: {location.longitude.toFixed(6)}
                </Text>
            )}
          </Card>

          <View style={styles.actionContainer}>
            <Button 
                title="INITIATE UPLOAD" 
                variant={(!selectedCategory || !location) ? 'secondary' : 'primary'}
                onPress={submitReport}
                disabled={!selectedCategory || !location}
                style={styles.submitButton}
                icon={<Send size={16} color={(!selectedCategory || !location) ? Theme.tokens.color.text.secondary : "#fff"} />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.tokens.color.bg[0],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Theme.tokens.color.border.default,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  hudChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderColor: Theme.tokens.color.border.default,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      }
    }),
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hudText: {
    color: Theme.tokens.color.text.primary,
    fontSize: 10,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Theme.tokens.color.text.tertiary,
    marginBottom: 8,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '400', // Thin/modern feel
    color: Theme.tokens.color.text.primary,
    marginBottom: 24,
    fontFamily: Theme.tokens.typography.fontFamily.ui,
  },
  sectionCard: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.tokens.color.text.secondary,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)', // Cyan
    borderColor: Theme.tokens.color.accent.primary,
  },
  categoryLabel: {
    fontSize: 13,
    color: Theme.tokens.color.text.secondary,
  },
  categoryLabelSelected: {
    color: Theme.tokens.color.text.primary,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Theme.tokens.color.text.primary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Theme.tokens.color.border.default,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: Theme.tokens.color.text.primary,
    flex: 1,
  },
  latLong: {
    fontSize: 10,
    color: Theme.tokens.color.text.tertiary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    marginLeft: 26,
  },
  actionContainer: {
    marginTop: 10,
  },
  submitButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.tokens.color.bg[0],
  },
  errorText: {
    fontSize: 14,
    color: Theme.tokens.color.text.tertiary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    letterSpacing: 2,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pointsLarge: {
    fontSize: 64,
    fontWeight: '700',
    color: Theme.tokens.color.accent.primary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    letterSpacing: -2,
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: Theme.tokens.color.text.secondary,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    letterSpacing: 2,
  },
  statsCard: {
    width: '100%',
    padding: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 4,
  },
  statLabel: {
    color: Theme.tokens.color.text.tertiary,
    fontSize: 12,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  statValue: {
    color: Theme.tokens.color.text.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
    letterSpacing: 1,
  },
});
