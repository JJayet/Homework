/** @jsx React.DOM */
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var CurrentPath = ReactRouter.CurrentPath;
var DefaultRoute = ReactRouter.DefaultRoute;

var App = React.createClass({
  mixins: [ CurrentPath, ReactRouter.Navigation ],
  handleSubmit: function(e) {
    e.preventDefault();
    this.transitionTo('/', {searchTerm : "coucou"});
  },
	render: function() {
    var visible = this.getCurrentPath().length > 1;
    // <div className="collapse navbar-collapse">
    //             <form className="navbar-form navbar-right" role="search" onSubmit={this.handleSubmit}>
    //               <div className="form-group">
    //                 <input type="text" className="form-control" placeholder="Recherche" />
    //               </div>
    //               <button type="submit" className="btn btn-default"><span className="glyphicon glyphicon-search"></span></button>
    //             </form>
    //           </div>
		return (
      <div>
        { visible ?
          <nav className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="#">Homework</a>
              </div>
            </div>
          </nav>
          : ""}
	        <this.props.activeRouteHandler /> 
      </div>
		);
	}
});

var routes = (
  <Route handler={App}>
  	<DefaultRoute handler={GitHub} />
    <Route name="owner" path="/:owner" handler={Owner}/>
    <Route name="repository" path="/:owner/:repository" handler={Repository}>
      <DefaultRoute name="contributors" path="contributors" handler={ContributorsList} />
      <Route name="commitsActivity" path="commitsActivity" handler={ContributorsActivity} />
      <Route name="LastYearCommitsTimeline" path="LastYearCommitsTimeline" handler={LastYearCommitsTimeline} />
      <Route name="LastHundredCommitsTimeline" path="LastHundredCommitsTimeline" handler={LastHundredCommitsTimeline} />
    </Route>
  </Route>
);

React.renderComponent(<Routes children={routes}/>, document.body);