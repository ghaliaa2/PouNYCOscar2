import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomSwitch from '../../components/CustomSwitch';

import { createBathroom } from '../../lib/appwrite';

const Add = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    bathroomName: '',
    rating: '',
    openHours: '',
    closeHours: '',
    isDisabilityFriendly: false,
    hasChangingStation: false,
    address: '',
    description: '',
    isSaved: false,
  });

  const submit = async () => {
    console.log("Submit button pressed");
    // Validate fields
    if (
      form.bathroomName === '' ||
      form.rating === '' ||
      form.openHours === '' ||
      form.closeHours === '' ||
      form.address === '' ||
      form.description === ''
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    setSubmitting(true); // Set loading state to true
    try {
      const bathroomData = {
        bathroomName: form.bathroomName,
        rating: form.rating,
        openHours: form.openHours,
        closeHours: form.closeHours,
        isDisabilityFriendly: form.isDisabilityFriendly,
        hasChangingStation: form.hasChangingStation,
        address: form.address,
        description: form.description,
        isSaved: form.isSaved
      };

      // Submit to backend
      const result = await createBathroom(bathroomData);
      // Show success message
      Alert.alert("Sussess", "Bathroom added successfully!");
      console.log("New bathroom:", result);

      // Reset the form after success
      setForm({
        bathroomName: "",
        rating: "",
        openHours: "",
        closeHours: "",
        isDisabilityFriendly: false,
        hasChangingStation: false,
        address: "",
        description: "",
        isSaved: false
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false); //Ensure loading state resets
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6">
          {/* Page Title */}
          <Text className="text-3xl text-white text-semibold mb-10 font-psemibold">Add a Bathroom</Text>

          {/* Bathroom Name */}
          <FormField
            title="Bathroom Name"
            value={form.bathroomName}
            handleChangeText={(e) => setForm({ ...form, bathroomName: e })}
            otherStyle="mt-7"
          />

          {/* Rating */}
          <FormField
            title="Rating"
            value={form.rating}
            handleChangeText={(e) => setForm({ ...form, rating: e })}
            otherStyle="mt-7"
          />

          {/* Opening Hours */}
          <FormField
            title="Opening Hours"
            value={form.openHours}
            handleChangeText={(e) => setForm({ ...form, openHours: e })}
            otherStyle="mt-7"
          />

          {/* Closing Hours */}
          <FormField
            title="Closing Hours"
            value={form.closeHours}
            handleChangeText={(e) => setForm({ ...form, closeHours: e })}
            otherStyle="mt-7"
          />

          {/* Address */}
          <FormField
            title="Address"
            value={form.address}
            handleChangeText={(e) => setForm({ ...form, address: e })}
            otherStyle="mt-7"
          />

          {/* Description */}
          <FormField
            title="Description"
            value={form.description}
            handleChangeText={(e) => setForm({ ...form, description: e })}
            otherStyle="mt-7"
          />

          {/* Disability Accommodations */}
          <CustomSwitch
            label="Disability Accommodations"
            value={form.isDisabilityFriendly}
            onValueChange={(value) => setForm({ ...form, isDisabilityFriendly: value })}
            otherStyles="mt-4"
          />

          {/* Diaper Changing Station */}
          <CustomSwitch
            label="Diaper Changing Station"
            value={form.hasChangingStation}
            onValueChange={(value) => setForm({ ...form, hasChangingStation: value })}
            otherStyles="mt-4"
          />

          {/* Save Option */}
          <CustomSwitch
            label="Save to Favorites"
            value={form.isSaved}
            onValueChange={(value) => setForm({ ...form, isSaved: value })}
            otherStyles="mt-4"
          />

          {/* Submit Button */}
          <Button title="Add Bathroom" onPress={submit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Add;
