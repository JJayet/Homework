/** @jsx React.DOM */
var Link = ReactRouter.Link;

var GitHub = React.createClass({
  loadGitRepositories: function(query, pageNumber) {
    this.setState({progression: true});
    var gitHubRequester = new GitHubRequester();
    var ajaxRequest = gitHubRequester.searchForRepositories(query, pageNumber);
    ajaxRequest
      .done(function(data) {
          this.setState({progression: false});
          this.setState({data: data});
          this.setState({query: query});
          this.setState({currentPage: pageNumber});
        }.bind(this))
      .fail(function(xhr, status, err) {
          this.setState({progression: false});
          console.error(this.props.url, status, err.toString());
        }.bind(this));
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
  },
  handleSubmit: function(e) {
    if (!e) {
      return;
    }
    this.loadGitRepositories(e, 1);
    return;
  },
  handlePageChange: function(e) {
    this.loadGitRepositories(this.state.query, e);
  },
  render: function() {
    return (
      <div className="container">
        <GitHubSearch handleSubmit={this.handleSubmit} />
        <GitHubResults progression={this.state.progression} currentPage={this.state.currentPage} data={this.state.data} handlePageChange={this.handlePageChange}/>
      </div>
    );
  }
});

var GitHubSearch = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    this.props.handleSubmit(this.refs.repo.getDOMNode().value.trim());
  },
  render: function() {
    
    return (
      <div className="page-header">
        <h1>GitHub <small>Homework</small></h1>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Repository name" ref="repo" text={this.props.searchTerm} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">
                <span className="glyphicon glyphicon-search"></span>
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
});

var GitHubResults = React.createClass({
  render: function() {    
    if (!_.isUndefined(this.props.data.items))
    {
      var gitNodes = _.map(this.props.data.items, function(item, index) {
        return (
          <GitHubResult owner={item.owner.login} key={index} name={item.name} language={item.language} />
        );
      });

      return (
        <div className="list-group">
          <h4>Total : {this.props.data.total_count} résultat{this.props.data.total_count > 1 ? 's' : ''} <small>{this.props.data.total_count > 1000 ? "(seuls 1000 sont accessibles dû à une limitation de l'API GitHub)" : ""}</small></h4>
          <ProgressBarComponent progression={this.props.progression} />
          <GitHubPagination currentPage={this.props.currentPage} total_count={this.props.data.total_count} handlePageChange={this.props.handlePageChange} />
            {gitNodes}
          <GitHubPagination currentPage={this.props.currentPage} total_count={this.props.data.total_count} handlePageChange={this.props.handlePageChange} />
        </div>
      );
    }
    else {
      return (<ProgressBarComponent progression={this.props.progression} />);
    }
  }
});

var GitHubResult = React.createClass({
  render: function() {  
      return (
        <Link to="repository" params={{owner: this.props.owner, repository: this.props.name}} className="list-group-item clearfix">
          <h4 className="list-group-item-heading">{this.props.name}</h4>
          <div className="pull-left">{this.props.owner}</div>
          <div className="pull-right">{this.props.language}</div>
        </Link>
    );
  }
});

var GitHubPagination = React.createClass({
  handlePageChange: function(e) {
    e.preventDefault();
    var page = e.target.text;
    var total = this.props.total_count > 1000 ? 1000 : this.props.total_count;
    var newPage = page == "«" ? 1 : page == "»" ? Math.ceil(total / 30) : page;
    this.props.handlePageChange(newPage);
  },
  render: function() {
    var total = this.props.total_count > 1000 ? 1000 : this.props.total_count;
    var numberOfPages = Math.ceil(total / 30);
    if (numberOfPages > 1)
    {
      var currentPage = parseInt(this.props.currentPage);
      var firstPage = currentPage - 4 > 0 && currentPage == numberOfPages ? currentPage - 4 
                                                                          : currentPage - 3 > 0 && currentPage >= numberOfPages - 1 ? currentPage - 3 
                                                                                                                                : currentPage - 2 <= 0 ? currentPage - 1 <= 0 ? 1 
                                                                                                                                : currentPage - 1 
                                                                                                                                : currentPage - 2;
      var lastPage;
      for (var i = currentPage == 1 ? 4 : currentPage == 2 ? 3 : 2; i >= 0; i--) {
        if (currentPage + i <= numberOfPages) 
        {
          lastPage = currentPage + i;
          break;
        }
      }
      
      if (firstPage >= 0)
      {
        var rows = [];
        rows.push(<li className={currentPage == 1 ? "disabled" : ""} key={firstPage - 1}><a href="#" onClick={this.handlePageChange}>&laquo;</a></li>);
        for (var i = firstPage; i <= lastPage; i++) {
          if (i == currentPage)
            rows.push(<li className="active" key={i}><a href="#">{i}</a></li>);
          else
            rows.push(<li key={i}><a href="#" onClick={this.handlePageChange}>{i}</a></li>);
        }
        rows.push(<li className={currentPage == numberOfPages ? "disabled" : ""} key={lastPage + 1}><a href="#" onClick={this.handlePageChange}>&raquo;</a></li>);
      }
      return (
        <ul className="pagination">
         {rows}
        </ul>
      );
    }
    return (<div></div>);
  }
});