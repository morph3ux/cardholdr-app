import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { HapticTab } from '@/components/haptic-tab';
import { Colors, ComponentSize, BorderRadius, Spacing } from '@/constants/theme';
import { useLanguage } from '@/hooks/use-language';

function AddButton() {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-card');
  };

  return (
    <Pressable style={styles.addButton} onPress={handlePress}>
      <View style={styles.addButtonInner}>
        <Ionicons name="add" size={24} color={Colors.charcoal} />
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.coral,
        tabBarInactiveTintColor: Colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.cards'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={ComponentSize.iconNav}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => <AddButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={ComponentSize.iconNav}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: ComponentSize.tabBarHeight,
  },
  tabBarLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
  },
  addButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonInner: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
