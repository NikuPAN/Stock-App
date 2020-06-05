import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Text, Button, ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
//import { FontDisplay } from 'expo-font';
//import { CurrentRenderContext } from '@react-navigation/native';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)




export default function StocksScreen({route}) {
  const { ServerURL, watchList, resetWatchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [info, setInfo] = useState("");
  const [nowLoading, setNowLoading] = useState(false);
  const [error, setError] = useState(null);
  // can put more code here

  // We need a function to get watchlist without duplicated values.
  function getUniqueWatchList(list) {
    return Array.from(new Set(list));
  }
  const uni_WatchList = getUniqueWatchList(watchList);

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state.
    if(uni_WatchList.length != 0) {
      // First initialize the state to an empty array 
      setState([]);
      uni_WatchList.map((x) => {
        
        setNowLoading(true);
        fetch(`http://131.181.190.87:3001/history?symbol=${x}`)
          .then(res => res.json())
          .then(res => res[0])
          .then(res => setState(prev => [...prev, {
            name: res.name,
            symbol: res.symbol,
            open: res.open,
            high: res.high,
            low: res.low,
            close: res.close,
            volumes: res.volumes,
            percentage: ((res.close / res.open) - 1).toFixed(2)
          }]))
          .then(setNowLoading(false))
          .catch(err => { setError(err.response); })
      })
    }
    
  }, [watchList]);
  
  const stocklist = Array.from(new Set(state.map(s =>(s.symbol)))).map(symbol => {

    return {
      symbol: symbol,
      name: state.find(s => s.symbol === symbol).name,
      open: state.find(s => s.symbol === symbol).open,
      high: state.find(s => s.symbol === symbol).high,
      low: state.find(s => s.symbol === symbol).low,
      close: state.find(s => s.symbol === symbol).close,
      volumes: state.find(s => s.symbol === symbol).volumes,
      percentage: state.find(s => s.symbol === symbol).percentage,

    }
  });

  // Loading Effect / Text
  if(nowLoading) {
    return (
      <View>
        <Text style={styles.nowloading}>
          Loading...
        </Text>
      </View>
    );
  }

  // If There is Error, display.
  if(error != null) {
    return (
      <View>
        <Text style={styles.error}>
          Error:
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* FixMe: add children here! */ }
      {/* Check whether the watch list is empty decide whether reset button or empty text is displayed */}
      {(watchList && watchList.length != 0 ? (
        <Button title="Reset Watch List" type="outline" onPress={() => (resetWatchList(), alert('The Watch List has been reset.'), setState([]), setInfo(""))} />
      ) : (
        <Text style={styles.listisempty}> Your watch list is empty.{'\n'}Add a stock from search screen.</Text>
      ))}
      <View style={{ flex: 7 }}>
        <ScrollView>
          {stocklist.map((e) => (

            <TouchableWithoutFeedback key={e.symbol} onPress={() => setInfo(e)}>

              <View style={styles.list}>

                <Text style={styles.symbol}>{e.symbol}</Text>
                <Text style={styles.close}>{e.close}</Text>
                <Text style={(e.percentage > 0 ? styles.perc_positive : styles.perc_negative)}>  {(e.percentage > 0 ? "+" : "")}{e.percentage} % </Text>
              </View>

            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>
      { /* Check whether info is available to decide the below tab to deplay or not */ }
      {(info !== "" ? (
        <TouchableWithoutFeedback onLongPress={() => setInfo("")}>
          <View style={styles.stock} >
          <Text style={styles.footer_title}>
            <Text style={styles.name}>{info.name}</Text>
          </Text>
          {/* This Line showing Open and High Price Information */}
          <View style={styles.info_row}>
            <View style={styles.textbox}>
              <Text style={styles.footertext}>Open</Text>
              <Text style={styles.footertext_value}>{info.open}</Text>
            </View>
            <View style={styles.textbox}>
              <Text style={styles.footertext}>High</Text>
              <Text style={styles.footertext_value}>{info.high}</Text>
            </View>
          </View>
          {/* This Line showing Close and Low Price Information */}
          <View style={styles.info_row}>
            <View style={styles.textbox}>
              <Text style={styles.footertext}>Close</Text>
              <Text style={styles.footertext_value}>{info.close}</Text>
            </View>
            
            <View style={styles.textbox}>
              <Text style={styles.footertext}>Low</Text>
              <Text style={styles.footertext_value}>{info.low}</Text>
            </View>
          </View>
          {/* This Line showing Volume Information */}
          <View style={styles.info_row}>
            <View style={styles.textbox}>
              <Text style={styles.footertext}>Volume</Text>
              <Text style={styles.footertext_value}>{info.volumes}</Text>
            </View>
            <View style={styles.textbox}>

            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      ) : (
        null
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: scaleSize(10),
  },
  nowloading: {
    color:'grey', 
    fontSize:scaleSize(20),
    textAlign:'center',
    marginTop:'50%'
  },
  error: {
    color:'red', 
    fontSize:scaleSize(20)
  },
  listnotempty: {
    color:'white', 
    fontSize:scaleSize(20), 
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom:20
  },
  listisempty: {
    color: 'red',
    fontSize:scaleSize(20),
    fontWeight: 'bold',
    textAlign:'center',
    marginTop:'50%'
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //margin: scaleSize(10),
    marginTop: scaleSize(10),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    paddingBottom: scaleSize(10)
  },
  symbol: {
    color: 'white',
    fontSize: scaleSize(20),
    width: '30%',
    fontWeight: 'bold'
  },
  close: {
    color: 'white',
    width:'30%',
    textAlign:'right',
    fontSize: scaleSize(20)

  },
  perc_positive: {

    color: 'white',
    backgroundColor: '#38f567',
    width: scaleSize(90),
    height: scaleSize(30),
    textAlign: 'center',
    borderRadius: scaleSize(5),
    overflow: 'hidden',
    fontSize: scaleSize(18)
  },
  perc_negative: {
    color: 'white',
    backgroundColor: '#f73636',
    width: scaleSize(90),
    height: scaleSize(30),
    textAlign: 'center',
    borderRadius: scaleSize(5),
    overflow: 'hidden',
    fontSize: scaleSize(18)

  },
  name: {
    textAlign: 'center',
  },
  stock : {
    flex: scaleSize(3), 
    backgroundColor: '#333333'
  },
  stock_info: {
    flex: scaleSize(1), 
    backgroundColor: '#333333'
  },
  info_row: {
    flex: scaleSize(1), 
    flexDirection: 'row', 
    marginTop: scaleSize(5)
  },
  textbox: {
    flex: scaleSize(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginRight: scaleSize(10),
    borderTopWidth: scaleSize(0.5),
    //borderBottomWidth: scaleSize(0.5),
    borderColor: 'grey'
  },
  footer_title: {
    color: 'white',
    fontSize: scaleSize(25),
    fontWeight: 'normal'
  },
  footertext: {
    color: 'white',
    fontSize: scaleSize(17),
    fontWeight: '100',
    textAlign:'left',
    margin: scaleSize(5)
  },
  footertext_value: {
    color: 'white',
    fontSize: scaleSize(17),
    fontWeight: 'normal',
    textAlign:'left',
    margin: scaleSize(5)
  }
});