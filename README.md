# react-lightning - A lightning wallet implementation with React Native

Background: There are currently 4 projects working on Lightning network implementation.
1. LND written in GO
2. c-lightning written in c
3. Eclair written in Scala
4. mit-dci written in GO

We have chosen LND as written in GO and easier to cross compile for iOS and Android (MIT project is still lagging behind as of now), plus the community on LND is far larger as compared to other projects and moreover the architecture with Nutrino is much modular to create an independent mobile app.

React Lightning is open source and will remain so.

# Overview

* Uses **lnd** as a daemon/library because it fully conforms to the BOLT specifications and is easy to cross-compile and run on mobile platforms.
* There are two ways to cross-compile GO code  to .aar package for Android and .framework package for iOS **gomobile** and **xgo**, we have chosen gomobile, as LND team is working on a fully compatible version of LND with gomobile, so it's better to invest in the future.
* We have used a separate branch of LND which makes it possible to cross compile with **gomobile**, as gomobile does not allow cross compiling of packages with a `main()` function.
* LND daemon exposes two interfaces **RPC** and **REST**, we will be using RPC interface to call the underlying functionality exposed by the cross compiled package.
* Since the UI is built in React Native we need to write a react-native bridge for both **iOS** and **Android**, so as to interact with the cross compiled package. (Currently the UI is just for POC, we are working on it)
* Currently the bridge is only written for Android in JAVA, we are working on the iOS version.
* The project ships it's own `lnd.conf`, which has settings regarding the LND daemon and connects with the lightning network with some default running clients on the network.
* The project ships with it's own `rpc.proto` as well, it is create using grpc-web for allowing react native to make RPC's calls.

# Architecture

**React <=> React-Native Bridge <=> Native <=> LND**

After creating protobuf file for lnd using gprc-web the challenge was to call the RPC functions from react native.
For this we have created one function as an input in react which maps to one function in native on the other side of the bridge, the parameters to that function are:

1. Name of the function to call from LND daemon.
2. Parameters to be passed on to the function being called.

But since javascript is async we had to create another function in react which is called by native with the output sent from LND daemon.

To add on the data sent over the wire is hex of the buffers to maintain data consistency, as the buffers in javascript and JAVA/Swift are not compatible/same.

# TODOs:
* Update README with steps to build:
   * gomobile
   * grpc-web
   * LND
   * lnd.conf
* Create UI on Android.
* Create UI and native bridge on iOS.
* Deploy on App Store.

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent.
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [developers@opoch.com]. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

