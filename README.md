NEEO MQTT Forwarding
=====

This tool regularly forwards sensor values and active recipes from NEEO to a MQTT broker.

Setup
-----

Copy the sample configuration file and adjust it:

```
$ cp config.sample.json config.json
```

Install the dependencies:

```
$ npm install
```

Running locally
-----

```
$ DEBUG=mk:* npm start
```

**Note:** If you add new sensors to NEEO, the driver needs to be restarted as it currently doesn't check for new sensors on every interval.

Run in production
-----

```
$ npm install
$ npm start
```