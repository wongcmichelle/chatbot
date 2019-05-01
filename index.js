const express = require('express');
const bodyParser = require('body-parser');
const unirest = require('unirest');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json({ type: "*/*" }));

server.post('/get-food-recipes', function (request, response)  {
    if (request.body && request.body.result && request.body.result.parameters && request.body.result.parameters['ingredients']) {
            const ingredients = request.body.result.parameters['ingredients'];
            const reqUrl = encodeURI(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=${ingredients}`)            
            var req = unirest.get(reqUrl);
            req.headers({
                "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "X-RapidAPI-Key": API_KEY
            });
            req.send("{}");
            req.end(function (res) {
                if (res.error) {
                    response.header('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? ",
                        "source": 'get-food-recipes'
                    }));
                } else if (res.body.length > 0) {
                    let result = res.body;
                    let output = '';
                    for(let i = 0; i < result.length; i++) {
                        const recipe = result[i]
                        const hyphenTitle = recipe.title.toLowerCase().split(' ').join('-');
                        const id = recipe.id;
                        output += `https://spoonacular.com/recipes/${hyphenTitle}-${id}`;
                        output+="\n"
                    }
                    response.header('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output,
                        "source": 'get-food-recipes'
                    })); 
                }
            });
    }
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});