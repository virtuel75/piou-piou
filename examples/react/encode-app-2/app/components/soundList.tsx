import React, { Component } from "react";
import { FlatList } from "react-native";
import SoundComponent from "./sound";
import { soundListStyles } from './soundList.styles';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface SoundListProps {
    filenames: string[],
    onDelete: () => void
}

export interface SoundListState {
    filenames: string[]
}

export default class SoundListComponent extends Component<SoundListProps, SoundListState> {

    private audio: Audio.Sound | null

    public constructor(props: SoundListProps) {
        super(props)

        this.state = {
            filenames: props.filenames
        }

        this.audio = null
    }

    public componentDidUpdate = (prevProps: SoundListProps) => {
        if (prevProps.filenames.length !== this.props.filenames.length) {
            this.setState({filenames: this.props.filenames})
        }
    }

    public _onPlay = (index: number) => {
        const fileUri: string = this.props.filenames[index]
        console.log('Playing song : ' + fileUri)
        this._playSong(fileUri)
    }

    public _onDelete = async (index: number) => {
        const fileUri: string = this.props.filenames[index]
        console.log('Deleting song : ' + fileUri)
        try {
            await FileSystem.deleteAsync(fileUri)
            this.props.onDelete()
        } catch (error) {

        }
    }

    private _unloadPlayer = async () => {
        if (this.audio != null) {
            await this.audio.unloadAsync()
            this.audio.setOnPlaybackStatusUpdate(null)
            this.audio = null
        }
    }

    private _playSong = async (fileUri: string) => {
        await this._unloadPlayer()
        this.audio = new Audio.Sound()

        try {
            const extension: string | undefined = fileUri.split('.').pop()
            if (extension && extension === 'wav') {
                await this.audio.loadAsync({ uri: fileUri })
                await this.audio.playAsync()
            } else {
                console.log('File is not a .wav')
            }
        } catch (error) {
            console.error(error)
        }
    }

    public render = () => {
        return (
            <FlatList style={soundListStyles.container}
                data={this.state.filenames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <SoundComponent filename={item}
                        onPlay={() => { this._onPlay(index) }}
                        onDelete={() => { this._onDelete(index) }} />}
            />
        )
    }
}