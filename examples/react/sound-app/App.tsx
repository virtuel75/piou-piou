import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { styles } from './App.styles';
import Recorder from './helpers/recorder';
import * as FileSystem from 'expo-file-system';

export interface AppProps { }

export interface AppState {
  log: string,
  canPlaySound: boolean,
  soundSize: number,
  soundUnitSize: string,
  soundName: string,
  canRecord: boolean,
}

export default class App extends Component<AppProps, AppState> {
  private recorder: Recorder
  private sound: Audio.Sound | null

  constructor(props: AppProps) {
    super(props)

    this.state = {
      log: 'Application test for sound',
      canPlaySound: false,
      soundSize: 0,
      soundUnitSize: 'bytes',
      soundName: '',
      canRecord: true
    }

    this.sound = null
    this.recorder = new Recorder()
  }

  private playback = (status: any) => {
    this.setState({ canPlaySound: !(status?.isPlaying as boolean) || false })
  }

  private updateAudioSize = (size: number | null | undefined) => {
    if (!size) {
      this.setState({ soundSize: 0 })
    } else {
      let tmp: number = 0
      let unit: string = ''
      if (size.toString().length > 6) {
        tmp = size / Math.pow(10, 6)
        unit = 'Mb'
      } else if (size.toString().length > 3) {
        tmp = size / Math.pow(10, 3)
        unit = 'Kb'
      } else {
        tmp = size
        unit = 'bytes'
      }
      this.setState({ soundSize: tmp, soundUnitSize: unit })
    }
  }

  private updateAudioName = (name: string | null | undefined) => {
    if (!name) {
      this.setState({ soundName: "" })
    } else {
      this.setState({ soundName: name })
    }
  }

  private onRecordUpdate = (status: Audio.RecordingStatus) => {
    if (status.isDoneRecording) {
      this.setState({ canRecord: true })
    }
  }

  private handleRecord = async () => {
    try {
      console.log("Recording...")
      this.setState({ log: 'Recording...', canPlaySound: false, canRecord: false })
      await this.recorder.startRecording(this.onRecordUpdate)
    } catch (error) {
      console.error(error)
      this.setState({ log: 'Error while start recording' })
    }
  }

  private handleStop = async () => {
    try {
      console.log("Stoping...")
      this.setState({ log: 'Stoping...' })
      const result = await this.recorder.stopRecording()
      if (result) {
        this.setState({ log: 'Done !', canPlaySound: true })
        const fileInfo = await FileSystem.getInfoAsync(result.recordURI ?? "")
        const fileName = fileInfo.uri.split('/').reverse()[0]
        console.log(`FILE INFO: ${JSON.stringify(fileInfo)}`)
        this.updateAudioSize(fileInfo.size)
        this.updateAudioName(fileName)
        if (this.sound !== null) {
          await this.sound.unloadAsync()
          this.sound.setOnPlaybackStatusUpdate(null)
          this.sound = null
        }
        this.sound = result.sound
        this.sound.setOnPlaybackStatusUpdate(this.playback)
      }
    } catch (error) {
      console.error(error)
      this.setState({ log: 'Error while stop recording' })
    }
  }

  private playSound = async () => {
    if (this.sound) {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false
      })
      console.log("Playing sound")
      await this.sound.setPositionAsync(0)
      await this.sound.playAsync()
    }
  }

  render = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.log}</Text>
        <View style={styles.button}>
          <Button title={'Record'} onPress={this.handleRecord} disabled={!this.state.canRecord} />
        </View>
        <View style={styles.button}>
          <Button title={'Stop'} onPress={this.handleStop} />
        </View>
        <View style={styles.playButton}>
          <Button title={'Play sound'} onPress={this.playSound} disabled={!this.state.canPlaySound} />
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Size: {this.state.soundSize} {this.state.soundUnitSize}</Text>
          <Text style={{ textAlign: 'center' }}>Name: {this.state.soundName}</Text>
        </View>
        <StatusBar style="dark" />
      </View>
    );
  }
}