import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaView, View, Text, FlatList } from 'react-native';
import { styles } from "./App.styles";
import RecorderComponent from './components/recorder/recorder.component';
import SoundComponent from './components/sound/sound.component';
import { SoundStorage } from "./helpers/soundStorage";

export interface AppState {
	files: string[]
}

export default class App extends Component<any, AppState> {

	public constructor(props: any) {
		super(props)

		this.state = {
			files: []
		}
	}

	public componentDidMount = () => {
		this.updateSoundList()
	}

	private updateSoundList = async () => {
		let files: string[] = await SoundStorage.getFiles()
		this.setState({ files: files })
	}

	private onRecordEnd = async (file: string) => {
		this.setState({ files: [file, ...this.state.files] })
	}

	private onDeleteFile = async (file: string) => {
		await SoundStorage.delete(file)
		await this.updateSoundList()
	}

	public render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar style="light" />
				<RecorderComponent onStop={this.onRecordEnd}></RecorderComponent>
				<View style={styles.listContainer}>
					<Text style={styles.listInfo}>
						Number of file: {this.state.files.length}
					</Text>
					<FlatList
						data={this.state.files}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) =>
							<SoundComponent file={item} onDelete={this.onDeleteFile} />}
					/>
				</View>
			</SafeAreaView>
		)
	}
}