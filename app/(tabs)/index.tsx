import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Zap, List as ListIcon, User } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import * as Location from 'expo-location';



export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [torch, setTorch] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);

  // Mock long press for video (UI only for now)
  const handleLongPress = () => {
    setIsRecording(true);
    // In a real app, start recording here
  };

  const handlePressOut = () => {
    setIsRecording(false);
    // In a real app, stop recording here
    // For now, treat as tap if it was short, or just stop recording UI
  };

  if (!permission || !locationPermission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted || !locationPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera and location to report issues.
        </Text>
        <Button 
          onPress={async () => {
            await requestPermission();
            await requestLocationPermission();
          }} 
          title="Grant Permissions" 
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
          skipProcessing: true // Faster capture
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
              <TouchableOpacity onPress={toggleTorch} style={[styles.iconButton, torch && styles.iconButtonActive]}>
                <Zap size={24} color={torch ? Theme.tokens.color.accent.primary : Theme.tokens.color.text.primary} fill={torch ? Theme.tokens.color.accent.primary : 'transparent'} />
              </TouchableOpacity>
            </View>
            
            {/* Contextual Guidance Chip - Conditional */}
            {/* <View style={styles.guidanceChip}>
              <Text style={styles.guidanceText}>Low Light • Try Flash</Text>
            </View> */}

            <View style={styles.topControlGroup}>
              <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                  <Text style={styles.flipText}>FLIP</Text>
               </TouchableOpacity>
            </View>
          </View>

          {/* Minimal Reticle */}
          <View style={styles.reticleContainer}>
             <View style={styles.focusRing} />
          </View>

          {/* Bottom Controls */}
          <View style={styles.footer}>
            <View style={styles.captureRow}>
               <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/feed')} 
                  style={styles.feedButton}
                >
                  <ListIcon size={24} color={Theme.tokens.color.text.primary} />
                  <Text style={styles.feedLabel}>Feed</Text>
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
                  <Text style={styles.profileLabel}>Profile</Text>
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
    color: Theme.tokens.color.text.primary,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topControlGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  guidanceChip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.tokens.radius.pill,
  },
  guidanceText: {
    color: Theme.tokens.color.text.primary,
    fontSize: 12,
    fontFamily: Theme.tokens.typography.fontFamily.ui,
    fontWeight: '600',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
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
    color: Theme.tokens.color.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  profileButton: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  profileLabel: {
    color: Theme.tokens.color.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  shutterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: Theme.tokens.color.text.primary,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shutterOuterActive: {
    borderColor: Theme.tokens.color.status.urgent, // Red for recording
    transform: [{ scale: 1.1 }],
  },
  shutterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: Theme.tokens.color.text.primary,
  },
  shutterInnerActive: {
    backgroundColor: Theme.tokens.color.status.urgent,
    width: '50%',
    height: '50%',
    borderRadius: 8, // Square for stop
  },
});
