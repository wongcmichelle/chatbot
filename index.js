const express = require('express');
const bodyParser = require('body-parser');
var unirest = require('unirest');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-food-recipes', function (request,response)  {
    if (request.body.result && request.body.result.parameters && request.body.result.parameters['ingredients']) {
            const ingredients = request.body.result.parameters['ingredients'];
            const reqUrl = encodeURI("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=${ingredients}%2Cflour%2Csugar")
            var req = unirest("GET", reqUrl);
            req.headers({
                "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "X-RapidAPI-Key": API_KEY
            });
            req.send("{}");
            req.end(function (res) {
                if (res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else if (res.body.results.length > 0) {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i<result.length;i++) {
                        output += result[i].title;
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output
                    })); 
                }
            });
    }
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});