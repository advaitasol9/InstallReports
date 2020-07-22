
export default class HttpErrorHandler {

    static generateErrorMessage(error, specificErrors = {}) {
        var errorMessage = {
            title: '',
            message: '',
            curl: '',
            statusText: '',
            status: '',
            action: ''
        };

        var customMessages = {
            400: { title: 'Bad Request', message: 'Unprocessable request.' },
            401: { title: 'Unauthorized', message: 'You are not authorized.' },
            403: { title: 'Forbidden', message: 'Action unauthorized.' },
            404: { title: 'Not Found', message: 'Data does not exists.' },
            429: { title: 'Too Many Requests', message: 'Too many requests to server.' },
        };

        if (specificErrors[error[0].status]) {
            errorMessage.title = specificErrors[error[0].status].title;
            errorMessage.message = specificErrors[error[0].status].message;
        } else if (customMessages[error[0].status]) {
            errorMessage.title = customMessages[error[0].status].title;
            errorMessage.message = customMessages[error[0].status].message;
        } else {
            errorMessage.title = 'Something Went Wrong';
            errorMessage.message = 'Something seems to be broken. We are working on it.';
        }

        errorMessage.curl = error[1];
        errorMessage.statusText = error[0].statusText;
        errorMessage.status = error[0].status;
        errorMessage.action = error[2];

        return errorMessage;
    }

}