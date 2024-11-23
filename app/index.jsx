import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from "../constants";
import CustomButton from '../components/CustomButton';

import { useGlobalContext } from '../context/GlobalProvider';

export default function App(){
  const { isLoading, isLoggedIn } = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href='/explore'/>

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStype={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image 
            source={images.poo_logo}
            className="w-[360px] h-[360px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover all the bathrooms NYC has to offer with {' '}
              <Text className="text-secondary-200">
              PooNYC
            </Text>
            </Text>

            <Image
              source={images.path}
              className="w-[164px] h-[17px] absolute-bottom-2 -right-20"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-white mt-7 text-center">
            Where minimalism meets innovation: embark on a journey without worries of nature calling.
          </Text>

          {/* A custom button, things within are the props that we are passing back to the component to render with. Once pressed, brings user to sign in screen. */}
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      {/* since our app is in dark mode, it also darkens status bar(the information bar at the top of phone screen), this allows you to see the status bar. */ }
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}
