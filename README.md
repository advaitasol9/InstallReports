
  

# Installer Mobile App 🚀

  

  

*This mobile app is built using [React Native Starter v1 branch](https://github.com/flatlogic/react-native-starter/tree/v1)*

  

  

- Staging REST API path - http://142.93.1.107:`<port>`/test-app-1

  

- Production REST API path- https://api.installreports.com/ir

  

  

## How to run the android app on a development device.

  

  

1. Clone the project from Github.

  

2. Navigate to project root and copy “env.js.dist” as “env.js” and fill the “API_PATH”. Make sure to not add an ending slash in the URL.

  

```javascript

export const API_PATH = 'http://142.93.1.107:<port>/api/test-app-1';

```

  

3. Checkout to the latest `dev` branch.

  

4. Open terminal in project root and run `npm install`.

  

5. Connect testing device turning on USB Debugging.

  

6. Run `npx react-native run-android` to install the app into the device and the app will start on the device.

  

7. Close the terminal (Process).

  

8. Shake the device to access react native dev settings and enable “Live Reload” and “Hot Reload” features from the menu.

  

9. Open terminal in the project root directory and run `npm start`. This will start debugging bridge between device and development PC.

  

10. Press `F5` in Visual Studio Code to start debugging.

  

#### Demo Accounts

  

##### User

- Email : installer1@gmail.com

- Password : 111111

  

##### Admin

- Email : admin1@gmail.com

- Password : 111111

  

## How to build testing apk.

  

1. Open terminal in project root directory.

2. Run following command.

  

```console

foo@bar:~$ react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

```

3. Navigate in to `android` directory and run following command.


```{r,engine=''bash}

foo@bar:~$ ./gradlew assembleRelease

```