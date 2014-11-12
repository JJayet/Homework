/** @jsx React.DOM */
var ProgressBarComponent = React.createClass({
	render: function() {
		if (this.props.progression)
	    {
	    	var style = {width: '100%'};
	    	return (
	    		<div className="progress progress-striped active">
	        		<div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={style}></div>
	        	</div>
	    	);
	    }
		return (
			<div></div>
		);
	}
});