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
    file?: string
}

export default class SoundComponent extends Component<SoundProps, SoundState> {

    public constructor(props: SoundProps) {
        super(props)

        this.state = {
            file: 'loading file...'
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
        console.log('Analysing')
        const bytes = await SoundStorage.read(this.props.file)

        const wav = WAV.decode(bytes)
        console.log('WAV content', wav)
    }

    public render = () => {
        return (
            <View style={styles.container}>
                <Text>{this.state.file}</Text>
                <View style={styles.actionsContainer}>
                    <Button onPress={this.play} title='Play' />
                    <Button onPress={this.analyse} title='Analyse' />
                    <Button onPress={this.delete} title='Delete' />
                </View>
            </View>
        )
    }
}