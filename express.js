/**
 * Created by thirsadeboer on 20/08/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var stories = require('./inMemoryStoriesRepository')();
var storyPoints = require('./inMemorySettingsRepository').storyPoints;
var statuses = require('./inMemorySettingsRepository').statuses;
var initials = require('./inMemorySettingsRepository').initials;
var projects = require('./inMemoryProjectsRepository').projects;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');
app.use(bodyParser.json());

app.get('/stories', function(req, res){
    res.send(stories.getAll());
});

// app.get('/stories/:id', function(req, res){
//     res.send(repository.getById(req.params.id));
// });

app.get('/projects', function(req, res){
    res.send(projects);
});

app.get('/settings', function(req, res){
    res.send({storyPoints:storyPoints, statuses:statuses, initials:initials});
});

app.post('/stories', function(req, res){
    stories.create(req.body);
    res.status(201).send('yay');
});

app.delete('/stories', function(req, res){
    repository.deleteAll();
    res.status(204).send('all stories removed');
});

app.delete('/stories/:id', function(req, res){
    repository.delete(req.params.id);
    res.status(204).send('story removed');
});

app.put('/stories', function(req, res){
    repository.update(req.body);
    res.send('luck');
});

app.listen('3000');