# Slack bot for Elasticsearch clusters monitoring

A slack bot for monitoring the status of the team's Elastic clusters, reporting problems.

### Instant Start

[Remix this project on Glitch](https://glitch.com/edit/#!/import/github/howdyai/botkit-starter-slack)

[Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/HelainSchoonjans/botkit-slack-elastic/master)

### Get Started

Clone this repository:

`git clone https://github.com/HelainSchoonjans/botkit-slack-elastic.git`

Install dependencies, including [Botkit](https://github.com/HelainSchoonjans/botkit-slack-elastic):

```
cd botkit-slack-elastic
npm install
```

Set up a new Slack application via the Slack developer portal. This is a multi-step process, but only takes a few minutes. [Read this step-by-step guide](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md) to make sure everything is set up.

Next, get a Botkit Studio token [from your Botkit developer account](https://studio.botkit.ai/)

Update the `.env` file with your newly acquired tokens.

Launch your bot application by typing:

`node .`

Now, visit your new bot's login page: http://localhost:3000/login

Once successfully logged in, your bot should connect to Slack AND Botkit Studio and leap into action!

Continue your journey to becoming a champion botmaster by [reading the Botkit Studio SDK documentation here.](https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md)

### Extend This Bot

This repo is designed to provide developers a robust starting point for building a custom bot. Included in the code are a set of sample bot "skills" that illustrate various aspects of the Botkit SDK features.  Once you are familiar with how Botkit works, you may safely delete all of the files in the `skills/` subfolder.

Developers will build custom features as modules that live in the `skills/` folder. The main bot application will automatically include any files placed there.

A skill module should be in the format:

```
module.exports = function(controller) {

    // add event handlers to controller
    // such as hears handlers that match triggers defined in code
    // or controller.studio.before, validate, and after which tie into triggers
    // defined in the Botkit Studio UI.

}
```

### Customize Storage

By default, the starter kit uses a simple file-system based storage mechanism to
record information about the teams and users that interact with the bot. While
this is fine for development, or use by a single team, most developers will want
to customize the code to use a real database system.

There are [Botkit plugins for all the major database systems](https://github.com/howdyai/botkit/blob/master/docs/readme-middlewares.md#storage-modules) which can be enabled with just a few lines of code.
