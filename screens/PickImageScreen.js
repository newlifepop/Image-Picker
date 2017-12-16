import React, { Component } from 'react';
import { CameraRoll, View, Dimensions, ScrollView, Image, Text } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';

import { PhotoPick } from '../components';

import { pickImage } from '../actions';

const PHOTOS_PER_LINE = 4;
const MARGIN = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_WIDTH = (SCREEN_WIDTH - (PHOTOS_PER_LINE + 1) * MARGIN) / PHOTOS_PER_LINE;
const PHOTO_HEIGHT = PHOTO_WIDTH;

class PickImageScreen extends Component {
    static navigationOptions = { gesturesEnabled: false };

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            selected: []
        };

        this.renderPhotos = this.renderPhotos.bind(this);
        this.renderLine = this.renderLine.bind(this);
        this.renderLinePhotos = this.renderLinePhotos.bind(this);
        this.onSelectPhoto = this.onSelectPhoto.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }

    componentWillMount() {
        CameraRoll.getPhotos({ first: Number.MAX_VALUE, assetType: 'Photos' })
            .then((photos) => {
                this.setState({ photos: photos.edges });
            })
            .catch(() => { });
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
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}
            >
                {this.renderLinePhotos(photos)}
            </View>
        );
    }

    renderLinePhotos(photos) {
        return photos.map((value, index) => {
            const uri = value.node.image.uri;

            return (
                <PhotoPick
                    key={index}
                    uri={uri}
                    onSelectPhoto={this.onSelectPhoto}
                />
            );
        });
    }

    onSelectPhoto(selected, uri) {
        let { selected: selectedPhotos } = this.state;
        
        if (selected) {
            selectedPhotos.push(uri);
        } else {
            _.pull(selectedPhotos, uri);
        }

        this.setState({ selected: selectedPhotos });
    }

    onComplete() {
        const { pickImage, navigation } = this.props;

        pickImage(this.state.selected);
        navigation.goBack();
    }

    render() {
        const headerLeft = (
            <Icon
                name='close'
                size={28}
                color='#4099FF'
                underlayColor='rgba(0, 0, 0, 0)'
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const headerCenter = (
            <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                All Photos
            </Text>
        );

        const headerRight = (
            <Icon
                name='done'
                size={28}
                color='#4099FF'
                underlayColor='rgba(0, 0, 0, 0)'
                onPress={this.onComplete}
            />
        );

        return (
            <View style={{ flex: 1 }}>
                <Header
                    outerContainerStyles={{ backgroundColor: 'black' }}
                    leftComponent={headerLeft}
                    centerComponent={headerCenter}
                    rightComponent={headerRight}
                />
                <ScrollView
                    style={{
                        flex: 1,
                        marginTop: MARGIN
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderPhotos()}
                </ScrollView>
            </View>
        );
    }
}

export default connect(null, { pickImage })(PickImageScreen);