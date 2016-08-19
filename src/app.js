/**
 * Created by thirsadeboer on 11/08/16.
 */
var myApp = angular.module('myApp', []);

myApp.controller('scrumboard', function ($scope){

    var dummyData =   [
        {id:1, title: 'first kbsdbg ksdghfdhg dbvisdhggf dsighaofipeo lsmdgneiurghi udbiguhesirugb',description: 'bla first kdhgirh sdgh djgudsh jdhigdu idgsuygeuy ieyiyebidsidh idfuygduy dsghduygf. dihige gfuyegfu yugftg sdfguyeg', status: 'Story', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', projectId:1, project: {id: 1}},
        {id:2, title: 'second', description: 'bla second', status: 'To Do', storyPoints: '∞', asanaLink:'https://app.asana.com/0/91071948116296/167246347871210', projectId:1, project: {id: 2}},
        {id:3, title: 'third', description: 'bla third', status: 'In Progress', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'MY',projectId:1, project: {id: 3}},
        {id:4, title: 'fourth', description: 'bla fourth', status: 'Done', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'TdB', projectId:1, project: {id: 4}},
        {id:5, title: 'fifth kbsdbg ksdghfdhg dbvisdhggf dsighaofipeo lsmdgneiurghi udbiguhesirugb', description: 'bla fifth', status: 'Done', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'PR', projectId:1, project: {id: 5}},
        {id:6, title: 'sixth kbsdbg ksdghfdhg dbvisdhggf dsighaofipeo lsmdgneiurghi udbiguhesirugb', description: 'bla sixth', status: 'Done', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'MY', projectId:2, project: {id: 1}}
    ];

    $scope.storyPoints = [0,0.5,1,2,3,5,8,13,20,40,100,'∞','?'];
    $scope.statuses = ['Story', 'To Do', 'In Progress', 'Done'];
    $scope.initials = ['MY', 'PR', 'TdB'];
    $scope.memory = [];
    $scope.projects = [{name: 'Geoloc', id: 1}, {name: 'Ticketing', id: 2}, {name: 'True Admin', id: 3}, {name: 'RBAC', id: 4}];

    $scope.$watch('stories', function (){
        localStorage.setItem('stories', JSON.stringify($scope.stories));
    }, true);

    try{$scope.stories = JSON.parse(localStorage.getItem('stories'));}
    catch (err) {$scope.stories = dummyData;}

    var idNumber = $scope.stories.reduce(function(memo, story){
        return story.id > memo ? story.id : memo;
    },0);

    $scope.filterByStatus = function(status){
        return $scope.stories.filter(function(item){
            return item.status === status;
        })
    };

    $scope.shouldBlock = function (){
        return $scope.stories.filter(function(story){
            return story.editing === true || story.isNew === true;
        }).length > 0;
    };

    $scope.create = function (){

        console.log('or here');

        $scope.memory.push({action: 'create'});
        $scope.stories.unshift(
            {
                status: 'Story',
                isNew: true,
                id: ++idNumber,
                project: {}
            }
        );
    };

    $scope.updateStatus = function (story){
        var copy = Object.assign({},story);
        $scope.memory.push({action: 'edit', data: copy});
    };

    $scope.edit = function (story){
        $scope.updateStatus(story);
        story.editing = true;
    };

    $scope.cancel = function(story){
        story.editing = false;
        $scope.undo();
    };

    $scope.add = function (story){

        console.log('im here');

        story.isNew = false;
        story.editing = false;

        $scope.assignNextProjectNumber(story)
    };

    $scope.assignNextProjectNumber = function (story){
        var relevantStories = $scope.stories.filter(function(item){
            return item.projectId == story.projectId;
        });

        if (relevantStories.length === 0){
            throw new Error('cannot assign project number. Please try again');
        }

        story.project.id = 1 + relevantStories.reduce(function(memo, item){
            return item.project.id > memo ? item.project.id : memo;
        },0);
    };

    $scope.remove = function (story){
        $scope.memory.push({action: 'remove', data: story});
        $scope.stories = $scope.stories.filter(function(item){
            return item !== story;
        });
    };

    $scope.sprintEnd = function (){
        if(confirm('All stories will be deleted. ARE YOU SURE?!!')){
            return $scope.stories = [];
        }
    };

    $scope.allowedStatuses = function (story){
        var lookup = function (){
            var statuses = {
                Story: ['To Do'],
                'To Do':['Story'],
                'In Progress': ['To Do','Done'],
                Done: ['In Progress']
            };

            if(!story.assignee){
                return statuses;
            }

            statuses['To Do'].push('In Progress');
            return statuses;
        };

        output = lookup()[story.status];
        output.push(story.status);

        return output;
    };

    $scope.undo = function (){
        if($scope.memory.length == 0){
            alert('nothing to undo');
            return;
        }
        var undoItem = $scope.memory.pop();

        if (undoItem.action === 'remove'){
           return $scope.stories.push(undoItem.data);
        }
        if (undoItem.action === 'edit'){
            var match = $scope.stories.find(function(story){
               return story.id === undoItem.data.id;
            });
            return Object.assign(match, undoItem.data);
        }
        if (undoItem.action === 'create'){
            return $scope.stories.shift();
        }
    };

    // $scope.undoOnKeyPress = function ($event){
    //     if(($event.ctrlKey === true || $event.metaKey === true)
    //         && $event.keyCode === 90){
    //         $scope.undo();
    //     }
    // };

    $scope.projectName = function (story) {
        var match = $scope.projects.find(function(project){
            return story.projectId == project.id;
        });
        return match.name + "-" + story.project.id;
    };
});