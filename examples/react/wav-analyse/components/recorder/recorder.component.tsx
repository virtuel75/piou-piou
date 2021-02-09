import React, { Component } from "react";
import { Button, View } from "react-native";
import { SoundRecorder } from "../../helpers/soundRecorder";
import { styles } from "./recorder.styles";

export interface RecorderProps {
    onStop?: (file: string) => void
}

export interface RecorderState {
    isRecording: boolean,
    disableButton: boolean
}

export default class RecorderComponent extends Component<RecorderProps, RecorderState> {

    public constructor(props: RecorderProps) {
        super(props)

        this.state = {
            isRecording: false,
            disableButton: false
        }

        SoundRecorder.init()
    }

    public toogleRecord = () => {
        this.setState({ disableButton: true })

        if (this.state.isRecording) {
            this.stopRecording()
        } else {
            this.startRecording()
        }
    }

    private startRecording = async () => {
        console.log('Recording started')
        this.setState({ isRecording: true })
        this.setState({ disableButton: false })

        SoundRecorder.start(null)
    }

    private stopRecording = async () => {
        console.log('Recording stopped')
        this.setState({ isRecording: false })
        this.setState({ disableButton: false })

        const uri = await SoundRecorder.stop()

        if (uri && this.props.onStop) {
            this.props.onStop(uri)
        }
    }

    public render = () => {
        return (
            <View style={styles.container}>
                <Button onPress={this.toogleRecord} title={this.state.isRecording ? "Stop" : "Record"} 
                    disabled={this.state.disableButton} />
            </View>
        )
    }
}