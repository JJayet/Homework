/** @jsx React.DOM */
var Chart = React.createClass({
	render: function() {
		return (
	    	<svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
		);
	}
});

var Bar = React.createClass({
	getDefaultProps: function() {
		return {
		    width: 0,
		    height: 0,
		    offset: 0
		}
	},
	render: function() {
		var color = "rgb(0, 0, " + (this.props.value * 10) + ")";
		return (
		    <rect fill={color}
		    	width={this.props.width} height={this.props.height} 
		    	x={this.props.offset} y={this.props.availableHeight - this.props.height} />
		);
	}
});

var Title = React.createClass({
	getDefaultProps: function() {
		return {
	    	offset: 0
		}
	},
	render: function() {
		return (
	    	<text textAnchor="middle" fontFamily="sans-serif" fontSize="11px" fill="white"
      			x={this.props.offset + (this.props.width / 2)} y={this.props.availableHeight - this.props.height + 10}>{this.props.value}</text>
		);
	}
});

var DataSeries = React.createClass({
	getDefaultProps: function() {
		return {
		    title: '',
		    data: []
		}
	},
	render: function() {
		var props = this.props;

		var yScale = d3.scale.linear()
		  .domain([0, d3.max(this.props.data)])
		  .range([0, this.props.height]);

		var xScale = d3.scale.ordinal()
		  .domain(d3.range(this.props.data.length))
		  .rangeRoundBands([0, this.props.width], 0.05);
		
		var xAxis = d3.svg.axis()
		    .scale(xScale)
		    .orient("bottom");
		 
		var yAxis = d3.svg.axis()
		    .scale(yScale)
		    .orient("left");

		var bars = this.props.data.map(function(point, i) {
			return (
				<Bar value={point} height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} key={i} />
			)
		});
		var titles = this.props.data.map(function(point, i) {
			return (
		  		<Title height={yScale(point)} width={xScale.rangeBand()} availableHeight={props.height} value={point} offset={xScale(i)} key={i} />
			)
		});
		return (
			<g>
				{xAxis}
				{yAxis}
				{bars}
				{titles}
			</g>
		);
	}
});

var BarChart = React.createClass({
	getDefaultProps: function() {
		return {
		    width: 1000,
		    height: 300
		}
	},
	render: function() {
	  return (
	    <Chart width={this.props.width} height={this.props.height}>
	    	<DataSeries data={this.props.data} width={this.props.width} height={this.props.height} />
	    </Chart>
	  );
	}
});