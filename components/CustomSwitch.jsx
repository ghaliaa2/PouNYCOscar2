import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const CustomSwitch = ({ value, onValueChange, label, otherStyles }) => {
  return (
    <View className={`flex-row justify-between items-center mb-4 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{label}</Text>
      <TouchableOpacity
        onPress={() => onValueChange(!value)}
        className={`w-12 h-6 rounded-full p-1 ${value ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <View
          className={`w-4 h-4 rounded-full bg-white ${value ? 'ml-6' : ''}`}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSwitch;
