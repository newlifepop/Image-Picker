import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';

const PHOTOS_PER_LINE = 4;
const MARGIN = 4;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_WIDTH = (SCREEN_WIDTH - (PHOTOS_PER_LINE + 1) * MARGIN) / PHOTOS_PER_LINE;
const PHOTO_HEIGHT = PHOTO_WIDTH;

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImages = async (photos) => {
    const ref = firebase.storage().ref('test_pictures');
    let photoBlob = null;

    for (var i = 0; i < photos.length; ++i) {
        let imageFile = RNFetchBlob.wrap(photos[i]);
        await Blob.build(imageFile, { type: 'image/jpg;' })
            .then((blob) => {
                photoBlob = blob;
                return ref.child(`${i}`).put(blob, { contentType: 'image/jpg' });
            })
            .then(() => {
                photoBlob.close();
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: []
        };

        this.renderPhotos = this.renderPhotos.bind(this);
        this.renderLine = this.renderLine.bind(this);
        this.renderLinePhotos = this.renderLinePhotos.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ photos: nextProps.photos });
    }

    renderPhotos() {
        const line = Array.from(Array(Math.ceil(this.state.photos.length / PHOTOS_PER_LINE)).keys());
        return line.map((value, index) => {
            return this.renderLine(index);
        });
    }

    renderLine(line) {
        const photos = this.state.photos.slice(line * PHOTOS_PER_LINE, (line + 1) * PHOTOS_PER_LINE);

        return (
            <View
                key={line}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                {this.renderLinePhotos(photos)}
            </View>
        );
    }

    renderLinePhotos(photos) {
        return photos.map((value, index) => {
            return (
                <Image
                    key={index}
                    source={{ uri: value }}
                    style={{
                        width: PHOTO_WIDTH,
                        height: PHOTO_HEIGHT,
                        margin: MARGIN / 2,
                        backgroundColor: '#F0F0F0'
                    }}
                />
            );
        });
    }

    render() {
        const headerLeft = (
            <Icon
                name='add-a-photo'
                size={28}
                color='black'
                underlayColor='rgba(0, 0, 0, 0)'
                onPress={() => this.props.navigation.navigate('pickImage')}
            />
        );

        const headerCenter = (
            <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                Home
            </Text>
        );

        const headerRight = (
            <Icon
                name='backup'
                size={28}
                color='black'
                underlayColor='rgba(0, 0, 0, 0)'
                onPress={() => uploadImages(this.state.photos)}
            />
        );

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    outerContainerStyles={{ backgroundColor: 'white' }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <ScrollView
                    style={{
                        flex: 1,
                        marginTop: MARGIN
                    }}
                >
                    {this.renderPhotos()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { photos } = state.images;
    return { photos };
};

export default connect(mapStateToProps, null)(MainScreen);