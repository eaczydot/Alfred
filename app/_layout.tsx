// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { StatusBar } from "expo-status-bar";
import { Theme } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "BACK",
      headerStyle: {
        backgroundColor: Theme.tokens.color.bg[0],
      },
      headerTintColor: Theme.tokens.color.text.primary,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: Theme.tokens.typography.fontFamily.ui,
      },
      contentStyle: {
        backgroundColor: Theme.tokens.color.bg[0],
      }
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="report" 
        options={{ 
          presentation: "modal",
          title: "TRANSMISSION",
          headerBackTitle: "ABORT",
          headerStyle: {
            backgroundColor: Theme.tokens.color.bg[0],
          },
          headerTintColor: Theme.tokens.color.text.primary,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Theme.tokens.color.bg[0] }}>
          <StatusBar style="light" />
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AppProvider>
    </QueryClientProvider>
  );
}
