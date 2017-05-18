var debug = require('debug')('botkit:bot_builder');

module.exports = function() {
    return function (controller, closure) {
        controller.storage.teams.all(function (err, teams) {
            if(err) {
                console.error('Error while accessing teams', err);
                debug('Error while accessing teams', err)
            }
            teams.forEach(function (team) {
                team.elastic.clusters.forEach(function (cluster) {
                    closure(team, cluster);
                })
            });
        });
    };
}
