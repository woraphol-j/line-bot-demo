## Line Bot Experiment

### About the project
This project is neatly designed and built to demonstrate the use of Node.js and its ecosystem for building a simple yet functional Line Bot application. This application contains 2 line bots as follows:
1. **Dictionary Bot** - A user types in a word, the bot will return its meaning and synonyms. It integrates with Oxford Dictionary API in the background. It is designed to be effective despite the slow 3rd party API by using the caching and rate limiting techniques.

1. **ToDo Bot** - A user can enter and save todo infomation in the predefined format with task and date. The user can then edit it using a webview opened inside Line. There is also the built-in scheduled notification system to alert users.

### Live Demo
To provide the live demo, the application is deployed to AWS Beanstalk with AWS-RDS backed Postgresql database. It's webview todo app is written using **React.js** you can find the sub project here https://github.com/woraphol-j/react-todo. and it is deployed to web-hosting enabled S3 bucket.

#### QR code for Dictionary bot<br/>
![dictbot](docs/img/dict_qr.png)

#### QR code for ToDo bot<br/>
![todobot](docs/img/todo_qr.png)

### Philosophy behind the code
- It strictly follows the most popular javascript code convention by AirBnB. (https://github.com/airbnb/javascript)
- It also rigorously follows the coding best practices defined in the clean code javascript guideline (https://github.com/ryanmcdermott/clean-code-javascript)

## Getting Started
### Prerequisite
1. Make sure you have docker and docker-compose installed.
2. Clone the project.
3. Run the following command at the top level of the project in order to get the service and its dependency up and running:
```bash
docker-compose up -d
```

### Room for improvement
Due to the time constraint, this project is quickly built to demonstrate the use of Node.js and its ecosystem to develop a chat bot application. Although the project is production-ready and fully functional, there are still some parts that can be improved as follows:
#### 1. Validation logic
  - It should not allow setting past date and time.
  - It should not allow sending other types of message such as image.
  - The error handling can be improved by creating a common middleware that handles it specifically as opposed to putting the logic all over the place in the controller modules.
#### 2. Add more test coverage
  - Add more unit tests for other library modules.
  - Add integration tests.
#### 3. Split model between user and tasks
  - Currently in order to get a user, the tasks table has to be probed. It might be a better idea to create a new user the first time the server recieves the request from that particular user.
#### 4. Use specific timezone for each user
#### 5. Use short-lived token instead of userId for the todo webview app to interact with the bot API server
#### 6. Use dedicated caching server rather than node-cache module