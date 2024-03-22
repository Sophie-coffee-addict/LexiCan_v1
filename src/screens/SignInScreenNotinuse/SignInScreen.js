//SignInScreen.js
import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Logo from '../../../assets/images/1024.png';
import CustomInput from '../../compenents/CustomInput';
import CustomButton from '../../compenents/CustomButton';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';

const SignInScreen = () => {
  const signInWithEmailandPassword = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        // Alert.alert('Sign in succeeded');
        navigation.navigate('SearchScreen');
      })
      .catch(err => {
        console.log(err);
        Alert.alert(err.nativeErrorMessage);
      });
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  // const onSignInPressed = () => {
  //   //validate user first
  //   navigation.navigate('SearchScreen');
  // };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />
        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />

        <CustomButton
          text="Sign In"
          onPress={signInWithEmailandPassword}
          type="PRIMARY"
        />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 60,
  },
  logo: {
    width: '60%',
    maxWidth: 300,
    maxHeight: 200,
    borderRadius: 25,
  },
});

export default SignInScreen;
