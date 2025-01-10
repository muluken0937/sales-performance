import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation, userRole }) => {
  const primaryColor = '#0891b2';
  const greyColor = '#737373';

  const icons = {
    index: (props) => <AntDesign name="home" size={26} color={greyColor} {...props} />,
    explore: (props) => <Feather name="compass" size={26} color={greyColor} {...props} />,
    create: (props) => <Ionicons name="create" size={26} color={greyColor} {...props} />,
    CreateCustomer: (props) => <Ionicons name="person-add" size={26} color={greyColor} {...props} />,
    profile: (props) => <AntDesign name="profile" size={26} color={greyColor} {...props} />,
  };

  const filteredRoutes = state.routes.filter((route) => {
    if (userRole === "SalesUser" && route.name === "create") return false; 
    if (userRole === "SalesUser" && route.name === "CreateCustomer") return false; 
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

        return (
          <TouchableOpacity
            accessibilityRole="button"
            key={route.name}
            style={styles.tabbarItem}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name]({
              color: isFocused ? primaryColor : greyColor
            })}
            <Text style={{ color: isFocused ? primaryColor : greyColor, fontSize: 11 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 2,
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBar;