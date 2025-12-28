import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { CameraView } from 'expo-camera';
import { useMutation } from '@tanstack/react-query';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';

import { useApp } from '@/contexts/AppContext';
import { Report, IssueCategory } from '@/types';
import { CATEGORY_CONFIG } from '@/constants/categories';

// Schema for AI analysis
const AnalysisSchema = z.object({
  category: z.enum([
    'graffiti', 'pothole', 'encampment', 'drug_use', 'trash',
    'broken_streetlight', 'abandoned_vehicle', 'other'
  ]),
  description: z.string(),
});

// Function to convert image URI to base64
const imageToBase64 = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const useQuickSubmit = () => {
  const router = useRouter();
  const { addReport, showToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const analyzeAndReportMutation = useMutation({
    mutationFn: async ({ imageUri }: { imageUri: string }) => {
      setIsSubmitting(true);

      // 1. Get location
      const loc = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync(loc.coords);
      const addr = addresses[0];
      const address = addr ? `${addr.street || ''}, ${addr.city || ''}`.trim() : 'Unknown location';
      const location = { ...loc.coords, address };

      // 2. Analyze image with AI
      const base64 = await imageToBase64(imageUri);
      const analysis = await generateObject({
        messages: [{
          role: 'user',
          content: [
            { type: 'image', image: base64 },
            { type: 'text', text: 'Analyze this image and identify the type of civic issue. Provide a brief 2-3 sentence description.' }
          ]
        }],
        schema: AnalysisSchema,
      });

      // 3. Create report object
      const categoryConfig = CATEGORY_CONFIG[analysis.category];
      const report: Report = {
        id: Date.now().toString(),
        category: analysis.category,
        imageUri,
        description: analysis.description || `${categoryConfig.label} issue reported`,
        location,
        timestamp: Date.now(),
        points: categoryConfig.points,
        status: 'submitted',
      };

      return report;
    },
    onSuccess: (report) => {
      addReport(report);
      showToast(`Report submitted! +${report.points} points`);
      router.push('/(tabs)/feed');
    },
    onError: (error) => {
      console.error("Quick Submit Error:", error);
      Alert.alert("Submission Failed", "Could not analyze and submit the report. Please try again.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleQuickSubmit = async (cameraRef: React.RefObject<CameraView>) => {
    if (!cameraRef.current || isSubmitting) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (photo) {
        analyzeAndReportMutation.mutate({ imageUri: photo.uri });
      }
    } catch (error) {
      console.error("Failed to take picture:", error);
      Alert.alert("Capture Failed", "Could not take a picture. Please check permissions and try again.");
    }
  };

  return {
    isSubmitting,
    handleQuickSubmit,
  };
};
