import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const MyWordsScreen = () => {
  console.log('Component rendering...');
  const [collectedWords, setCollectedWords] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // 在组件加载时从 AsyncStorage 中获取已收藏的单词列表
    const loadCollectedWords = async () => {
      try {
        const storedWords = await AsyncStorage.getItem('collectedWords');
        console.log('Stored Words:', storedWords);
        const wordsArray = storedWords ? JSON.parse(storedWords) : [];
        setCollectedWords(wordsArray);
      } catch (error) {
        console.error('Error loading collected words:', error);
      }
    };

    // 调用加载函数
    loadCollectedWords();

    // 添加 focus 事件监听器
    const updateCollectedWordsOnFocus = navigation.addListener('focus', () => {
      // 调用加载函数
      loadCollectedWords();
    });

    // 清除监听器以防止内存泄漏
    return () => {
      updateCollectedWordsOnFocus();
    };
  }, [navigation]);

  // 添加副作用
  useEffect(() => {
    // 这里可以执行在状态更新后的其他副作用
    console.log('Collected Words updated:', collectedWords);
  }, [collectedWords]);

  const deleteWord = async word => {
    try {
      // 过滤掉待删除的单词
      const updatedWords = collectedWords.filter(w => w !== word);

      // 保存更新后的单词列表
      await AsyncStorage.setItem(
        'collectedWords',
        JSON.stringify(updatedWords),
      );

      // 更新 state，并在回调函数中执行操作
      setCollectedWords(updatedWords);
      // setCollectedWords(updatedWords, () => {
      //   // 这里执行在 state 更新之后需要立即执行的操作
      //   console.log('Updated words:', updatedWords);
      // });
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  // const navigateToSearch = async word => {
  //   // 导航到 SearchScreen，并自动搜索点击的单词
  //   navigation.navigate('SearchScreen', {initialWord: word});
  // };

  const renderWordItem = ({item}) => (
    <View style={styles.wordItem}>
      <TouchableOpacity onPress={() => navigateToSearch(item)}>
        <Text style={styles.wordText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteWord(item)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const navigateToSearch = ({word}) => {
    // 导航到 SearchScreen，并传递参数给该页面
    navigation.navigate('SearchScreen', {initialWord: word});
    console.log('navigating to the search screen');

    // // 延迟一段时间再执行查询
    // setTimeout(() => {
    //   console.log('executing search after navigation');
    // }, 500); // 500毫秒延迟，可以根据实际情况调整
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Collected Words</Text>
      </View>
      <View style={styles.listContainer}>
        {collectedWords.length === 0 ? (
          <Text>No words collected yet.</Text>
        ) : (
          <FlatList
            data={collectedWords.reverse()} // 以最近收藏的单词在前的顺序显示
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWordItem}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    position: 'absolute',
    top: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  listContainer: {
    marginTop: 60,
    // minHeight: 500,
  },

  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    width: '100%',
  },
  wordText: {
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#C4DBFA',
    width: '30%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 5,
  },
});

export default MyWordsScreen;
