import { StyleSheet } from "react-native";

export const selectDataStyles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    selectionContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    selectionButton: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#ffeaa7'        
    },
    selectionButtonTitle: {
        marginTop: 6,
        fontSize: 17,
        color: '#636e72'
    }
});