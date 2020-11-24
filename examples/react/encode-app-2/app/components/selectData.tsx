import React, { Component } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { selectDataStyles } from "./selectData.styles";
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Base64 } from "../helpers/base64";

export interface SelectDataProps {
    onSelectData?: (base64: string) => void
}

export default class SelectDataComponent extends Component<SelectDataProps, any> {

    public constructor(props: SelectDataProps) {
        super(props)

        this.state = {}
    }

    private _selectText = () => {
        Alert.prompt("Message", "Enter your message", (text: string) => {
            this._createData('string', text)
        })
    }

    private _selectFile = async () => {
        let file = await DocumentPicker.getDocumentAsync()
        if (file) {
            const uri: string = (file as any).uri
            const base64 = await this._reafFile(uri)

            if (base64) {
                this._createData('base64', base64)
            }
        }
    }

    private _selectPhoto = async () => {
        let file = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All
        })
        if (file && !file.cancelled) {
            const uri: string = (file as any).uri
            const base64 = await this._reafFile(uri)

            if (base64) {
                this._createData('base64', base64)
            }
        }
    }

    private _reafFile = async (uri: string) => {
        if (uri) {
            const content = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
            return content
        }
    }

    private _createData = (type: string, data: any) => {
        let obj = { type: type, data: data }
        const json = JSON.stringify(obj)
        const encodedUri = encodeURI(json)
        const base64 = Base64.encode(encodedUri)
        if (this.props.onSelectData != undefined) {
            this.props.onSelectData(base64)
        }
    }

    public render = () => {
        return (
            <View style={selectDataStyles.container}>
                <View style={selectDataStyles.selectionContainer}>
                    <TouchableOpacity style={selectDataStyles.selectionButton} onPress={this._selectText}>
                        <MaterialIcons name="text-format" size={24} color="black" />
                        <Text style={selectDataStyles.selectionButtonTitle}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={selectDataStyles.selectionButton} onPress={this._selectFile}>
                        <MaterialIcons name="insert-drive-file" size={24} color="black" />
                        <Text style={selectDataStyles.selectionButtonTitle}>File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={selectDataStyles.selectionButton} onPress={this._selectPhoto}>
                        <MaterialIcons name="photo-camera" size={24} color="black" />
                        <Text style={selectDataStyles.selectionButtonTitle}>Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}