import { Audio, AVPlaybackStatus  } from 'expo-av';
import * as Permissions from "expo-permissions";

export interface RecordResult {
    recordURI: string | null,
    sound: Audio.Sound,
    status: AVPlaybackStatus
}

export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: Audio.RecordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
};

class Recorder {
    private _haveRecordingPermissions: boolean
    private _recording: Audio.Recording | null
    private readonly _recordingOptions: Audio.RecordingOptions 

    

    private audioMode: Partial<Audio.AudioMode> | null

    public constructor() {
        this._haveRecordingPermissions = false
        this._recording = null
        this._recordingOptions = RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        this.audioMode = null

        this._setAudioMode()
        this._askRecordingPermissions()
    }

    private _askRecordingPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        this._haveRecordingPermissions = response.status === "granted"
    }

    private _setAudioMode = () => {
        this.audioMode = {
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false,
        }
    }

    private _resetRecording = async () => {
        if (this._recording) {
            const status = await this._recording.getStatusAsync()
            if (!status.isRecording) {
                this._recording.setOnRecordingStatusUpdate(null)
                this._recording = null
            } else {
                console.warn('Cannot reset the recording yet. It is still working')
            }
        }
    }

    public startRecording = async (statusUpdate: ((status: Audio.RecordingStatus) => void) | null) => {
        if (!this._recording) {
            if (this._haveRecordingPermissions && this.audioMode) {
                await Audio.setAudioModeAsync(this.audioMode)
                this._recording = new Audio.Recording()
                try {
                    await this._recording.prepareToRecordAsync(this._recordingOptions)
                    this._recording.setOnRecordingStatusUpdate(statusUpdate)
                    await this._recording.startAsync()
                } catch (error) {
                    console.error('Error during recording', error)
                    await this._resetRecording()
                }
            } else {
                console.warn('No permission to record')
                await this._askRecordingPermissions()
            }
        } else {
            console.warn('Cannot start recording. The main recorder is working')
        }
    }

    public stopRecording = async () => {
        if (this._recording) {
            try {
                await this._recording.stopAndUnloadAsync()
                const recordURI = this._recording.getURI()
                const { sound, status } = await this._recording.createNewLoadedSoundAsync()
                const result: RecordResult = {
                    recordURI: recordURI,
                    sound: sound,
                    status: status
                }
                await this._resetRecording()
                return result
            } catch (error) {
                console.error('Error while stopping the recording', error)
                await this._resetRecording()
            }
        } else {
            console.warn('Cannot stop the recording because it has no been started yet')
        }
    }
}

export default Recorder