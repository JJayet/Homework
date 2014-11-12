var express = require('express');
var app = express();
var request = require('request');
var _ = require('underscore');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getLast100WithGraph', function (req, res, next) {
	var options = {
	    url: 'https://api.github.com/repos/'+ req.query.repositoryName +'/commits?per_page=' + req.query.numberPerPage,
	    headers: {
	        'User-Agent': 'request'
	    }
	};
  	request(options, function (error, response, body) {
  		var infos = JSON.parse(body);
  		var commitsGrouppedByDate = _.chain(infos)
			    				.groupBy(function(item) {
			    					if (item.author != null)
			    						return getFormattedDate(item.commit.author.date);
			    				})
			    				.value();
		var trueResults = [];
    	_.each(commitsGrouppedByDate, function(o)
    	{
    		trueResults.push(_.uniq(o, function (item){
	    					if (item.author != null)
	    						return item.author.login;
	    					}));
    	});
		var statsData = _.map(commitsGrouppedByDate, function(o) 
			{
				if (o[0].commit != null)
					return {time : o[0].commit.author.date, data : o.length}
			}).reverse();
		var commitsSum = _.reduce(statsData, function(memo, value){ if(!_.isUndefined(value)) return memo + value.data; }, 0);
		var temp = _.groupBy(infos, function(o){if (o.author != null)return o.author.login; });
		var committersCount = _.reduce(_.map(temp, function(o, index) {return 1;}), function(memo, num){ return memo + num; }, 0)
		res.send({commitsGrouppedByDate : trueResults, statsData : statsData, commitsSum : commitsSum, committersCount : committersCount});
  	});
});

app.get('/getLast100Commits', function (req, res, next) {
	var options = {
	    url: 'https://api.github.com/repos/'+ req.query.repositoryName +'/commits?per_page=' + req.query.numberPerPage,
	    headers: {
	        'User-Agent': 'request'
	    }
	};
  	request(options, function (error, response, body) {
  		var infos = JSON.parse(body);
  		var authors = _.filter(infos, function(committer) {return committer.author !== null;});
    	var commitPerAuthors = _.chain(authors)
    				.groupBy(function(item) {
    					if (item.author != null)
    						return item.author.login;
    				})
    				.sortBy(function(item) {
    					return item.length;
    				})
    				.reverse()
    				.value();
	    var numberOfMrMoustacheNeeded = _.countBy(infos, function(committer) {return committer.author === null;});
	    var numberOfCommits = infos.length;
		res.send({authors : commitPerAuthors, numberOfMrMoustacheNeeded : numberOfMrMoustacheNeeded, numberOfCommits: numberOfCommits});
  	});
});

getFormattedDate = function(dateToFormat) {
	var date = new Date(dateToFormat);
    var yyyy = date.getFullYear().toString();                                    
    var mm = (date.getMonth() + 1).toString();
    var dd  = date.getDate().toString();             
    return (dd[1]?dd:"0"+dd[0]) + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + yyyy;
}

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
})