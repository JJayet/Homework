var api = "https://api.github.com";
var express = "http://localhost:3000";

var GitHubRequester = function() { 
	this.fetch = function(url, query, params) {
		if (params == undefined)
			params = "";
	    return $.ajax({
	      url: url + query + params,
	      dataType: 'json'
	    });
	}
	this.searchForRepositories = function(query, pageNumber) {
		return this.fetch(api + '/search/repositories?q=', query, '&page=' + pageNumber);
	}
	this.getRepository = function(repositoryName) {
		return this.fetch(api + '/repos/', repositoryName);
	}
	this.getContributors = function(repositoryName, numberPerPage, pageNumber) {
		return this.fetch(api + '/repos/', repositoryName + '/contributors', '?per_page=' + numberPerPage + '&page=' + pageNumber);
	}
	this.getCommitActivity = function(repositoryName) {
		return this.fetch(api + '/repos/', repositoryName + '/stats/commit_activity');
	}
	this.getContributorsStats = function(repositoryName) {
		return this.fetch(api + '/repos/', repositoryName + '/stats/contributors');
	}
	this.getCommits = function(repositoryName, numberPerPage) {
		return this.fetch(api + '/repos/', repositoryName + '/commits', '?per_page=' + numberPerPage);
	}
	this.getLast100CommitsWithGraph = function(repositoryName, numberPerPage) {
		return this.fetch(express, '/getLast100WithGraph', "?repositoryName=" + repositoryName + "&numberPerPage=" + numberPerPage);
	}
	this.getLast100CommitsActivity = function(repositoryName, numberPerPage) {
		return this.fetch(express, '/getLast100Commits', "?repositoryName=" + repositoryName + "&numberPerPage=" + numberPerPage);
	}
	this.getUser = function(userName) {
		return this.fetch(api + "/users/", userName);
	}
	this.getUserPublicRepos = function(userName, pageNumber) {
		return this.fetch(api + "/users/", userName + "/repos", '?page=' + pageNumber);
	}
}