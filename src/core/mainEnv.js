const { AsyncStorage } = require('react-native');

this.state = {
  apiPath: '',
  name: ''
};

const setNewPath = async (newPath,secondApiPath) => {
  if(newPath==null){
    this.state.apiPath = secondApiPath.key;
    this.state.name = secondApiPath.value;
    await AsyncStorage.setItem('apipaths', JSON.stringify(String(secondApiPath.key)));
  }else{
    this.state.apiPath = newPath;
    await AsyncStorage.setItem('apipaths', JSON.stringify(String(newPath)));
  }
};

const worker = {
  setNewPath,
  state
};

module.exports = worker;