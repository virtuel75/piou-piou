import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#020202',
        alignItems: 'center',
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
    },
    listContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#131313',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    listInfo: {
        marginBottom: 20,
        color: '#b6b6b6'
    }
})