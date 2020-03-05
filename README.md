# FAST-NUCES

Fully Automated Scheduling Timetable - Never Updated Cause Everything Sucks.

This app has been created in order to facilitate the creation of a timetable for FAST-NUCES, Karachi. It is tailor made for the input from sir Shoaib Raza and uses [shoAIb](https://github.com/mbilalakmal/shoAIb) as the brain for generating the final results.

It also facilitates publishing said timetables for different departments in Google Sheets.

## Getting Started

In order to run this project on your local machine, you will need some tools installed locally and an online Google account to get some API keys.

### Prerequisites

It is recommended that you first install an IDE. Visual Studio Code is great. You should also have some idea about node and npm to get the project running.

In order to contribute to the project, knowledge of Angular and Ionic will be needed as they are used as the framework for the project.

You can install node by going to [their website](https://nodejs.org/en/). Once node is installed, install the Ionic CLI globally:

```
npm install -g @ionic/cli
```

You will also need API keys for Firebase and Google Sheets. First create a new project from the [Firebase Console](console.firebase.google.com). Once done, you will have the API keys for all the Firebase dependencies in the project.

Next go to the [Google Sheets Quickstart Page](https://developers.google.com/sheets/api/quickstart/js) and enable the Google Sheets API. You won't need to create an API key as the Firebase API key should suffice.

### Installing

Once you've cloned this project, you can cd into the project and install the dependencies using:

```
npm install
```

At this point, the project is ready to be served but you need to setup the environment files for it to know the values of the API keys. Go to the [environments folder](https://github.com/wajeehmisbahkhan/FAST-NUCES/tree/master/src/environments) and create the following files:

```
touch environment.ts
```

```
touch environment.prod.ts
```

Copy the contents of the [template environment file](https://github.com/wajeehmisbahkhan/FAST-NUCES/blob/master/src/environments/environment.dist.ts) and fill the values with your API keys. Both files have the same contents except for the production value which is false for environment.ts and true for environment.prod.ts.

Afterwards you can safely run:

```
ionic serve
```

And have the project served at http://localhost:8100.

## Built With

* [Ionic](https://ionicframework.com/) - The web framework used
* [Firebase](https://firebase.google.com/) - Authentication and data management
* [Google Sheets](https://developers.google.com/sheets/api) - Used to publish timetables

## Authors
* **Wajeeh Misbah Khan** - [wajeehmisbahkhan](https://github.com/wajeehmisbahkhan/)
* **Bilal Akmal** - [mbilalakmal](https://github.com/mbilalakmal/)
* **Owais Tahir** - [owaistahir3](https://github.com/owaistahir3)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Sir Shoaib Raza
