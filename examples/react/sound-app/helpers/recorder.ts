import { Audio } from 'expo-av';
import * as Permissions from "expo-permissions";
import * as FileSystem from 'expo-file-system';

class Recorder {
    private haveRecordingPermissions: boolean
    private isRecording: boolean
    private recording: Audio.Recording | null
    private sound: Audio.Sound | null
    private readonly recordingSettings: Audio.RecordingOptions

    private readonly audioMode: Partial<Audio.AudioMode> = {
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
    }

    public constructor() {
        this.haveRecordingPermissions = false
        this.isRecording = false

        this.recording = null
        this.sound = null

        this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY

        this._askRecordingPermissions()
    }

    private _askRecordingPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        this.haveRecordingPermissions = response.status === "granted"
    }

    public startRecording = async (statusUpdate?: (status: Audio.RecordingStatus) => void) => {
        if (!statusUpdate) {
            statusUpdate = () => { }
        }
        // check if we have the permission to record
        if (this.haveRecordingPermissions) {
            // check that we are not already recording
            if (!this.isRecording) {
                // we need to empty the sound before recording
                if (this.sound !== null) {
                    await this.sound.unloadAsync()
                    this.sound.setOnPlaybackStatusUpdate(null)
                    this.sound = null
                }
                // set the audio mode
                await Audio.setAudioModeAsync(this.audioMode)
                // we need to empty the recorder before recording
                if (this.recording !== null) {
                    this.recording.setOnRecordingStatusUpdate(null)
                    this.recording = null
                }
                // set the recording
                const recording = new Audio.Recording()
                await recording.prepareToRecordAsync(this.recordingSettings)
                recording.setOnRecordingStatusUpdate(statusUpdate)
                // start recording
                this.isRecording = true
                this.recording = recording
                await this.recording.startAsync()
            }
        } else {
            console.log('No permission to record')
            await this._askRecordingPermissions()
        }
    }

    public stopRecording = async () => {
        // check that the recorder is not in use
        if (!this.recording) {
            return null
        }
        try {
            // try to stop the recorder
            await this.recording.stopAndUnloadAsync()
            // get the file info
            const info = await FileSystem.getInfoAsync(this.recording.getURI() || "")
            console.log(`FILE INFO: ${JSON.stringify(info)}`)
            // set the audio mode
            await Audio.setAudioModeAsync(this.audioMode)
            // retrieve the sound
            const { sound, status } = await this.recording.createNewLoadedSoundAsync()
            this.sound = sound
            this.isRecording = false
            return this.sound
        } catch (error) {
            if (error.code === "E_AUDIO_NODATA") {
                console.log(`Stop was called too quickly, no data has yet been received (${error.message})`)
            } else {
                console.log("STOP ERROR: ", error.code, error.name, error.message)
            }
            return null
        }
    }
}

export default Recorder