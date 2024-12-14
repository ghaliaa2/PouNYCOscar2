import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { React, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';

import { signIn, getCurrentUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setform] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setisSubmitting] = useState(false)

  {/* function that submits the form information when the submit button is clicked. */}
  const submit = async () => {
    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setisSubmitting(true);

    try{

      await signIn(form.email, form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/explore')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setisSubmitting(false);
    }
  }

  const checkSession = async () => {
    try {
      // Try to get the current logged-in user
      const user = await getCurrentUser();
      console.log('User is already logged in:', user);
      return user;
    } catch (error) {
      console.error('No active session:', error.message);
      return null;
    }
  }

  const exitSession = async () => {
    try {
      // Check if the user is already logged in
      const currentUser = await checkSession();
      
      // If user is logged in, log them out first
      if (currentUser) {
        await account.deleteSession('current'); // Delete active session
        console.log('User logged out');
      }
  
      // Now you can proceed to create a new session (e.g., login or other actions)
      // You can now safely proceed with the login process or further actions
    } catch (error) {
      console.error('Error during logout or session check:', error.message);
    }
  }

  const goToProfile = async () => {
    router.replace('profile');
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[84vh] px-10 my-6">
          <Image
            source={images.poo_logo}
            resizeMode="contain"
            className="w-[300px] h-[300px]"
          />

          <Text className="text-3xl text-white text-semibold mt-10 font-psemibold">
            Log in to PooNYC
          </Text>
          
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({...form, email: e})}
            otherStyles="mt-7"
            keyboradType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({...form, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

{/* <CustomButton 
            title="Exit Session"
            handlePress={exitSession}
            containerStyles="mt-7"
          />

<CustomButton 
            title="go to profile"
            handlePress={goToProfile}
            containerStyles="mt-7"
          /> */}

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn