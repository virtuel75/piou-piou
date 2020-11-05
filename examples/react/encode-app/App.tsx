import React, { useState } from 'react';
import { Button, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Card from './src/components/card';
import { Converter } from './src/helpers/converter';
import { Base64Encoder } from './src/helpers/encoder';

export default function App() {
  const [text, setText] = useState<string>('')
  const [encodedText, setEncodedText] = useState<string>('')
  const [decodedText, setDecodedText] = useState<string>('')
  const [binaryText, setBinaryText] = useState<string>('')
  const [strFromBinarytext, setStrFromBinarytext] = useState<string>('')

  let handleClear = () => {
    setText('')
    setEncodedText('')
    setDecodedText('')
    setBinaryText('')
    setStrFromBinarytext('')
  }

  let handleConvert = () => {
    if (text) {
      // encode the object into base64 string
      const encodedData = Base64Encoder.encode(text)
      // transform the encoded object into binary array
      const binaryData = Converter.stringToBinary(encodedData)
      // transform binary array into base64 string
      const strFromBinary = Converter.binaryToString(binaryData)
      // decode the base64 string
      const decodedData = Base64Encoder.decode(strFromBinary)

      //console.log('Original obj', text)
      //console.log('Encoded obj', encodedData)
      setEncodedText(encodedData)
      //console.log('Binary representation of the encoded obj', binaryData)
      setBinaryText(binaryData.join(''))
      //console.log('Binary array to string', strFromBinary)
      setStrFromBinarytext(strFromBinary)
      //console.log('Decoded obj', decodedData)
      setDecodedText(decodedData)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Piou Piou - Encode Test</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input}
          placeholder={'Enter your text here'}
          onChangeText={text => setText(text)}
          value={text} />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button onPress={handleConvert}
              title={"Run"} />
          </View>
          <View style={styles.button}>
            <Button onPress={handleClear}
              title={"Clear"} />
          </View>
        </View>
      </View>
      <ScrollView style={styles.displayContainer}>
        <Card title={'Encoded object'} content={encodedText}></Card>
        <Card title={'Binary representation of the encoded obj'} content={binaryText}></Card>
        <Card title={'Binary array to string'} content={strFromBinarytext}></Card>
        <Card title={'Decoded object'} content={decodedText}></Card>
        <Text></Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
  },
  title: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 25,
    color: '#2d3436'
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomColor: '#dfe6e9',
    borderBottomWidth: 2
  },
  buttonContainer: {
    width: '80%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: '45%',
    borderRadius: 4
  },
  displayContainer: {
    width: '100%',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  input: {
    height: 40,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#636e72',
    borderWidth: 2,
    borderRadius: 4,
    width: '80%',
    color: '#636e72'
  },
});
