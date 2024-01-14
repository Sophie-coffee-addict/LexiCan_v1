//SignUpScreen.js
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';

import CustomInput from '../../compenents/CustomInput';
import CustomButton from '../../compenents/CustomButton';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const SignUpScreen = () => {
  const onSignUpPress = () => {
    if (password !== passwordRepeat) {
      Alert.alert('Password inconsistent');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Account created successfully. Please sign in. ');
        navigation.navigate('SignIn');
      })
      .catch(err => {
        Alert.alert(err.nativeErrorMessage);
      });
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const navigation = useNavigation();

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        {/* value, onChangeText */}

        <CustomInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
        />

        <CustomInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          secureTextEntry={true}
        />

        <CustomInput
          placeholder="Repeat Password"
          value={passwordRepeat}
          onChangeText={text => setPasswordRepeat(text)}
          secureTextEntry={true}
        />

        <CustomButton
          text="Register and sign in"
          onPress={onSignUpPress}
          type="PRIMARY"
        />

        <CustomButton
          text="Have an account? Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 40,
  },
  logo: {
    width: '60%',
    maxWidth: 300,
    maxHeight: 200,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C16',
    margin: 10,
  },
});

export default SignUpScreen;
