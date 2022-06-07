# React website for github-repo-visualization.      

## a quick try on the build
https://gitvisual-7d9a8.web.app

## How to run in dev mode 

1. go to client/src/firebase/firebase.js, replace credentials with your own firebase credentials.
   (make sure firestore is enabled)
   (make sure firebase github auth is enabled ( ref https://firebase.google.com/docs/auth/web/github-auth ), firebase will specify the callback url that YOU HAVE TO SET IN GITHUB OAUTH APP )


2. if u dont use docker, you can run the app by running the following command in client directory:

   - `yarn`

   - `yarn start`


3. if u use docker, ignore step 2, and you can run the app by running the following command in root directory:

   - `docker-compose up --build`


4. then go to localhost:3000 and you should see the app running.


## How to use

after starting, just login with github

then play around with the button there 


## warning
- there are tons of unused codes in this repo ( actions, reducer, etc) . please ignore them. Or you could remove them.


## before u deploy 
- check the security rules of firestore in client/firestore.rules and publish it to your firebase project


## how to deploy
- just init firebase hosting and deploy it very easily.





## screenshot

![image](https://user-images.githubusercontent.com/36737465/172355032-eda62d9d-a8e7-4b80-bb13-5b4e2a4dd4ac.png)

![image](https://user-images.githubusercontent.com/36737465/172355198-f20ab886-21ac-4dac-a876-4ecc1053d693.png)