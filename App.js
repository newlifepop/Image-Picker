import React, { Component } from 'react';
import { View, CameraRoll } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import firebase from 'firebase';

import store from './store';

import MainScreen from './screens/MainScreen';
import PickImageScreen from './screens/PickImageScreen';

class App extends Component {
    async componentWillMount() {
        const config = {
            apiKey: 'AIzaSyBTXrVm8r6mAmh8mwG4_bu8EE6beQ7bCB4',
            authDomain: 'nearbie-182205.firebaseapp.com',
            databaseURL: 'https://nearbie-182205.firebaseio.com',
            projectId: 'nearbie-182205',
            storageBucket: 'nearbie-182205.appspot.com',
            messagingSenderId: '484584154034'
        };
        await firebase.initializeApp(config);

        console.ignoredYellowBox = [
            'Remote debugger',
            'Warning: Overriding previous',
            'Warning: GooglePlacesAutocomplete'
        ];
    }

    componentDidMount() {
        firebase.auth().signInWithEmailAndPassword('new3711@gmail.com', '1newlifepop');
    }

    render() {
        const MainNavigator = StackNavigator({
            main: { screen: MainScreen },
            pickImage: { screen: PickImageScreen }
        }, { headerMode: 'none', mode: 'modal' });

        return (
            <Provider store={store}>
                <MainNavigator />
            </Provider>
        );
    }
}

export default App;