import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Easing } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Zap, List as ListIcon, User } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [torch, setTorch] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Scanning Animation
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startScan = () => {
      scanAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
            Animated.timing(scanAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.delay(500)
        ])
      ).start();
    };
    startScan();
  }, [scanAnim]);

  // Mock long press for video (UI only for now)
  const handleLongPress = () => {
    setIsRecording(true);
  };

  const handlePressOut = () => {
    setIsRecording(false);
  };

  if (!permission || !locationPermission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted || !locationPermission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={styles.permissionText}>
          ACCESS DENIED. AUTHORIZATION REQUIRED.
        </Text>
        <Button 
          onPress={async () => {
            await requestPermission();
            await requestLocationPermission();
          }} 
          title="GRANT ACCESS" 
          variant="primary"
        />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true 
        });
        
        if (photo) {
          router.push({
            pathname: '/report',
            params: { imageUri: photo.uri }
          });
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleTorch = () => {
    setTorch(current => !current);
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300] // Scan distance approximation
  });

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        enableTorch={torch}
        ref={cameraRef}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Top Controls */}
          <View style={styles.header}>
            <View style={styles.topControlGroup}>
               <BlurView intensity={20} tint="dark" style={styles.controlBlur}>
                  <TouchableOpacity onPress={toggleTorch} style={[styles.iconButton, torch && styles.iconButtonActive]}>
                    <Zap size={24} color={torch ? Theme.tokens.color.accent.primary : Theme.tokens.color.text.primary} fill={torch ? Theme.tokens.color.accent.primary : 'transparent'} />
                  </TouchableOpacity>
               </BlurView>
            </View>
            
            <View style={styles.scanModeContainer}>
                <Text style={styles.scanText}>SCANNING MODE</Text>
            </View>

            <View style={styles.topControlGroup}>
               <BlurView intensity={20} tint="dark" style={styles.controlBlur}>
                  <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                      <Text style={styles.flipText}>FLIP</Text>
                  </TouchableOpacity>
               </BlurView>
            </View>
          </View>

          {/* Minimal Reticle & Scanner */}
          <View style={styles.reticleContainer}>
             <View style={styles.focusRing}>
                 <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
             </View>
             
             {/* Simulated Photon Particles (Static for now) */}
             <View style={[styles.particle, { top: -10, left: 20 }]} />
             <View style={[styles.particle, { bottom: 10, right: 30 }]} />
             <View style={[styles.particle, { top: 40, right: -10 }]} />
          </View>

          {/* Bottom Controls */}
          <View style={styles.footer}>
            <View style={styles.captureRow}>
               <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/feed')} 
                  style={styles.feedButton}
                >
                  <ListIcon size={24} color={Theme.tokens.color.text.primary} />
                  <Text style={styles.feedLabel}>LOGS</Text>
               </TouchableOpacity> 

               <View style={styles.shutterContainer}>
                 <TouchableOpacity 
                    onPress={takePicture}
                    onLongPress={handleLongPress}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                    style={[styles.shutterOuter, isRecording && styles.shutterOuterActive]}
                  >
                   <View style={[styles.shutterInner, isRecording && styles.shutterInnerActive]} />
                 </TouchableOpacity>
               </View>

               <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/profile')} 
                  style={styles.profileButton}
                >
                  <User size={24} color={Theme.tokens.color.text.primary} />
                  <Text style={styles.profileLabel}>ID</Text>
               </TouchableOpacity> 
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.tokens.color.bg[0],
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    ...Theme.tokens.typography.tokens.body_glass,
    color: Theme.tokens.color.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topControlGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  controlBlur: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  scanModeContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scanText: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.accent.primary,
    letterSpacing: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  flipText: {
    color: Theme.tokens.color.text.primary,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  reticleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  focusRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: Theme.tokens.color.accent.primary,
    shadowColor: Theme.tokens.color.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.tokens.color.accent.primary,
    shadowColor: Theme.tokens.color.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  captureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedButton: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  feedLabel: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.primary,
    fontSize: 10,
  },
  profileButton: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  profileLabel: {
    ...Theme.tokens.typography.tokens.label_technical,
    color: Theme.tokens.color.text.primary,
    fontSize: 10,
  },
  shutterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shutterOuterActive: {
    borderColor: Theme.tokens.color.accent.primary,
    backgroundColor: 'rgba(34, 211, 238, 0.1)', // Cyan tint
    transform: [{ scale: 1.1 }],
  },
  shutterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  shutterInnerActive: {
    backgroundColor: Theme.tokens.color.accent.primary,
    width: '60%',
    height: '60%',
    borderRadius: 8, 
  },
});
