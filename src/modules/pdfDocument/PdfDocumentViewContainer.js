// @flow
import { compose, lifecycle, withState } from 'recompose';

import PdfDocumentView from './PdfDocumentView';

export default compose(withState('isLoaded', 'setIsLoaded', false), lifecycle({}))(PdfDocumentView);
