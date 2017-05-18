var debug = require('debug')('botkit:bot_builder');

module.exports = function() {
    return function (controller, team) {
        var bot = controller.spawn(team.bot);

        if (!bot.identity || !bot.identity.id) {
            var identity = {
                ok: true,
                team: team.name,
                team_id: team.id,
                url: team.url,
                user: team.bot.name,
                user_id: team.bot.user_id
            };
            bot.identity = identity;
        }
        if (!bot.team_info) {
            bot.team_info = team;
        }
        return bot;
    };
}
