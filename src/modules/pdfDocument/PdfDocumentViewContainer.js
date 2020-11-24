// @flow
import { compose, lifecycle, withState, withHandlers } from 'recompose';

import PdfDocumentView from './PdfDocumentView';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

export default compose(
    connect(state => ({
        connectionStatus: state.app.isConnected
    })),
    withState('isLoaded', 'setIsLoaded', false),
     lifecycle({}))(PdfDocumentView);
