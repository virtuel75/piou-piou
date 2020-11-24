import { StyleSheet } from "react-native";

export const soundStyles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row'
    },
    soundInfoContainer: {
        width: '65%',
    },
    soundActionContainer: {
        width: '35%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    filename: {
        color: '#2d3436',
        marginBottom: 4,
        fontSize: 18
    },
    duration: {
        color: '#636e72'
    },
    actionButton: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});