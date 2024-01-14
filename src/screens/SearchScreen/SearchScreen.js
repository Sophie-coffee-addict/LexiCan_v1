/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {useCallback} from 'react';

const SearchScreen = () => {
  const [newWord, setNewWord] = useState('');
  const [checkedWord, setCheckedWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [meanings, setMeanings] = useState([]);
  const [collectedWords, setCollectedWords] = useState([]);

  const route = useRoute();
  const initialWord = route.params?.initialWord;
  console.log(route.params);
  const navigation = useNavigation();

  const searchWord = enteredWord => {
    setNewWord(enteredWord);
  };

  const getInfo = useCallback(() => {
    if (!newWord.trim()) {
      Alert.alert('Type a word first.');
      return;
    }
    var url =
      'https://api.dictionaryapi.dev/api/v2/entries/en/' +
      newWord +
      '?key=a64838ce-5ab0-41f6-970d-4124ca33f46c';

    return fetch(url)
      .then(data => {
        return data.json();
      })
      .then(response => {
        if (response && response.length > 0) {
          var word = response[0].word;
          setCheckedWord(word);

          var meanings = response[0].meanings || [];
          setMeanings(meanings);

          var def = meanings[0]?.definitions[0]?.definition || '';
          setDefinition(def);

          var eg = meanings[0]?.definitions[0]?.example || '';
          setExample(eg);
        } else {
          // 处理没有返回结果的情况
          Alert.alert('Word not found. Check your spelling.');
          // console.error('No data received from the API.');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setCollectedWords(
          prevWords => new Set([...prevWords, checkedWord.toLowerCase()]),
        );
      });
  }, [newWord, checkedWord]);

  useEffect(() => {
    if (initialWord) {
      setNewWord(initialWord);
      getInfo();
    }
  }, [initialWord, getInfo]);

  const clear = () => {
    setCheckedWord('');
    setMeanings([]);
    setDefinition('');
    setExample('');
    setNewWord('');
  };

  useEffect(() => {
    // 在 collectedWords 发生变化时存储到 AsyncStorage
    const storeCollectedWords = async () => {
      try {
        await AsyncStorage.setItem(
          'collectedWords',
          JSON.stringify([...collectedWords]),
        );
      } catch (error) {
        console.error('Error storing collected words:', error);
      }
    };

    storeCollectedWords();
  }, [collectedWords]);

  const collect = async () => {
    try {
      // 检查 newWord 是否为空
      if (!newWord.trim()) {
        Alert.alert('No word to be collected.');
        return;
      }
      const lowercaseWord = newWord.toLowerCase();

      if (collectedWords.includes(lowercaseWord)) {
        // 如果单词已存在，提示用户重复收藏
        Alert.alert(`The word "${newWord}" has been collected before.`);
      } else {
        // 更新 newWord 的值
        setNewWord('');

        setCollectedWords(prevWords => {
          const updatedWords = [...prevWords, lowercaseWord];

          // 将更新后的单词列表存储到 AsyncStorage
          AsyncStorage.setItem(
            'collectedWords',
            JSON.stringify(updatedWords),
            error => {
              if (error) {
                console.error('Error storing collected words:', error);
              } else {
                // 输出当前收藏的单词列表
                console.log('Collected Words updated:', updatedWords);
              }
            },
          );

          // 返回更新后的单词列表
          return updatedWords;
        });
        // 等待 AsyncStorage 更新
        await AsyncStorage.getItem('collectedWords');
        Alert.alert(`Word "${newWord}" has been collected successfully!`);
      }
    } catch (error) {
      // 处理错误，例如提示用户收藏失败
      console.error('Error collecting word:', error);
    }
  };

  const onMyWordsPress = () => {
    navigation.navigate('MyWords');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Search for a Word</Text>

        <View style={{flex: 0.8}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={styles.inputBox}
              placeholder="Type your word"
              value={newWord}
              autoCapitalize="none"
              // textAlign="center"
              onChangeText={searchWord}
              clearButtonMode="always"
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <TouchableOpacity
              style={styles.buttonDesign}
              onPress={() => {
                getInfo();
              }}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDesign}
              onPress={() => {
                clear();
              }}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDesign}
              onPress={() => {
                onMyWordsPress();
              }}>
              <Text style={styles.buttonText}>My words</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.textDesign}>Entered Word: {checkedWord} </Text>
            {meanings.map((meaning, index) => (
              <View key={index}>
                <Text style={styles.textDesign}>
                  Part of Speech: {meaning.partOfSpeech}
                </Text>
                {meaning.definitions.map((definition, index) => (
                  <View key={index}>
                    <Text style={styles.textDesign}>
                      Definition: {definition.definition}
                    </Text>
                    {definition.example && (
                      <Text style={styles.textDesign}>
                        Example: {definition.example}
                      </Text>
                    )}
                  </View>
                ))}
                {index < meanings.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <View
            style={{
              alignItems: 'center',
              margin: 20,
            }}>
            <TouchableOpacity
              style={styles.buttonDesign}
              onPress={() => {
                collect();
              }}>
              <Text style={styles.buttonText}>Collect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff0',
  },

  inputBox: {
    backgroundColor: 'white',
    height: 50,
    width: '80%',
    borderRadius: 5,

    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    fontSize: 20,
  },

  title: {
    // flex: 0.2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C16',
    margin: 20,
  },

  buttonDesign: {
    backgroundColor: '#C4DBFA',
    width: '30%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
  },

  buttonText: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 5,
  },

  textDesign: {
    fontSize: 20,
    backgroundColor: '#C4DBFA',
    marginTop: 10,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
});

export default SearchScreen;
