# react-lightning - A lightning wallet implementation with React Native

Background: There are currently 4 projects working on Lightning network implementation.
1. LND written in GO
2. c-lightning written in c
3. Eclair written in Scala
4. mit-dci written in GO

We have chosen LND as written in GO and easier to cross compile for iOS and Android (MIT project is still lagging behind as of now), plus the community on LND is far larger as compared to other projects and moreover the architecture with Nutrino is much modular to create an independent mobile app.

React Lightning is open source and will remain so.

# Overview

* Uses lnd as a daemon/library because it fully conforms to the BOLT specifications and is easy to cross-compile and run on mobile platforms.
* There are two ways to cross-compile GO code  to .aar package for Android and .framework package for iOS **gomobile** and **xgo**, we have chosen gomobile, as LND team is working on a fully compatible version of LND with gomobile, so it's better to invest in the future.
* We have used a separate branch of LND which makes it possible to cross compile with gomobile, as gomobile does not allow cross compiling of packages with a `main` function.
* LND daemon exposes two interfaces RPC and REST, we will be using RPC interface to call the underlying functionality exposed by the cross compiled package.
* Since the UI is built in React Native we need to write a react-native bridge for both iOS and Android, so as to interact with the cross compiled package. (Currently the UI is just for POC, we are working on it)
* Currently the bridge is only written for Android in JAVA, we are working on the iOS version.
* The project ships it's own `lnd.conf`, which has settings regarding the LND daemon and connects with the lightning network with some default running clients on the network.
* The project ships with it's own 'rpc.proto' as well, it is create using grpc-web for allowing react native to make RPC's calls.

# Architecture

**React <=> React-Native Bridge <=> Native <=> LND**

After creating protobuf file for lnd using gprc-web the challenge was to call the RPC functions from react native.
For this we have created one function as an input in react which maps to one function in native on the other side of the bridge, the parameters to that function are:

1. Name of the function to call from LND daemon.
2. Parameters to be passed on to the function being called.

But since javascript is async we had to create another function in react which is called by native with the output sent from LND daemon.

To add on the data sent over the wire is hex of the buffers to maintain data consistency, as the buffers in javascript and JAVA/Swift are not compatible/same.

## TODO:
* Update README with steps to build from source:
1. gomobile
2. grpc-web
3. LND
* Create UI on Android.
* Create UI and native bridge on iOS.
* Deploy on App Store.
