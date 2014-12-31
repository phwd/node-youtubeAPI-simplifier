var channelWrapper = require('./wrapper').channels;

var channelFunctions = {
    /**
     * Gets the statistics for a specified user.
     *
     * Example Usage:
     * getStatisticsForUser('gronkh').then(function (data){
     *       console.log(data);
     * });
     *
     * @method getStatisticsForUser
     * @param {String} username
     * @returns {Promise}
     */
    getStatisticsForUser: function (username) {
        var params = {
            part: 'statistics',
            forUsername: username
        };
        return channelWrapper.list(params).then(function (data) {
            var dataItem = data.items[0].statistics;
            return {
                viewCount: dataItem.viewCount,
                commentCount: dataItem.commentCount,
                subscriberCount: dataItem.subscriberCount,
                videoCount: dataItem.videoCount
            }
        });
    },

    /**
     * Gets the channelId for a specified user (somtimes needed insted of username).
     *
     * Example Usage:
     * getChannelIdForUser('gronkh').then(function (data) {
     *      console.log(data);
     * });
     *
     * @method getChannelIdForUser
     * @param {String} username
     * @returns {Promise}
     */
    getChannelIdForUser: function (username) {
        var params = {
            part: 'contentDetails',
            forUsername: username
        };

        return channelWrapper.list(params).then(function (data) {
            return {
                channelId: data.items[0].id
            };
        });
    }
};

module.exports = channelFunctions;