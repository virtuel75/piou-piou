import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { styles } from './App.styles';
import Recorder from './helpers/recorder';

export interface AppProps { }

export interface AppState {
  log: string,
  canPlaySound: boolean
}

export default class App extends Component<AppProps, AppState> {
  private recorder: Recorder
  private sound: Audio.Sound | null

  constructor(props: AppProps) {
    super(props)

    this.state = {
      log: 'Application test for sound',
      canPlaySound: false
    }

    this.sound = null
    this.recorder = new Recorder()
  }

  private handleRecord = async () => {
    try {
      console.log("Recording...")
      this.setState({log: 'Recording...', canPlaySound: false})
      this.recorder.startRecording()
    } catch (e) {
      console.error(e)
    }
  }

  private handleStop = async () => {
    console.log("Stoping...")
    this.setState({log: 'Stoping...'})
    const sound = await this.recorder.stopRecording()
    if (sound) {
      this.setState({log: 'Done !', canPlaySound: true})
      this.sound = sound
    }
  }

  private playSound = async () => {
    if (this.sound) {
      console.log("Playing sound")
      this.setState({canPlaySound: false})
      await this.sound.playAsync()
      this.setState({canPlaySound: true})
    }
  }

  render = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.log}</Text>
        <View style={styles.button}>
          <Button title={'Record'} onPress={this.handleRecord} />
        </View>
        <View style={styles.button}>
          <Button title={'Stop'} onPress={this.handleStop} />
        </View>
        <View style={styles.playButton}>
          <Button title={'Play sound'} onPress={this.playSound} disabled={!this.state.canPlaySound} />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
}