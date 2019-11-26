import React, { Component } from 'react'
import {
    View,
    NativeModules
} from 'react-native'
import { connect } from 'react-redux'
import { authorize } from 'react-native-app-auth';

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

        this.state = {
            clientId: config.AUTH_CLIENT_ID,
            clientSecret: config.AUTH_CLIENT_SECRET,
            authorizationEndpoint: config.AUTHORIZATION_ENDPOINT,
            tokenEndpoint: config.TOKEN_ENDPOINT,
            redirectUrl: 'alpacamobile://oauth',
            responseType: 'code',
            grantType: 'authorization_code',
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fetching && !nextProps.fetching) {
            this.props.navigation.navigate('Tab')
        }
    }

    exchangeToken = (url) => {
        const { redirectUrl, grantType } = this.state;
        const code = this.getCode(url);

        const config = `grant_type=${grantType}&redirect_uri=${redirectUrl}&code=${code}`;
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
            this.exchangeToken(url);
        })
        .catch((error) => {
            console.log('native auth error:', error);
        });
    }

    render() {
        return (
            <View style={styles.mainContainer}>
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
    button: {
        marginTop: size(300),
    },
}

const mapStateToProps = (state) => ({
    fetching: state.app.fetching
})

const mapDispatchToProps = dispatch => ({
    appStartAttempt: data => dispatch(AppActions.appStartAttempt(data)),
    alpacaExchangeToken: data => dispatch(AppActions.exchangeTokenAttempt(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
