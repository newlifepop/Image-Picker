import React, { PureComponent } from 'react';
import { View, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

const PHOTOS_PER_LINE = 4;
const MARGIN = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_WIDTH = (SCREEN_WIDTH - (PHOTOS_PER_LINE + 1) * MARGIN) / PHOTOS_PER_LINE;
const PHOTO_HEIGHT = PHOTO_WIDTH;

/*
required: uri, onSelectPhoto
optional: none
*/
class PhotoPick extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            uri: '',
            selected: false
        };

        this.onSelect = this.onSelect.bind(this);
    }

    componentWillMount() {
        this.setState({ uri: this.props.uri });
    }

    onSelect() {
        const { selected, uri } = this.state;
        this.setState({ selected: !selected });
        this.props.onSelectPhoto(!selected, uri);
    }

    render() {
        const { selected, uri } = this.state;

        return (
            <View>
                <TouchableWithoutFeedback onPress={this.onSelect}>
                    <Image
                        source={{ uri: uri }}
                        style={{
                            width: PHOTO_WIDTH,
                            height: PHOTO_HEIGHT,
                            marginBottom: MARGIN,
                            backgroundColor: '#F0F0F0'
                        }}
                    />
                </TouchableWithoutFeedback>
                <Icon
                    name='done'
                    color={selected ? 'white' : '#4099FF'}
                    size={18}
                    containerStyle={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        borderWidth: 1,
                        borderColor: '#4099FF',
                        backgroundColor: selected ? '#4099FF' : 'rgba(0, 0, 0, 0)',
                        borderRadius: 100,
                    }}
                />
            </View>
        );
    }
}

export { PhotoPick };