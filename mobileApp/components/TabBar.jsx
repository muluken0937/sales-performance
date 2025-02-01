import { View, StyleSheet, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import TabBarButton from './TabBarButton';

const TabBar = ({ state, descriptors, navigation, userRole }) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const primaryColor = '#0891b2';
  const greyColor = '#737373';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  const filteredRoutes = state.routes.filter((route) => 
    !(route.name === "create" && userRole === "SalesUser")
  );

  return (
    <View style={styles.tabbar}>
      {filteredRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton 
            key={route.name}
            onPress={onPress}
            routeName={route.name}
            isFocused={isFocused}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TabBar;