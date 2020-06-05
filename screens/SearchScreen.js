import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard /* include other react native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
// import { Ionicons } from '@expo/vector-icons';
import { Text, SearchBar, ListItem } from 'react-native-elements'
//import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
// import { FontDisplay } from 'expo-font';
// import { CurrentRenderContext } from '@react-navigation/native';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  //const [state, setState] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [nowLoading, setNowLoading] = useState(false);
  const [error, setError] = useState(null);
  // can put more code here

  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    // Let users know the data is fetching.
    setNowLoading(true);
    fetch(ServerURL)
      .then(res => res.json())
      .then(res => res.map(data => {
        return {
          symbol: data.symbol,
          name: data.name
        }
      })
      )
      .then(dataset => setRowData(dataset))
      .then(setNowLoading(false)) // Set loading back to false after the data is fetched.
      //.catch(err => { setError(err.response); }) // catch if any error occurs.

  }, []);
 
  // Loading Effect / Text
  if(nowLoading) {
    return (
      <View>
        <Text style={styles.nowloading}>
          Loading...
        </Text>
      </View>
    )
  }

  // If There is Error, display.
  if(error) {
    return (
      <View>
        <Text style={styles.error}>
          Error:
          {error}
        </Text>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* FixMe: add children here! */ }
        <SearchBar placeholder='Search stock by symbol/name...' value={searchText} onChangeText={input => setSearchText(input)} />
        <DisplaySearchRes data={rowData} search={searchText}/>
      </View>
    </TouchableWithoutFeedback>    
  )
}

function DisplaySearchRes({data, search}) {

  const { ServerURL, addToWatchlist } = useStocksContext();

  return (
    <ScrollView>
      {/* Data is being filtered using the searchText changed by input text in the SearchBar */}
      {data.filter(x => x.symbol.includes(search.toUpperCase()) || x.name.toLowerCase().includes(search.toLowerCase())).map((filtered, i) => (
        <TouchableOpacity key={i} onPress={() => addToWatchlist(filtered.symbol)} >
          {/* <ListItem 
            key={i}
            title={filtered.symbol}
            subtitle={filtered.name}
            bottomDivider
          /> */}
          <View style={styles.list}>
            <Text style={styles.stock_title}>
              {filtered.symbol}{'\n'}
              <Text style={styles.stock_subtitle}>{filtered.name}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: scaleSize(10),
  },
  nowloading: {
    color:'grey', 
    fontSize: scaleSize(20)
  },
  error: {
    color:'red', 
    fontSize: scaleSize(20)
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //margin: scaleSize(10),
    marginTop: scaleSize(10),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    paddingBottom: scaleSize(10)
  },
  stock_title: {
    color:'white',
    fontWeight: 'bold',
    fontSize:scaleSize(20)
  },
  stock_subtitle: {
    color:'white',
    fontWeight: 'normal',
    fontSize:scaleSize(16)
  },
});