const axios = require('axios');
const config = require('../../config.json');
module.exports = {
    getRandomCats: function (qt) {
        return axios.get(config.catApi.url, {
            params: {
                limit: qt,
                mime_types: config.catApi.mime_types
            }
        });
    },
    getRandomCat: function () {
        return axios.get(config.catApi.url, {
            params: {
                limit: 1,
                mime_types: config.catApi.mime_types
            }
        });
    }
};