/** @jsx React.DOM */
var CurrentPath = ReactRouter.CurrentPath;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Repository = React.createClass({
	mixins: [ CurrentPath ],
	handleClick: function(e) {
		e.preventDefault();
		var currentPath = this.getCurrentPath();
		
		if (currentPath.indexOf("commitsActivity") > -1)
			this.setState({active: "commitsActivity"});
		else if (currentPath.indexOf("LastYearCommitsTimeline") > -1)
			this.setState({active: "LastYearCommitsTimeline"});
		else
			this.setState({active: "contributors"});
	},
	getInitialState: function() {
	    return {path: "", active: "contributors"};
	},
	render: function() {
		var active = this.getCurrentPath().indexOf("commitsActivity") > -1 ? "2" : this.getCurrentPath().indexOf("LastYearCommitsTimeline") > -1 ? "3" : this.getCurrentPath().indexOf("LastHundredCommitsTimeline") > -1 ? "4" : "1";
		return (
			<div>
				<h4>Stats pour : {this.props.params.repository} <small>by {this.props.params.owner}</small></h4>
				<ul id="tab" className="nav nav-tabs" role="tablist">
				  <li className={active == "1" ? "active" : ""}><Link to="contributors" params={{owner: this.props.params.owner, repository: this.props.params.repository}}>Contributeurs</Link></li>
				  <li className={active == "2" ? "active" : ""}><Link to="commitsActivity" params={{owner: this.props.params.owner, repository: this.props.params.repository}}>Leur impact sur 100 commits</Link></li>
				  <li className={active == "4" ? "active" : ""}><Link to="LastHundredCommitsTimeline" params={{owner: this.props.params.owner, repository: this.props.params.repository}}>Timeline des 100 commits</Link></li>
				  <li className={active == "3" ? "active" : ""}><Link to="LastYearCommitsTimeline" params={{owner: this.props.params.owner, repository: this.props.params.repository}}>1 an de commits</Link></li>
				</ul>
				<div id="tabContent" className="tab-content">
					<this.props.activeRouteHandler />
				</div>
			</div>
		);
	}
});

var ContributorsList = React.createClass({
	loadGitContributors: function(getEverything, numberToPull) {
	    var gitHubRequester = new GitHubRequester();
	    var fullName = this.props.params.owner + "/" + this.props.params.repository;
	    var ajaxRequest = gitHubRequester.getContributors(fullName, numberToPull, this.state.pageNumber);
	    ajaxRequest
	      .done(function(data) {
	          this.setState({data: this.state.data.concat(data)});
	          this.setState({pageNumber: this.state.pageNumber + 1});
	          this.setState({done: true});
	          if (data.length == numberToPull && getEverything)
	          	this.loadGitContributors(true, 50);
	        }.bind(this))
	      .fail(function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this));
	},
	loadGitContributorsRecursively: function(e) {
		e.preventDefault();
		this.setState({getAll: true});
		this.loadGitContributors(true, 50);
	},
	getInitialState: function() {
	    return {data: [], pageNumber: 1, getAll: false, done: false};
	},
  	componentWillMount: function() {
		this.loadGitContributors(false, 50);
	},
	render: function() {
	  	if (this.state.data.length > 0)
	    {
	    	var results = this.state.data.map(function(item, index) {
		        return (
		        	<ContributorThumbnail avatarUrl={item.avatar_url}
		        						  topCaption={item.contributions + ' contrib.'}
		        						  bottomCaption={item.login}
		        						  owner={item.login}
		        						  key={index} />
		        )
			});

	    	var style = {visibility: this.state.getAll ? 'hidden' : 'visible'};
	    	var catchPhrase = this.state.getAll ? "Voir tous les contributeurs (" + this.state.data.length + ")" 
	    					: "Liste des "+ this.state.data.length + " contributeurs les plus actifs";
	    	return (
    			<div className="container-fluid">
    				<h4>{catchPhrase}</h4>
    				<div className="row">
	      				<ReactCSSTransitionGroup transitionName="fade">
	          				{results}
	          			</ReactCSSTransitionGroup>
	          		</div>
	          		<form onSubmit={this.loadGitContributorsRecursively} style={style}>
		          		<button type="submit" className="btn btn-default btn-lg pull-right">
							<span className="glyphicon glyphicon-plus"></span> Voir tous les contributeurs
						</button>
    				</form>
	        	</div>
	    	);
	    }
	    else {
	    	if (this.state.done)
	      		return (<div className="container-fluid">Aucune donnée à afficher</div>);
	    	return (<ProgressBarComponent progression={true} />);
	    }
	}
});

var ContributorsActivity = React.createClass({
	loadCommits: function() {
	    var gitHubRequester = new GitHubRequester();
	    var fullName = this.props.params.owner + "/" + this.props.params.repository;
	    var ajaxRequest = gitHubRequester.getLast100CommitsActivity(fullName, 100);
	    ajaxRequest
	      .done(function(data) {	      	
	          this.setState({data: data, done: true});
	        }.bind(this))
	      .fail(function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this));
	},
	getInitialState: function() {
	    return {data: [], done: false};
	},
  	componentWillMount: function() {
		this.loadCommits();
	},
	render: function() {
	  	if (this.state.done)
	    {
	    	var results = _.map(this.state.data.authors, function(item, index) {
				var i = item[0];
		        return (
		        	<ContributorThumbnail avatarUrl={i.author.avatar_url}
		        						  topCaption={item.length + ' contrib.'}
		        						  bottomCaption={i.author.login}
		        						  owner={i.author.login}
		        						  key={index} />
		        );
			});

	    	if(this.state.data.numberOfMrMoustacheNeeded.true > 0)
				var anonymousResult = <div><h4>Sans oublier les contributions anonymes</h4>
		          					  <div className="row">
		          					  	<AnonymousThumbnail avatarUrl={'img/anonymous.png'}
							        						topCaption={this.state.data.numberOfMrMoustacheNeeded.true + ' contrib.'}
							        						bottomCaption={'Mr. Moustache'} />
							          </div></div>;
	    	return (
    			<div className="container-fluid">
    				<h4>Liste des {this.state.data.authors.length} contributeurs ayant contribué sur les {this.state.data.numberOfCommits} derniers commits</h4>
	      			<div className="row">
	          			{results}
	          		</div>
	          		{anonymousResult}
	        	</div>
	    	);
	    }
	    else {
	    	if (this.state.done)
	      		return (<div>Aucune donnée à afficher</div>);
	      	return (<ProgressBarComponent progression={true} />);
	    }
	}
});


var LastYearCommitsTimeline = React.createClass({
  	loadCommitsStats: function() {
	    var gitHubRequester = new GitHubRequester();
	    var fullName = this.props.params.owner + "/" + this.props.params.repository;
	    var ajaxRequest = gitHubRequester.getCommitActivity(fullName);
	    ajaxRequest
	      .done(function(data) {
	          this.setState({data: data});
	        }.bind(this))
	      .fail(function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this));
	},
	updateDimensions: function() {
        this.setState({width: $(window).width()});
    },
  	componentWillMount: function() {
		this.loadCommitsStats();
		this.updateDimensions();
	},
    componentDidMount: function() {
        window.addEventListener("resize", this.updateDimensions);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateDimensions);
    },
	getInitialState: function() {
    	return {data: []};
	},
	render: function() {
	  	if (!_.isUndefined(this.state.data))
	    {
	    	var results = _.map(this.state.data, function(item, index) {
		        return (
					{time : item.week, data: item.total}
		        );
	    	});

	    	var value = _.find(results, function(o) {return o.data > 0;});
			if (!_.isUndefined(value) && value.data > 0) {
		    	return (
		    		<div className="container-fluid">
		    			<h4>Liste des commits sur les 52 dernières semaines</h4>
		        		<BarChart width={this.state.width} data={results}/>
		        	</div>
		    	);
	    	}
	    	else {
				return (<div className="container-fluid">Aucune donnée à afficher</div>);
	    	}
	    }
	    else {
	      return (<ProgressBarComponent progression={true} />);
	    }
	}
});

var LastHundredCommitsTimeline = React.createClass({
	loadCommits: function() {
	    var gitHubRequester = new GitHubRequester();
	    var fullName = this.props.params.owner + "/" + this.props.params.repository;
	    var ajaxRequest = gitHubRequester.getLast100CommitsWithGraph(fullName, 100);
	    ajaxRequest
	      .done(function(data) {
	      	  this.setState({data: data, done: true});
	        }.bind(this))
	      .fail(function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this));
	},
	getInitialState: function() {
	    return {data: [], done: false};
	},
	updateDimensions: function() {
        this.setState({width: $(window).width()});
    },
  	componentWillMount: function() {
		this.loadCommits();
		this.updateDimensions();
	},
    componentDidMount: function() {
        window.addEventListener("resize", this.updateDimensions);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateDimensions);
    },
	render: function() {
	  	if (this.state.done)
	    {
	    	var trueResultsToDisplay = [];
	    	var counter = 0;

	    	var results = _.each(this.state.data.commitsGrouppedByDate, function(item) {
	    		//trueResultsToDisplay.push(<h4>{new Tools().getFormattedDate(item[0].commit.author.date)}</h4>);
	    		_.map(item, function(i, index){
	    			var topCaption = new Tools().getFormattedDate(i.commit.author.date);
		    		if (i.author == null)
		    		{
		    			trueResultsToDisplay.push(<AnonymousThumbnail avatarUrl={'img/anonymous.png'}
							        						topCaption={topCaption}
							        						bottomCaption={'Mr. Moustache'}
							        						key={counter} />);
		    		}
					else {
				        trueResultsToDisplay.push(
				        	<ContributorThumbnail avatarUrl={i.author.avatar_url}
				        						  topCaption={topCaption}
				        						  bottomCaption={i.author.login}
				        						  owner={i.author.login}
				        						  key={counter}/>
				        );
				    }
				    counter++;
			    });
			});
	    	return (
    			<div>
	    			<div className="container-fluid">
		    			<h4>Liste des {this.state.data.committersCount} contributeurs ayant contribué sur les {this.state.data.commitsSum} derniers commits</h4>
		    		</div>
	      			<BarChart width={this.state.width} data={this.state.data.statsData}/>
	      			<div className="container-fluid">
			      		<div className="row">
		          			{trueResultsToDisplay}
		          		</div>
	          		</div>
        		</div>
	    	);
	    }
	    else {
	      return (<ProgressBarComponent progression={true} />);
	    }
	}
});

var ContributorThumbnail = React.createClass({
	render: function() {
		return (
			<div className="col-xs-3 col-sm-2 col-md-2 col-lg-1">
				<Link to="owner" params={{owner: this.props.owner}}>
					<ThumbnailContent topCaption={this.props.topCaption} bottomCaption={this.props.bottomCaption} avatarUrl={this.props.avatarUrl}/>
				</Link>
			</div>
		)
	}
});

var AnonymousThumbnail = React.createClass({
	render: function() {
		return (
			<div className="col-xs-3 col-sm-2 col-md-2 col-lg-1 container-fluid">
				<ThumbnailContent topCaption={this.props.topCaption} bottomCaption={this.props.bottomCaption} avatarUrl={this.props.avatarUrl}/>
			</div>
		)
	}
});

var ThumbnailContent = React.createClass({
	render: function() {
		return (
			<div className="thumbnail">
				<span className="caption-btm">
					<p>{this.props.topCaption}</p>
				</span>
				<span className="caption-btm bottom">
					<p>{this.props.bottomCaption}</p>
				</span>
				<img src={this.props.avatarUrl} />
			</div>
		)
	}
});