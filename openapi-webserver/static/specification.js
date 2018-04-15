'use strict';

const app = new Vue({
    el: '#app',
    data: {
        spec: null,
    }
});

fetch('openapi.json')
    .then((response) => { return response.json() })
    .then((json) => {
        console.log(json);
        app.spec = json;
    });