import { Tabs } from "expo-router";
import { Camera, List, User } from "lucide-react-native";
import React from "react";
import { Theme } from "@/constants/theme";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.tokens.color.accent.primary,
        tabBarInactiveTintColor: Theme.tokens.color.text.tertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Theme.tokens.color.bg[0],
          borderTopColor: Theme.tokens.color.border.default,
          height: Platform.select({ ios: 88, android: 68, default: 60 }),
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: 28, android: 12, default: 12 }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          fontFamily: Theme.tokens.typography.fontFamily.mono,
          marginTop: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "SCAN",
          tabBarIcon: ({ color, size }) => <Camera color={color} size={24} />,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "LOGS",
          tabBarIcon: ({ color, size }) => <List color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "STATUS",
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
