import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
    },
    title: {
        marginBottom: 20,
        fontSize: 20
    },
    selectionContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        borderBottomColor: '#dfe6e9',
        borderBottomWidth: 2
    },
    selectionInfo: {
        marginTop: 10,
        marginBottom: 10
    },
    actionButtonContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});