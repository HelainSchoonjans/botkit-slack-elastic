var debug = require('debug')('botkit:get_members');
const request = require('request');

module.exports = function(controller) {

    // TODO HSC: endpoints to have
    // _stats
    // _cluster/state
    // _nodes?all=true

    // TODO HSC: method 1:
    // for each team, let's look at the clusters
    // use method 2

    // TODO HSC/ maybe even inspect each node!

    // TODO HSC: method 2: foreach cluster, method 3
    // TODO HSC: method 3: get cluster info, dispatch with method 4
    // TODO HSC: looks for anomalies in the cluster status, and sends error messages if needed

}