/**
 * Created by thirsadeboer on 22/08/16.
 */
module.exports = function (){

    var repository = {
        getAll: function (){
            return dummyData
        },
        getById: function (id){
            return dummyData.find(function(element){
                return element.id == id;
            });
        },
        create: function (story){
            console.log('im here');
            dummyData.push(story);
        },
        delete: function (id){
            var storyIndex = dummyData.indexOf(repository.getById(id));
            dummyData.splice(storyIndex,1);
        },
        update: function (story){
            var oldStory = dummyData.indexOf(repository.getById(story.id));
            dummyData[oldStory] = story;
        },
        deleteAll: function (){
            return dummyData=[];
        }
    };
    return repository;
};

var dummyData = [
    {id:1, title: 'first kbsdbg ksdghfdhg dbvisdhggf dsighaofipeo lsmdgneiurghi udbiguhesirugb',description: 'bla first kdhgirh sdgh djgudsh jdhigdu idgsuygeuy ieyiyebidsidh idfuygduy dsghduygf. dihige gfuyegfu yugftg sdfguyeg', status: 'Story', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', projectId:1, project: {id: 1}},
    {id:2, title: 'second', description: 'bla second', status: 'To Do', storyPoints: '∞', asanaLink:'https://app.asana.com/0/91071948116296/167246347871210', projectId:1, project: {id: 2}},
    {id:3, title: 'third', description: 'bla third', status: 'In Progress', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'MY',projectId:1, project: {id: 3}},
    {id:4, title: 'fourth', description: 'bla fourth', status: 'Done', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'TdB', projectId:1, project: {id: 4}},
    {id:5, title: 'fifth kbsdbg ksdghfdhg dbvisdhggf dsighaofipeo lsmdgneiurghi udbiguhesirugb', description: 'bla fifth', status: 'Done', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'PR', projectId:1, project: {id: 5}},
    {id:6, title: 'sixth kbsdbg ksdghfdhg dbvisdhggf dsighaofipeo lsmdgneiurghi udbiguhesirugb', description: 'bla sixth', status: 'Done', storyPoints: 20, asanaLink: 'https://app.asana.com/0/91071948116296/160751208157233', assignee: 'MY', projectId:2, project: {id: 1}}
];