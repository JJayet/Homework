/** @jsx React.DOM */
var Owner = React.createClass({
	loadOwner: function() {
		var requester = new GitHubRequester();
		var ajaxRequest = requester.getUser(this.props.params.owner);
		ajaxRequest
			.done(function(data) {
	          this.setState({data: data});
	        }.bind(this))
	    	.fail(function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this));
	},
	componentWillMount: function() {
		this.loadOwner();
	},
	getInitialState: function() {
		return {data: []};
	},
	render: function() {
	    return (
	    	<div className="container-fluid">
	    		<div className="panel panel-default">
	    			<div className="panel-heading">
				    	<OwnerHeader avatarUrl={this.state.data.avatar_url}
				    				 login={this.state.data.login}
				    				 name={this.state.data.name}
				    				 publicRepos={this.state.data.public_repos}
				    				 followers={this.state.data.followers} />
				    </div>
				    <div className="panel-body">
			    		<OwnerRepos publicRepos={this.state.data.public_repos} owner={this.props.params.owner} />
			    	</div>
		    	</div>
		    </div>
	    );
	}
});

var OwnerHeader = React.createClass({
	render: function() {
		return (
			<div className="media">
			  	<div className="media-left" href="#">
			    	<img src={this.props.avatarUrl} alt={this.props.login + "\'s avatar"} />
			  	</div>
			  	<div className="media-body">
					<h4 className="media-heading">{this.props.login} {this.props.name != "" ? "(" + this.props.name + ")" : ""}</h4>
			    	<span><b>{this.props.publicRepos}</b> Repos publiques</span><br/>
			    	<span><b>{this.props.followers}</b> Followers</span>
				</div>
			</div>
	    );
	}
})

var OwnerRepos = React.createClass({
	loadOwnerRepos: function(pageNumber) {
		var requester = new GitHubRequester();
		var ajaxRequest = requester.getUserPublicRepos(this.props.owner, pageNumber);
		ajaxRequest
			.done(function(data) {
	          this.setState({data: data});
	        }.bind(this))
	    	.fail(function(xhr, status, err) {
	          console.error(this.props.url, status, err.toString());
	        }.bind(this));
	},
	componentWillMount: function() {
		this.loadOwnerRepos(1);
	},
	getInitialState: function() {
		return {data: [], currentPage: 1};
	},
	handlePageChange : function(e) {
		this.loadOwnerRepos(e);
		this.setState({currentPage: e});
	},
	render: function() {
	    if (this.state.data.length > 0)
	    {
		    var ownerRepos = _.map(this.state.data, function(item, index) {
		    	return (
		        	<GitHubResult owner={item.owner.login} key={index} name={item.name} language={item.language} />
		    	);
		    });

	      return (
	        <div className="list-group">
	          <ProgressBarComponent progression={this.props.progression} />
	          <GitHubPagination currentPage={this.state.currentPage} total_count={this.props.publicRepos} handlePageChange={this.handlePageChange} />
	            {ownerRepos}
	          <GitHubPagination currentPage={this.state.currentPage} total_count={this.props.publicRepos} handlePageChange={this.handlePageChange} />
	        </div>
	      );
	    }
	    else {
	      return (<ProgressBarComponent progression={this.props.progression} />);
    	}
	}
});