// SearchScreen.js
import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Text, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // 从 AsyncStorage 中获取搜索历史
    const getSearchHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('searchHistory');
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error('Error reading search history:', error);
      }
    };

    getSearchHistory();
  }, []);

  const dictionaryAPI = async term => {
    // 模拟字典API请求
    const fakeData = [
      {word: 'example', definition: 'a representative form'},
      {word: 'search', definition: 'to look for something'},
      // ...其他模拟数据
    ];

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(fakeData.filter(item => item.word.includes(term)));
      }, 1000);
    });
  };

  const handleSearch = async () => {
    // 调用字典API并更新搜索结果
    const results = await dictionaryAPI(searchTerm);
    setSearchResults(results);

    // 更新搜索历史
    const updatedHistory = [...searchHistory, searchTerm];
    setSearchHistory(updatedHistory);

    // 将更新后的搜索历史保存到AsyncStorage
    try {
      await AsyncStorage.setItem(
        'searchHistory',
        JSON.stringify(updatedHistory),
      );
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter a word"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <Button title="Search" onPress={handleSearch} />

      <Text>Search Results:</Text>
      <FlatList
        data={searchResults}
        keyExtractor={item => item.word}
        renderItem={({item}) => (
          <View>
            <Text>{item.word}</Text>
            <Text>{item.definition}</Text>
          </View>
        )}
      />

      <Text>Search History:</Text>
      <FlatList
        data={searchHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Text>{item}</Text>}
      />
    </View>
  );
};

export default SearchScreen;
