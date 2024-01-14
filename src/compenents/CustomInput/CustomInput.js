import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const CustomInput = ({value, onChangeText, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        editable={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
  },
  input: {},
});
export default CustomInput;
