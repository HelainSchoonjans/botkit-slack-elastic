module.exports = function(controller) {

    function random_element(list) {
        return list[Math.floor(Math.random()*list.length)];
    }

    controller.hears(['hello', 'hey'],['direct_message','direct_mention','mention'],function(bot,message) {
        bot.reply(message, random_element([
            'Hello <@' + message.user + '>.',
            'Hey <@' + message.user + '>.'
        ]));
    });

    controller.hears(['thanks'],['direct_message','direct_mention','mention'],function(bot,message) {
        // console.log("thanks");
        bot.reply(message,"You're welcome.");
    });

}
