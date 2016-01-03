var Promise = require('bluebird'),
    wrapper = require('./wrapper'),
    moment = require('moment'),
    videosWrapper = wrapper.videos;

var videoFunctions = {
    _getDetailsForVideoIds: function (videoIds, pageToken) {
        var params = {
            part: 'snippet, contentDetails',
            maxResults: 50,
            id: ''
        };

        if(pageToken){
            params.pageToken = pageToken;
        }

        for (var i = 0; i < videoIds.length; i++) {
            params.id = params.id + videoIds[i] + ',';
        }

        //remove last ,
        if (params.id.substr(-1) === ',') {
            params.id = params.id.substr(0, params.id.length - 1);
        }

        return videosWrapper.list(params).then(function (data) {
            var videoDetails = [],
                items = data.items,
                nextPageToken = data.nextPageToken || '';

            for(var i = 0; i < items.length; i++){
                var video = items[i],
                    snippet = video.snippet,
                    duration = moment.duration(video.contentDetails.duration, moment.ISO_8601);

                videoDetails.push({
                    id: video.id,
                    title: snippet.title,
                    description: snippet.description,
                    publishedAt: snippet.publishedAt,
                    thumbnails: snippet.thumbnails,
                    duration: duration.asSeconds(),
                    channelId: snippet.channelId
                });
            }

            if(nextPageToken !== ''){
                return videoFunctions._getDetailsForVideoIds(videoIds.slice(49), nextPageToken).then(function (data) {
                   return videoDetails.concat(data);
                });
            }

            return Promise.all(videoDetails);
        });
    },

    getDetailsForVideoIds: function (videoIds) {
        return videoFunctions._getDetailsForVideoIds(videoIds);
    }
};

module.exports = videoFunctions;