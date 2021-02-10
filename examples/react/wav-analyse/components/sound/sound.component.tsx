import React, { Component } from "react";
import { Button, Text, View } from "react-native";
import { SoundPlayer } from "../../helpers/soundPlayer";
import { SoundStorage } from "../../helpers/soundStorage";
import { WAV } from "../../helpers/WAV";
import { styles } from "./sound.styles";

export interface SoundProps {
    file: string,
    onDelete?: (file: string) => void
}

export interface SoundState {
    file?: string,
    disableAction: boolean
}

export default class SoundComponent extends Component<SoundProps, SoundState> {

    public constructor(props: SoundProps) {
        super(props)

        this.state = {
            file: 'loading file...',
            disableAction: false
        }
    }

    public componentDidMount = () => {
        this.readFile()
    }

    private readFile = async () => {
        const fileUri: string = this.props.file
        const filename: string | undefined = fileUri.split('/').pop()

        this.setState({ file: filename })
    }

    private play = async () => {
        await SoundPlayer.play(this.props.file)
    }

    private delete = async () => {
        if (this.props.onDelete)
            this.props.onDelete(this.props.file)
    }

    private analyse = async () => {
        this.setState({ disableAction: true })

        console.log('Analysing')
        const bytes = await SoundStorage.read(this.props.file)

        const wav = WAV.decode(bytes)
        console.log('WAV content', wav)

        this.setState({ disableAction: false })
    }

    public render = () => {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.state.file}</Text>
                <View style={styles.actionsContainer}>
                    <Button onPress={this.play} title='Play' disabled={this.state.disableAction} color="#ececec" />
                    <Button onPress={this.analyse} title='Analyse' disabled={this.state.disableAction} color="#ececec" />
                    <Button onPress={this.delete} title='Delete' disabled={this.state.disableAction} color="#ececec" />
                </View>
            </View>
        )
    }
}