import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';

import { Colors } from '@/constants/theme';
import { LanguageProvider } from '@/hooks/use-language';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// CardHoldr dark theme matching brand colors
const CardHoldrTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.coral,
    background: Colors.charcoal,
    card: Colors.surface,
    text: Colors.foreground,
    border: Colors.border,
    notification: Colors.coral,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LanguageProvider>
      <ThemeProvider value={CardHoldrTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.charcoal,
            },
            headerTintColor: Colors.coral,
            headerTitleStyle: {
              fontFamily: 'Outfit_600SemiBold',
            },
            contentStyle: {
              backgroundColor: Colors.charcoal,
            },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="card/[id]"
            options={{
              presentation: 'card',
              title: '',
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="add-card"
            options={{
              presentation: 'modal',
              title: 'Add Card',
            }}
          />
          <Stack.Screen
            name="edit-card/[id]"
            options={{
              presentation: 'modal',
              title: 'Edit Card',
            }}
          />
          <Stack.Screen
            name="scan"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </LanguageProvider>
  );
}
