/**
 * Created by thirsadeboer on 11/08/16.
 */
angular.module('myApp', [])

.controller('scrumboard', ['$http','$scope', function ($http, $scope){

//Initialization

    $scope.memory = [];

    $scope.stories = [];
    $scope.allStories = function (){
        $http.get("./stories")
        .then(function(response) {
            $scope.stories = response.data;
        }, function(error) {
            console.log('problems with getting all stories');
            throw error;
        });
    };
    $scope.allStories();

    $scope.projects = [];
    $http.get("./projects")
    .then(function(response){
        $scope.projects = response.data;
    },function(error){
        console.log('Problem loading projects, try again');
        throw error;
    });

    $scope.storyPoints = [];
    $scope.statuses = [];
    $scope.initials = [];
    $http.get('./settings')
    .then(function(response){
        $scope.storyPoints = response.data.storyPoints;
        $scope.statuses = response.data.statuses;
        $scope.initials = response.data.initials;
    }, function(error){
        console.log('problems with /settings, try again');
        throw error;
    });

    $scope.filterByStatus = function(status){
        return $scope.stories.filter(function(item){
            return item.status === status;
        })
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

    $scope.projectName = function (story) {
        var match = $scope.projects.find(function(project){
            return story.projectId == project.id;
        });
        return match.name + "-" + story.project.id;
    };

    $scope.shouldBlock = function (){
        return $scope.stories.filter(function(story){
                return story.editing === true || story.isNew === true;
        }).length > 0;
    };

//Functionality

    $scope.createStory = function (){

        var idNumber = $scope.stories.reduce(function(memo, story){
            return story.id > memo ? story.id : memo;
        },0);

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

    $scope.addStory = function (story){
        story.isNew = false;
        story.editing = false;

        $scope.assignNextProjectNumber(story);

        $http({
            method:"POST",
            url:'/stories',
            data: story
        }).then(function(){
            $scope.allStories();
        }, function (error){
            console.log('oef');
        });
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

    $scope.editStory = function (story){
        $scope.updateStatus(story);
        //shouldnt i return from updateStatus() ?
        story.editing = true;
    };

    $scope.updateStory = function (story){
        $http({
            method: "PUT",
            url: '/stories',
            data: story
        })
    };

    $scope.updateStatus = function (story){
        var copy = Object.assign({},story);
        //add put method? instead of the above?
        $scope.memory.push({action: 'edit', data: copy});
    };

    $scope.cancel = function(story){
        story.editing = false;
        $scope.undo();
    };

    $scope.removeStory = function (story){
        $scope.memory.push({action: 'remove', data: story});
        // $scope.stories = $scope.stories.filter(function(item){
        //     return item !== story;
        // });
        $http({
            method:"DELETE",
            url: '/stories/'+ story.id,
            data: story
        }).then(function(){
            $scope.allStories();
        }, function (error){
            console.log('oef');
        })
    };

    $scope.sprintEnd = function (){
        if(confirm('All stories will be deleted. ARE YOU SURE?!!')){
            // return $scope.stories = [];

            $http.delete('/stories').then(function(){
                $scope.allStories();
            }, function (error){
                console.log('oeps...remove all niet goed gelukt');
            });
        }
    };

    $scope.undo = function (){
        if($scope.memory.length == 0){
            alert('nothing to undo');
            return;
        }
        var undoItem = $scope.memory.pop();

        if (undoItem.action === 'remove'){

            $http({
                method:"POST",
                url:'/stories',
                data: undoItem.data
            }).then(function(){
                $scope.allStories();
            }, function (error){
                console.log('oef');
            });

            return;
           // return $scope.stories.push(undoItem.data);
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

    $scope.undoOnKeyPress = function ($event){
        if(($event.ctrlKey === true || $event.metaKey === true)
            && $event.keyCode === 90){
            $scope.undo();
        }
    };
}]);