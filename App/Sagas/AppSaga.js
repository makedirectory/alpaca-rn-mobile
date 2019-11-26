import { call, put } from 'redux-saga/effects'
import AppActions from '../Redux/AppRedux'

export function* appStartAttempt(api, action) {
    const { apiKey, secretKey, baseUrl } = action.data
    api.setBaseURL(baseUrl)
    api.setHeaders(apiKey, secretKey)
}

export function* exchangeTokenAttempt(api, action) {
    try {
        const response = yield call(api.alpacaExchangeToken, action.data)
        console.log(12212, response)
        if (response.ok) {
            const { access_token } = response.data
            api.setHeaders(access_token)
            yield put(AppActions.exchangeTokenSuccess(access_token))
        } else {
            const message = response.data.message || 'Something went wrong'
            yield put(AppActions.exchangeTokenFailure(message))
        }
    } catch (error) {
        yield put(AppActions.exchangeTokenFailure(error.message))
    }
}
