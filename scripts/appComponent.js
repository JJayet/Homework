/** @jsx React.DOM */
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var CurrentPath = ReactRouter.CurrentPath;
var DefaultRoute = ReactRouter.DefaultRoute;

var App = React.createClass({
  mixins: [ CurrentPath, ReactRouter.Navigation ],
  render: function() {
    var visible = this.getCurrentPath().length > 1;
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