---
title: "Deploy Angular app to Firebase hosting"
category: Tutorial
tags:
  - angular
  - firebase
  - hosting
  - deployment
  - javascript
comments: true
---

> Deploy Angular app to Firebase hosting

 Hosting an angular app on firebase is really easy. 
 
### Prerequisites:
  Node and angular-cli.
  
### Steps:
  To deploy and app:
  
1. Create Angular App, or use already created Angular App.
2. Create project in [Firebase console](https://console.firebase.google.com/).
    Your app's url name will be: `<project-id>.firebase-app.com`
3. Install Firebase tools. 
    In order to deploy to Firebase, we'll need the [Firebase CLI tools](https://github.com/firebase/firebase-tools)
    ```
    npm install -g firebase-tools
    ```
4. Login to Firebase
    ```
    firebase login
    ```
   This will open a browser tab, where you can login.
5. Initiliaze Firebase in your project.
    Go to your project folder and run this command:
     ```
     firebase init
     ```
     Follwo the steps: 
      1. Are you ready to proceed? **Yes**
      2. Which Firebase CLI features? **Hosting** (In the future, use whatever you need! Press space to select.)
      3. Select a default Firebase project? (Choose whatever app you created in the earlier steps)
      4. What do you want to use as your public directory? **dist** (This is important! Angular creates the dist folder.)
      5. Configure as a single-page app? **Yes**

     Once you initilize the app, two files will be created in the folder:
     ### .firebaserc 
     ```json
     {
        "projects": {
          "default": "project-id"
        }
     }
     ```

     ### .firebase.json
     ```json
     {
    "hosting": {
      "public": "dist",
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
         ]
       }
     }
     ```
6. Build Your Angular App
    ```
    ng build --prod
    ```
    This will build your angular application, where you will have a `dist` folder, inside this folder will be your `index.html` single page application. 
7. Deploy
    ```
    firebase deploy
    ```
    If everything went well, then your application will be deployed and you will see its url on the console.
    
    Buy me a cup of coffee with ETH: `0x681a83007bC52C0bF42B41263Dc498f9Ef7af02A` 
