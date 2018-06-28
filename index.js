import { AppRegistry } from 'react-native';
import App from './App';
import {NativeModules} from 'react-native';
// var fs = require('fs');
// import { grpc } from 'grpc';
// import { Code, grpc, Metadata, Transport } from 'grpc-web-client';
// import * as jspb from 'google-protobuf';
// var proto = require("./proto.js");

// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       console.log(i);
//       break;
//     }
//   }
// }
module.exports = NativeModules.lnd;
// NativeModules.lnd.Start('', function(data){console.log(data);},function(data){console.log(data);})
var RNFS = require('react-native-fs');
var path = RNFS.DocumentDirectoryPath + '/lnd.conf';
RNFS.readFileAssets('lnd.conf').then((res) => {
  console.log('read file res: ', res);
  RNFS.writeFile(path, res, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
      console.log(path);
    })
    .catch((err) => {
      console.log(err.message);
    });

})




console.log(NativeModules.lnd);
AppRegistry.registerComponent('reactlightning', () => App);
