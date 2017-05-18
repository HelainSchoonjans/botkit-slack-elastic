/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Create a new app via the Slack Developer site:

    -> http://api.slack.com

  Get a Botkit Studio token from Botkit.ai:

    -> https://studio.botkit.ai/

  Run your bot from the command line:

    clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js

# USE THE BOT:

    Navigate to the built-in login page:

    https://<myhost.com>/login

    This will authenticate you with Slack.

    If successful, your bot will come online and greet you.


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = process.env;
if (!env.clientId || !env.clientSecret || !env.PORT) {
    console.log('Error: Specify clientId clientSecret and PORT in environment');
    usage_tip();
    process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var debug_logging = false;
if(env.debug == 'true') {
    debug_logging = true
}

var bot_options = {
    clientId: env.clientId,
    clientSecret: env.clientSecret,
    debug: debug_logging,
    scopes: ['bot'],
    studio_token: env.studio_token,
    studio_command_uri: env.studio_command_uri
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (env.MONGO_URI) {
    var mongoStorage = require('botkit-storage-mongo')({mongoUri: env.MONGO_URI});
    bot_options.storage = mongoStorage;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Enable Dashbot.io plugin
require(__dirname + '/components/plugin_dashbot.js')(controller);


var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

/**************************************************

 Setting up the default team if there isn't already a team saved.

 **************************************************/
function createDefaultTeam() {
    if(env.bot_user_id && env.bot_access_token) {
        console.log("Creating default team...");
        if (env.team_id && env.user_id && env.url && env.team && env.access_token) {
            team = {
                id: env.team_id,
                createdBy: env.user_id,
                url: env.url,
                name: env.team,
                default: true
            };

            team.bot = {
                token: env.bot_access_token,
                user_id: env.bot_user_id,
                createdBy: env.user_id,
                app_token: env.access_token,
                team_id: env.team_id
            };

            if (env.ELASTIC_USER && env.ELASTIC_PASSWORD && env.ELASTIC_URL) {
                team.elastic = {
                    user: env.ELASTIC_USER,
                    password: env.ELASTIC_PASSWORD,
                    url: env.ELASTIC_URL,
                    clusters: []
                };
                console.log('Integrated the default team with Elastic.');
            } else {
                console.log("No Elastic user or password or url given for the main team.")
            }

            var testbot = controller.spawn(team.bot);

            testbot.api.auth.test({}, function (err, bot_auth) {
                if (err) {
                    debug('Error: could not authenticate bot user', err);
                } else {
                    team.bot.name = bot_auth.user;

                    // add in info that is expected by Botkit
                    testbot.identity = bot_auth;
                    testbot.team_info = team;

                    controller.storage.teams.save(team, function (err) {
                        if (err) {
                            debug('Error: could not save team record:', err);
                        } else {
                            controller.trigger('create_team', [testbot, team]);
                        }
                    });
                }
            });
            console.log("Default team created.");
        } else {
            console.log("Missing some default team environment variables: check that 'team_id,user_id,url,team, access_token' are defined.");
        }
    } else {
        console.log("No bot_user_id and bot_user_token defined; no default team created.");
    }
}

controller.findTeamById(env.team_id, function (err, team) {
    if(err) {
        console.log("Default team does not exist");
        createDefaultTeam();
    } else {
        console.log("Default team exists; not recreating it.");
    }
});

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Elastic slack bot');
    console.log('Execute your bot application like this:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get Slack app credentials here: https://api.slack.com/apps')
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}

/**************************************************

 Now run the cron job for polling Qlik.

 **************************************************/
var CronJob = require('cron').CronJob;

/*
 * Runs every day every minute
 * on every month. Sends the errors to slack.
 *
 */
new CronJob('*/1 * * * *', function() {
        controller.trigger('health_check', []);
    }, function () {
        /* This function is executed when the job stops */
        console.log("CRON JOB 'Qlik getting errors' DONE");
    },
    true, /* Start the job right now */
    'Europe/Brussels'
);