import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import TabBarButton from './TabBarButton';

const TabBar = ({ state, descriptors, navigation, userRole }) => {
  const primaryColor = '#0891b2';
  const greyColor = '#737373';

  

  const filteredRoutes = state.routes.filter((route) => {
    if (route.name === "create" && userRole === "SalesUser") {
      return false; 
    }
    return true; 
  });

  

  return (
    <View style={styles.tabbar}>
      {filteredRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return(
          <TabBarButton 
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            routeName={route.name}
            isFocused={isFocused}
            color={isFocused? primaryColor: greyColor}
            label={label}

          />
        )

      
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginHorizontal: 0,
    paddingVertical: 8,
    padding: 3,

    // borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  
});

export default TabBar;