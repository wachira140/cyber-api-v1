const BadRequestError = require('./bad-request')
const CustomApiError = require('./custom-api-error')
const NotFoundError = require('./not-found')
const UnAuthorized = require('./unAuthorized')

module.exports = {
    BadRequestError,
    CustomApiError,
    NotFoundError,
    UnAuthorized,
}