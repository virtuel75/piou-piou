import React, { Component } from "react";
import { View, Text } from "react-native";

import { styles } from "./cardStyles";

export interface CardProps {
    title: string,
    content: string
}

export default class Card extends Component<CardProps> {
    constructor(props: CardProps) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    <Text style={styles.title}>{this.props.title} : </Text>
                    <Text>{this.props.content}</Text>
                </Text>
            </View>
        )
    }

}