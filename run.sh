#!/bin/bash
# studio_token=none

# npm install
# note: if the installation failed a first time due to the npmrc override, change npmrc, remove node_modules, and retry

export clientId=$ELASTIC_SLACK_CLIENT_ID
export clientSecret=$ELASTIC_SLACK_CLIENT_SECRET
export PORT=3000

# to create the default team
# TODO HSC: find a better way of passing multiple usernames password and urls...
#export ELASTIC_USER=$ELASTIC_USER
#export ELASTIC_PASSWORD=$ELASTIC_PASSWORD
#export ELASTIC_URL=$ELASTIC_URL

export team_id=$SLACK_TEAM_ID
export user_id=$SLACK_USER_ID
export url=$SLACK_APP_URL
export team=$SLACK_TEAM
export bot_access_token=$SLACK_BOT_ACCESS_TOKEN
export bot_user_id=$SLACK_BOT_USER_ID
export access_token=$SLACK_ACCESS_TOKEN
export debug=false

export dashbot_api_key=$DASHBOT_API_KEY

#export debug=true
node bot.js