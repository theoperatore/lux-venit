# Lux Venit - a backend story

Here lies all the code for running an http/webserver/osc server with _hopefully_ easiy configuration via environment variables.

GAH! Engine Requirements: npm: >=3.7.3, node: >=5.8.0

## Configure the thing

Open up the `.env` file and edit to your hearts content. Things that are important to edit:

`HTTP_PORT`: the port you want audience members to connect to via http; for development a high port of like 9966 should be used, otherwise to make it easier for audience members to connect, use port 80. *NOTE*: using a lower port, 80, will require the use of `sudo` or admin permissions.

`WSS_PORT`: the port of the websocket server. the default is fine, just make sure it isn't a port that is already in use.

`OSC_PORT`: The port on which to listen for OSC messages from the outside world.

`OSC_SERVER_IP_ADDRESS`: the IP address of the server sending OSC messages.

`DEBUG`: namepaces for logging messages. comment out with a `#` to remove server logging.

## Run the dev thing

If you just want to run all of the server components without building the front end, do this: 

```javascript
$ npm run dev:server
```

and the server should start up! That's it!

## Test the thing

This code comes with tests because tests are important! Run the tests with:

```javascript
$ npm test
```
These tests have an added feature! Selenium tests! 

A few notes: 

- Make sure you have `Firefox` in your path
- run the dev server
- `npm run js` first; so you actually have a frontend to serve...

All are required to correctly run the tests; they run against the real server! Yay!

## Start the entire production thing

Now I know what you're thinking: stop telling me how to do things and tell me how to do the one thing I need to do! Run in Production!

```javascript
$ npm start
```

Let it do it's thing, and once it's done you will have all of the things required to run the server and serve a minified, production-ified ui. 

Starting the server via the `start` command also runs the server [forever](https://github.com/foreverjs/forever).

## License

MIT -- BOOM