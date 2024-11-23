import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import "../global.css";
import { useFonts } from 'expo-font';

import GlobalProvider from '../context/GlobalProvider';

{/* This prevents the splash screen from auto hiding before asset loading is complete. */}
SplashScreen.preventAutoHideAsync();



const RootLayout = () => {
    {/*Used to load in fonts from assets */}
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
      });

      {/* Used to perform actions while the page/screen is loading, 
        SplashScreen.hideAsync() hides the native splash screen(initial screen with app logo) 
        manually immediately, thus hiding the splash screen when the fonts are loaded. */}
      {/* Syntax: "function(() => {})" is called a call back function */}
      useEffect(() => {
        if (error) throw error;
      
        if (fontsLoaded) {
          SplashScreen.hideAsync();
        }
      }, [fontsLoaded, error]);
      
      if (!fontsLoaded && !error) {
        return null;
      }

  return (
    <GlobalProvider>
      <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          {/* <Stack.Screen name="/search/[query]" options={{headerShown: false}} /> */}
      </Stack>
    </GlobalProvider>
  );
}

export default RootLayout