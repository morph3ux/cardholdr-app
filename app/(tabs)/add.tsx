import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

// This is a placeholder screen - the add button navigates directly to /add-card
export default function AddScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/add-card');
  }, [router]);

  return <View />;
}

