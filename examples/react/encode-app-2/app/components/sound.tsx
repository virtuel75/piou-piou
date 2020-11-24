import React, { Component } from "react";
import { View, Text } from "react-native";
import { soundStyles } from "./sound.styles";
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

export interface SoundFile {
    name: string,
    size?: number
}

export interface SoundProps {
    filename: string,
    onPlay?: () => void,
    onDelete?: () => void
}

export interface SoundState {
    fileLoaded: boolean,
    file?: SoundFile
}

export default class SoundComponent extends Component<SoundProps, SoundState> {

    public constructor(props: SoundProps) {
        super(props)

        this.state = {
            fileLoaded: false
        }

        this._readFile()
    }

    public componentDidUpdate = (prevProps: SoundProps) => {
        if (prevProps.filename !== this.props.filename) {
            this._readFile()
        }
    }

    private _readFile = async () => {
        const fileUri = this.props.filename
        try {
            const info = await FileSystem.getInfoAsync(fileUri)

            const filename: string | undefined = info.uri.split('/').pop()

            let result: SoundFile = {
                name: filename ?? 'unknown',
                size: (info.size ?? 0) / 1000
            }

            this.setState({file: result})
            this.setState({fileLoaded: true})
        } catch (error) {
            console.error(error)
        }
    }

    private _onPlay = () => {
        if (this.props.onPlay != undefined) {
            this.props.onPlay()
        }
    }

    private _onDelete = () => {
        if (this.props.onDelete != undefined) {
            this.props.onDelete()
        }
    }

    public render = () => {
        return (
            <View style={soundStyles.container}>
                <View style={soundStyles.soundInfoContainer}>
                    <Text style={soundStyles.filename}>{this.state.file?.name}</Text>
                    <Text style={soundStyles.duration}>Size : {this.state.file?.size ?? 0} Kb</Text>
                </View>
                <View style={soundStyles.soundActionContainer}>
                    <FontAwesome.Button style={soundStyles.actionButton}
                        name="play"
                        color="#0984e3"
                        onPress={this._onPlay}
                        disabled={!this.state.fileLoaded} />
                    <FontAwesome.Button style={soundStyles.actionButton}
                        name="trash-o"
                        color="red"
                        onPress={this._onDelete}
                        disabled={!this.state.fileLoaded} />
                </View>
            </View>
        )
    }
}