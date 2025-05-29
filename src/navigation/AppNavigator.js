import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import RaveScreen from '../screens/RaveScreen';

// Import des styles
import { navigationStyles } from './AppNavigator.styles';

// Icônes simples en emoji
const TabIcon = ({ emoji, focused }) => (
  <Text style={[
    navigationStyles.tabIcon,
    focused && navigationStyles.tabIconFocused
  ]}>
    {emoji}
  </Text>
);

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,           // Pas de header par défaut
          tabBarStyle: navigationStyles.tabBar,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: navigationStyles.tabLabel,
        }}
      >
        {/* Vue Home - Connexion serveur */}
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Connexion',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" focused={focused} />
            ),
          }}
        />

        {/* Vue Record - Enregistrement audio */}
        <Tab.Screen 
          name="Record" 
          component={RecordScreen}
          options={{
            title: 'Enregistrer',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🎤" focused={focused} />
            ),
          }}
        />

        {/* Vue RAVE - Transformation audio */}
        <Tab.Screen 
          name="RAVE" 
          component={RaveScreen}
          options={{
            title: 'Transform',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🎵" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}