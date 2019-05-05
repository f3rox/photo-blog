const axios = require('axios');
const config = require('../../config.json');
module.exports = {
    // Получить нужное количество рандомных картинок (не более 100)
    getRandomCats: function (qt) {
        return axios.get(config.catApi.url, {
            params: {
                limit: qt,
                mime_types: config.catApi.mime_types
            }
        });
    },
    // Получить рандомную картинку
    getRandomCat: function () {
        return axios.get(config.catApi.url, {
            params: {
                limit: 1,
                mime_types: config.catApi.mime_types
            }
        });
    }
};