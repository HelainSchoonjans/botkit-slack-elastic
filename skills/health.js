var debug = require('debug')('botkit:get_members');
const request = require('request');
var Bot = require(__dirname + '/../components/bot_builder.js')();
var for_each_cluster = require(__dirname + '/../components/for_each_cluster.js')();

module.exports = function(controller) {

    controller.on('health_check', function() {
        for_each_cluster(controller, function (team, cluster) {
            controller.trigger('cluster_health_check', [team, cluster]);
        });
        // controller.storage.teams.all(function (err, teams) {
        //     if(err) {
        //         console.error('Error while accessing teams', err);
        //         debug('Error while accessing teams', err)
        //     }
        //     teams.forEach(function (team) {
        //         team.elastic.clusters.forEach(function (cluster) {
        //             controller.trigger('cluster_health', [team, cluster]);
        //         })
        //     });
        // });
    });

    controller.on('cluster_health_check', function(team, cluster) {
        request.get(cluster.url + "/_cluster/health", {},  function (error, response, body) {
            if(error) {
                console.log('Error during rest call:', error);
            } else if(response && response.statusCode == 200) {

                var health = JSON.parse(body);

                if(!(cluster.status == health.status)) {
                    cluster.status = health.status;
                    controller.storage.teams.save(team, withSuccess(function () {
                        console.log("Cluster status change to '"+cluster.status+"'");
                    }));
                    var bot = Bot(controller, team);
                    bot.startPrivateConversation({user: team.createdBy}, function(err, convo) {
                        if (err) {
                            console.log(err);
                        } else {
                            convo.say('Cluster \''+cluster.name+'\' health status changed to \''+cluster.status+'\'');
                            convo.task.conversationEnded(convo);
                        }
                    });
                }

            } else {
                console.log(response);
                debug('Non 200 response code during rest call');
            }
        });
    });

    function withSuccess(closure) {
        return function (err) {
            if (err) {
                console.error('Error: could not do operation:', err);
                debug('Error: could not do operation:', err);
            } else {
                closure();
            }
        };
    }

}