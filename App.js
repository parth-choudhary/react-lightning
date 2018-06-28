import React from 'react';
import { StyleSheet, Text, View, Button, NativeModules } from 'react-native';
import { Badge, H4,  themeManager } from 'nachos-ui'
var RNFS = require('react-native-fs');
import { proto as wallet} from "./compiled.js";
import { proto } from "./wallet.js";
// module.exports = NativeModules.lnd;
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      GenSeedResponse: false
    }
    this.unlockWallet = this.unlockWallet.bind(this);
    this.genSeed = this.genSeed.bind(this);
    this.initWallet = this.initWallet.bind(this);
    this.getNewAddress = this.getNewAddress.bind(this);
    this.reflection = this.reflection.bind(this);
    this.start = this.start.bind(this);
    this.hexToBytes = this.hexToBytes.bind(this);
    this.binaryToHex = this.binaryToHex.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }

  componentDidMount(){
      console.log('mounted');
  }



   unlockWallet() {
    var UnlockWalletRequest = new proto.lnrpc.UnlockWalletRequest();
    UnlockWalletRequest.setWalletPassword('password1234');
    var a = UnlockWalletRequest.serializeBinary();
    var hex = this.binaryToHex(a);
    console.log("unlock clicked clicked");
    this.reflection('unlockWallet', hex);
}

walletBalance() {
 var WalletBalanceRequest = new proto.lnrpc.WalletBalanceRequest();
 // UnlockWalletRequest.setWalletPassword('password1234');
 var a = WalletBalanceRequest.serializeBinary();
 var hex = this.binaryToHex(a);
 console.log("unlock clicked clicked");
 this.reflection('walletBalance', hex);
}

walletBalanceShow() {
 // var WalletBalanceResponse = new proto.lnrpc.WalletBalanceRequest();
 // UnlockWalletRequest.setWalletPassword('password1234');
 var binary = this.hexToBytes('08DAE9FA3D10DAE9FA3D');
 var data = proto.lnrpc.WalletBalanceResponse.deserializeBinary(binary);
 // var a = WalletBalanceRequest.serializeBinary();
 // var hex = this.binaryToHex(a);
 // console.log("unlock clicked clicked");
 // this.reflection('walletBalance', hex);
 console.log(data);
}

genSeed() {
 var GenSeedRequest = new proto.lnrpc.GenSeedRequest();
 GenSeedRequest.setAezeedPassphrase('password1234');
 var a = GenSeedRequest.serializeBinary();
 var hex = this.binaryToHex(a);
 console.log("unlock clicked clicked");
 this.reflection('genSeed', hex);
}

initWallet() {
    var InitWalletRequest = new proto.lnrpc.InitWalletRequest();
    var GenSeedResponse = proto.lnrpc.GenSeedResponse.deserializeBinary(this.state.genSeed);
    console.log(this.state.GenSeedResponse);
    console.log(GenSeedResponse);
    console.log(GenSeedResponse.array[0]);
    InitWalletRequest.setWalletPassword('password1234');
    InitWalletRequest.setCipherSeedMnemonicList(GenSeedResponse.array[0]);
    InitWalletRequest.setAezeedPassphrase('password1234');
    var a = InitWalletRequest.serializeBinary();
    var hex = this.binaryToHex(a);
    console.log("initWallet clicked clicked");
    this.reflection('initWallet', hex);
}

getNewAddress() {
  // console.log(proto.lnrpc);
 // console.log(wallet.lnrpc);

 var NewAddressRequest = new proto.lnrpc.NewAddressRequest();

 NewAddressRequest.setType(proto.lnrpc.NewAddressRequest.AddressType.NESTED_PUBKEY_HASH);
 var a = NewAddressRequest.serializeBinary();
 var hex = this.binaryToHex(a);
 console.log("newaddress clicked")
 this.reflection('newAddress', hex);
 // RNFS.readFile(RNFS.DocumentDirectoryPath + "/wallet.db", 'utf8').then((res) => {
 //   console.log(res);
 //   lndCert = res;
 // });
 // NativeModules.lnd.newAddress(hex,
 //  function(successData) {
 //   console.log(successData);
 //   // console.log(proto.lnrpc.SignMessageResponse.deserializeBinary(successData));
 //   var lndCert;
 //   RNFS.readFile(RNFS.DocumentDirectoryPath + "/data/chain/bitcoin/testnet/peers.json", 'utf8').then((res) => {
 //     // console.log(res);
 //     lndCert = res;
 //   });
   // fetch('https://localhost:8080/v1/getinfo')
   //     .then(response => response.json())
   //     .catch(error => console.log('Error:', error))
   //     .then(response => console.log('Success:', response));
   // RNFS.readFileAssets('rpc.proto').then((res) => {
   //   console.log('read file res: ', proto);
   //   // var credentials = grpc.credentials.createSsl(lndCert);
   // });



   // var credentials = grpc.credentials.createSsl(lndCert);
   // var lnrpcDescriptor = grpc.load("rpc.proto");
   // var lnrpc = lnrpcDescriptor.lnrpc;
   // var lightning = new lnrpc.Lightning('localhost:10009', credentials);
   // call = lightning.genSeed({
   //     aezeed_passphrase: 'sad',
   //     seed_entropy: 'asd',
   //   }, function(err, response) {
   //     console.log('GenSeed: ' + response);
   //   })
//  },
//  function(errorData) {
//   console.log(errorData);
//  }
// )
}

reflection(funcName, param) {
  console.log('reflection called');
  NativeModules.lnd.reflection(funcName, param,
  function(successData) {
     console.log(successData);
     var methodName = successData.split(':')
     console.log(methodName);
     //  var GenSeedResponse = new proto.lnrpc.GenSeedResponse();
     var bytes = this.hexToBytes(methodName[1]);
    var obj = {}
    obj[methodName[0]] = bytes;
    this.setState(obj);
  }.bind(this),
   function(errorData) {
      console.log(errorData);
 }.bind(this));
}

showPeers(){
  console.log(proto.lnrpc.ListPeersResponse.deserializeBinary(this.state.listPeers).getPeersList()[0].serializeBinary());
  this.setState({peerNodePubKey: proto.lnrpc.ListPeersResponse.deserializeBinary(this.state.listPeers).getPeersList()[0].serializeBinary()})
  console.log(proto.lnrpc.ListPeersResponse.deserializeBinary(this.state.listPeers).getPeersList());
  console.log(this.state.listPeers);
}

start() {
  console.log(proto.lnrpc);
  console.log("start button clicked");
 //  NativeModules.lnd.reflection('start', RNFS.DocumentDirectoryPath + '/',
 //  function(successData) {
 //     console.log(successData);
 //   },
 //   function(errorData) {
 //      console.log(errorData);
 // }
// )
  NativeModules.lnd.Start(RNFS.DocumentDirectoryPath + '/',
   function(successData) {
    console.log(successData);
 //    // var lndCert;
 //    // RNFS.readFile(RNFS.DocumentDirectoryPath + "/tls.cert", 'utf8').then((res) => {
 //    //   console.log(res);
 //    //   lndCert = res;
 //    // });
 //    // fetch('https://localhost:8080/v1/getinfo')
 //    //     .then(response => response.json())
 //    //     .catch(error => console.log('Error:', error))
 //    //     .then(response => console.log('Success:', response));
 //    // RNFS.readFileAssets('rpc.proto').then((res) => {
 //    //   console.log('read file res: ', proto);
 //    //   // var credentials = grpc.credentials.createSsl(lndCert);
 //    // });
 //
 //
 //
 //    // var credentials = grpc.credentials.createSsl(lndCert);
 //    // var lnrpcDescriptor = grpc.load("rpc.proto");
 //    // var lnrpc = lnrpcDescriptor.lnrpc;
 //    // var lightning = new lnrpc.Lightning('localhost:10009', credentials);
 //    // call = lightning.genSeed({
 //    //     aezeed_passphrase: 'sad',
 //    //     seed_entropy: 'asd',
 //    //   }, function(err, response) {
 //    //     console.log('GenSeed: ' + response);
 //    //   })
  },
  function(errorData) {
   console.log(errorData);
  }
 )
}

getInfo() {
  console.log("info button clicked")
  var GetInfoRequest = new proto.lnrpc.GetInfoRequest();
  var a = GetInfoRequest.serializeBinary();
  var hex = this.binaryToHex(a);
  console.log(hex);
  this.reflection('getInfo', hex);
}

showInfo() {
  console.log("showinfo button clicked")
  console.log(this.state.getInfo);
  var infohex = this.state.getInfo;
  var response = proto.lnrpc.GetInfoResponse.deserializeBinary(infohex);
  console.log(response);
}

openChannel() {
  console.log("open channel button clicked")

  var OpenChannelRequest = new proto.lnrpc.OpenChannelRequest();
  OpenChannelRequest.setLocalFundingAmount(20000);
  // var view = new Uint8Array( this.hexToBytes('0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b') );
  var view = new Uint8Array( this.hexToBytes('03a34e3b3e2fc520163f0f5473c4d40807da74decda2c8c35c9c2d4f56ff9b22b3') );
  OpenChannelRequest.setNodePubkey(view);
  // OpenChannelRequest.setNodePubkeyString('0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b');
  OpenChannelRequest.setNodePubkeyString('03a34e3b3e2fc520163f0f5473c4d40807da74decda2c8c35c9c2d4f56ff9b22b3');
  OpenChannelRequest.setPrivate(false);
  // OpenChannelRequest.setPushSat
  // OpenChannelRequest.setRemoteCsvDelay
  // OpenChannelRequest.setSatPerByte
  // OpenChannelRequest.setTargetConf
  var a = OpenChannelRequest.serializeBinary();
  var hex = this.binaryToHex(a);
  this.reflection('openChannel', hex);
}

sendpayment() {
  console.log("sendpayment button clicked")

  var SendRequest = new proto.lnrpc.SendRequest();
  // SendRequest.setDest(20000);
  var view = new Uint8Array( this.hexToBytes('0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b') );
  // var view = new Uint8Array( this.hexToBytes('03a34e3b3e2fc520163f0f5473c4d40807da74decda2c8c35c9c2d4f56ff9b22b3') );
  SendRequest.setDest(view);
  SendRequest.setAmt(1000);
  SendRequest.setDestString('0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b');
  // SendRequest.setDestString('03a34e3b3e2fc520163f0f5473c4d40807da74decda2c8c35c9c2d4f56ff9b22b3');
  SendRequest.setPaymentRequest('lntb100u1pdjfe8cpp5vav6s7c9xaqgjwft2zwmx5ep0x6hwyrdmrcc4gdcezrtkynjndwsdqqcqzysrdpyewyxnkasjs0mhff2llh4jfr734lxm23tvd9pysk76pfm3cg93f0ugscavzazms0fr03007fy6k08x689th6zwx5sf9r5avuslgspny8fec');
  SendRequest.setPaymentHashString('6759a87b05374089392b509db3532179b577106dd8f18aa1b8c886bb12729b5d');
  // OpenChannelRequest.setPushSat
  // OpenChannelRequest.setRemoteCsvDelay
  // OpenChannelRequest.setSatPerByte
  // OpenChannelRequest.setTargetConf
  var a = SendRequest.serializeBinary();
  var hex = this.binaryToHex(a);
  this.reflection('sendPaymentSync', hex);
}

paymentDetails() {
  console.log(this.state.sendPaymentSync);
    var cp = this.hexToBytes("0A24756E61626C6520746F2066696E642061207061746820746F2064657374696E6174696F6E");
    // var ChannelPoint = proto.lnrpc.ChannelPoint.deserializeBinary(cp);
    var  ListChannelsResponse = proto.lnrpc.SendResponse.deserializeBinary(this.state.sendPaymentSync);
    // console.log(ChannelPoint);
    console.log(ListChannelsResponse);
}

listChannels() {
  console.log("open channel button clicked")
  var ListChannelsRequest = new proto.lnrpc.ListChannelsRequest();

  var a = ListChannelsRequest.serializeBinary();
  var hex = this.binaryToHex(a);
  this.reflection('listChannels', hex);
}

showChannelDetails() {
console.log(this.state.listChannels);
  var cp = this.hexToBytes("5AA801080112423032373036383563613831613865346434643031626565633537383166346363393234363834303732616535326335303766386562653964616630636161616237621A42303831356234386632663062383362656632383339356462303638383761323965326665366132626435383936326566373566313834363339333230316662663A30208080DC8080E0819D1428A09C0130C65540DA4648D80450D46180019001");
  var ChannelPoint = proto.lnrpc.ChannelPoint.deserializeBinary(cp);
  var  ListChannelsResponse = proto.lnrpc.ListChannelsResponse.deserializeBinary(this.hexToBytes(this.state.listChannels));
  console.log(ChannelPoint);
  console.log(ListChannelsResponse);
}


connectPeer() {
  console.log("Connect peer clicked")
  var LightningAddress = new proto.lnrpc.LightningAddress();
  LightningAddress.setHost('192.168.0.131');
  // LightningAddress.setHost('159.203.125.125');
  // LightningAddress.setPubkey('0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b');
  LightningAddress.setPubkey('03a34e3b3e2fc520163f0f5473c4d40807da74decda2c8c35c9c2d4f56ff9b22b3');
  var ConnectPeerRequest = new proto.lnrpc.ConnectPeerRequest();
  // ConnectPeerRequest.setPerm(true);
  // proto.lnrpc.LightningAddress.s
  console.log(LightningAddress.serializeBinary());
  ConnectPeerRequest.setAddr(LightningAddress);
  var a = ConnectPeerRequest.serializeBinary();
  console.log(a);
  var hex = this.binaryToHex(a);
  console.log(hex);
  this.reflection('connectPeer', hex);
}

listPeers() {
  console.log("Connect peer clicked")
  var ListPeersRequest = new proto.lnrpc.ListPeersRequest();
  // ConnectPeerRequest.setPerm(true);
  // proto.lnrpc.LightningAddress.s
  var a = ListPeersRequest.serializeBinary();
  console.log(a);
  var hex = this.binaryToHex(a);
  console.log(hex);
  this.reflection('listPeers', hex);
}


stop() {
  console.log("stop button clicked")
  var StopRequest = new proto.lnrpc.StopRequest();
  var a = StopRequest.serializeBinary();
  var hex = this.binaryToHex(a);
  console.log(hex);
  this.reflection('stopDaemon', hex);
}

binaryToHex(a) {
  var byteArray = new Uint8Array(a.buffer);
  var arr = new Uint8Array(byteArray.length);
  for(var i = 0; i < byteArray.length; i++) {
    arr[i] = byteArray[i];
  }
  var hex = Array.prototype.map.call(new Uint8Array(byteArray), x => ('00' + x.toString(16)).slice(-2)).join('');
  return hex;
}

hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.GenSeedResponse}</Text>
        <Text>{this.state.openChannel}</Text>
        <H4>Example:</H4>
        <Text>Now connected to LND will use GRPC to make changes</Text>
        <Button
            onPress={() => this.genSeed()}
            title="Gen Seed"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={() => this.initWallet()}
            title="Init wallet"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.unlockWallet.bind(this)}
            title="Unlock"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.getNewAddress.bind(this)}
            title="New Address"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.openChannel.bind(this)}
            title="Open Channel"
            color="#841584"
            style={{margin: 4}}
        />
        <Button
            onPress={this.listChannels.bind(this)}
            title="List Channels"
            color="#841584"
            style={{margin: 4}}
        />
        <Button
            onPress={this.showChannelDetails.bind(this)}
            title="showChannelDetails"
            color="#841584"
            style={{margin: 4}}
        />
        <Button
            onPress={this.sendpayment.bind(this)}
            title="sendpayment"
            color="#841584"
            style={{margin: 4}}
        />
        <Button
            onPress={this.paymentDetails.bind(this)}
            title="paymentDetails"
            color="#841584"
            style={{margin: 4}}
        />
        <Button
            onPress={this.getInfo.bind(this)}
            title="Get Info"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.showInfo.bind(this)}
            title="show Info"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.walletBalance.bind(this)}
            title="Wallet Balance"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.walletBalanceShow.bind(this)}
            title="Wallet BalanceShow"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.connectPeer.bind(this)}
            title="Connect Peer"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.listPeers.bind(this)}
            title="List Peers"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.showPeers.bind(this)}
            title="Show Peers"
            color="#841584"
            margin="4px"
        />
        <Button
            onPress={this.start}
            title="Start"
            color="#841584"
            style={{margin: 4}}
        />
        <Button
            onPress={this.stop.bind(this)}
            title="Stop"
            color="#841584"
            style={{margin: 4}}
        />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
