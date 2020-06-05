import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);
  
  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};


export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here
  function resetWatchList() {
    AsyncStorage.removeItem('watchList');
    // AsyncStorage.clear();
    setState([]);
  }

  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    // AsyncStorage.clear();
    if(state == null) {
      setState([newSymbol]);
      alert(`Sucessfully added ${newSymbol} to your watch list!`);
    } 
    else {
      // Push the new symbol to the end of the symbol array.
      setState(prevState=>([...prevState, newSymbol]));
      alert(`Sucessfully added ${newSymbol} to your watch list!`);
    }
    AsyncStorage.setItem('watchList', JSON.stringify(state));
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    // We store only the symbols in the watchList.
    AsyncStorage.getItem('watchList')
      .then(storedSymbol => JSON.parse(storedSymbol))
      .then(json => setState(json));

  }, []);

  return { ServerURL: 'http://131.181.190.87:3001/all', watchList: state,  addToWatchlist, resetWatchList };
};
