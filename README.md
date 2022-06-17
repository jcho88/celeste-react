## Run the app locally

Run `expo start`

## Build the app for internal distribution

-   Bump the build number in `app.json`
-   Run `eas build --profile preview --platform ios`

## Troubleshooting

-   Getting errors with openSSL? Run `export NODE_OPTIONS=--openssl-legacy-provider`. See [source](https://www.bswen.com/2021/11/reactjs-ERR_OSSL_EVP_UNSUPPORTED_error_solution.html).
-   Can't get expo to recognize XCode? See [here](https://developer.apple.com/forums/thread/678469).
