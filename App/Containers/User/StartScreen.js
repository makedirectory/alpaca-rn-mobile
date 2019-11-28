import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    NativeModules
} from 'react-native'
import { connect } from 'react-redux'
import { authorize } from 'react-native-app-auth';
import RNPickerSelect from 'react-native-picker-select'

import AppActions from '../../Redux/AppRedux'
import {
    ApplicationStyles,
    Colors,
    Fonts
} from '../../Themes'
import { size } from '../../Util/Helper'
import Button from '../../Components/Button'
import config from '../../config';
import Loading from '../../Components/Loading';

class StartScreen extends Component {

    constructor(props) {
        super(props)

        this.inputRefs = {}
        this.state = {
            clientId: config.AUTH_CLIENT_ID,
            clientSecret: config.AUTH_CLIENT_SECRET,
            authorizationEndpoint: config.AUTHORIZATION_ENDPOINT,
            tokenEndpoint: config.TOKEN_ENDPOINT,
            redirectUrl: 'alpacamobile://oauth',
            responseType: 'code',
            grantType: 'authorization_code',
            baseUrl: config.BASE_URL,
            baseUrlItems: [
                {
                    label: 'https://api.alpaca.markets/',
                    value: 'https://api.alpaca.markets/',
                },
                {
                    label: config.BASE_URL,
                    value: config.BASE_URL,
                },
            ],
        }
    }

    async componentDidMount() {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const baseUrl = await AsyncStorage.getItem('baseUrl');
        if (accessToken) {
            const data = {
                baseUrl,
                accessToken,
            };
            this.props.appStartAttempt(data);
            this.props.navigation.navigate('Tab');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fetching && !nextProps.fetching) {
            this.props.navigation.navigate('Tab')
        }
    }

    exchangeToken = (url) => {
        const { redirectUrl, grantType, baseUrl } = this.state;
        const code = this.getCode(url);

        const data = {
            baseUrl,
        };
        const config = `grant_type=${grantType}&redirect_uri=${redirectUrl}&code=${code}`;

        AsyncStorage.setItem('baseUrl', baseUrl);
        this.props.appStartAttempt(data);
        this.props.alpacaExchangeToken(config);
    }

    getCode = (url) => {
        let codeIndex = url.indexOf('code');
        let code = url.slice(codeIndex + 5);
        return code
    }

    getStarted = async () => {
        const { clientId, clientSecret, authorizationEndpoint, redirectUrl, responseType, tokenEndpoint } = this.state;
        // const config = {
        //     issuer: authorizationEndpoint,
        //     clientId,
        //     // clientSecret,
        //     redirectUrl,
        //     serviceConfiguration: {
        //         authorizationEndpoint,
        //         // tokenEndpoint,
        //     },
        // };

        // try {
        //     const result = await authorize(config);
        //     console.log('auth result', result);
        // } catch (error) {
        //     console.log('auth error', error);
        // }
        let webOAuthUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}`;
        NativeModules.AlpacaOAuth.AuthStart(webOAuthUrl).then(url => {
            console.log('auth result', url);
            if (url) {
                this.exchangeToken(url);
            }
        })
        .catch((error) => {
            console.log('native auth error:', error);
        });
    }

    render() {
        const { baseUrl, baseUrlItems } = this.state
        return (
            <View style={styles.mainContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>
                        BASE_URL
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: '',
                            value: null,
                            color: Colors.COLOR_GOLD,
                        }}
                        items={baseUrlItems}
                        onValueChange={(value) => {
                            this.setState({
                                baseUrl: value,
                            })
                        }}
                        style={pickerSelectStyles}
                        useNativeAndroidPickerStyle={false}
                        value={baseUrl}
                        ref={(el) => {
                            this.inputRefs.picker = el
                        }}
                    />
                </View>
                <Button
                    style={styles.button}
                    label="Get Started"
                    color={Colors.COLOR_NAV_HEADER}
                    labelColor={Colors.WHITE}
                    height={50}
                    onPress={this.getStarted}
                />
                {this.props.fetching && <Loading />}
            </View>
        )
    }
}

const styles = {
    ...ApplicationStyles.screen,
    rowContainer: {
        flexDirection: 'column',
        marginTop: size(150)
    },
    button: {
        marginTop: size(100),
    },
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: null,
        fontSize: size(16),
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: Colors.COLOR_GOLD,
        borderBottomWidth: 1,
        backgroundColor: 'white',
        color: Colors.COLOR_GOLD,
    },
    inputAndroid: {
        fontSize: size(16),
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: Colors.COLOR_GOLD,
        borderBottomWidth: 1,
        backgroundColor: 'white',
        color: Colors.COLOR_GOLD,
    },
})

const mapStateToProps = (state) => ({
    fetching: state.app.fetching
})

const mapDispatchToProps = dispatch => ({
    appStartAttempt: data => dispatch(AppActions.appStartAttempt(data)),
    alpacaExchangeToken: data => dispatch(AppActions.exchangeTokenAttempt(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
