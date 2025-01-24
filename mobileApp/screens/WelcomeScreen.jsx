import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from "react-native";

const WelcomeScreen = ({ onContinue }) => {
  return (
    <ImageBackground
      source={require('../assets/images/bg.jpeg')}
      style={styles.background}
      imageStyle={{ opacity: 0.5 }}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/image.png')}
          style={styles.logo}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to Our App!</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              This app helps you monitor user performance and manage customer registrations 
              for real estate efficiently.
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={onContinue}>
            <Text style={styles.buttonText}>Continue to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 50,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(3, 7, 0, 0.2)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 100, // Inner padding for the text
    marginBottom: 60,
  },
  description: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: "Montserrat",
    
  },
  logo: {
    width: 500,
    height: 500,
    marginBottom: 335,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FFA700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
