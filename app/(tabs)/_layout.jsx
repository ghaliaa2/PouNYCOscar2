import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router';

{/* Script for importing and exporting all icon images used. */}
import { icons } from '../../constants';

{/* The bottom navigation bar */}

{/* TabIcon is a react functional component that returns a image representing the icon of the bottom nav bar. */ }
const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center w-16">
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6 mb-1"
            />
            <Text 
                className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#4C6444',
                tabBarInactiveTintColor: '#8A6240',
                tabBarStyle:{
                    backgroundColor: '#CABA9C',
                    borderTopWidth: 1,
                    borderTopColor: '#CABA9C',
                    height: 64,
                    paddingTop: 12,
                }
            }}
        >
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Explore"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.bookmark}
                            color={color}
                            name="Saved"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.plus}
                            color={color}
                            name="Add"
                            focused={focused}
                        />
                    )
                }}
            />
            {/* Uncomment to keep, omited due to time complexities */}
            {/*
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />
                    )
                }}
            />
            */}
        </Tabs>
    </>
  )
}

export default TabsLayout