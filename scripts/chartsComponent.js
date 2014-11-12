/** @jsx React.DOM */
var Chart = React.createClass({
	// componentDidMount: function() {
	// 	var margin = {top: 40, right: 40, bottom: 0, left:0};
	// 	var svg = d3.select('svg')
	// 			    .attr('class', 'chart')
	// 			    .attr('width', this.props.width)
	// 			    .attr('height', this.props.height + margin.top)
	// 			  	.append('g')
	// 			    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	// 	var xScale = d3.scale.ordinal()
	// 			  .domain(_.range(1, this.props.data.length + 1).reverse())
	// 			  .rangeRoundBands([1, this.props.width], 0.05);
		
	// 	var xAxis = d3.svg.axis()
	// 	    .scale(xScale)
	// 	    .orient("bottom");
  
	//     svg.append('g')
	// 	    .attr('class', 'x axis')
	// 	    .attr('transform', 'translate(0, ' + (this.props.height - margin.top - margin.bottom) + ')')
	// 	    .call(xAxis);
	// },
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
		var y = this.props.height > 15 ? this.props.availableHeight - this.props.height + 10 : this.props.availableHeight - this.props.height - 2;
		var fill = this.props.height > 15 ? "white" : "black";
		return (
	    	<text textAnchor="middle" fontFamily="sans-serif" fontSize="11px" fill={fill}
      			x={this.props.offset + (this.props.width / 2)} y={y}>{this.props.value}</text>
		);
	}
});

var DataSeries = React.createClass({
	getDefaultProps: function() {
		return {
		    title: '',
		    data: []
		}
	}
	,
	render: function() {
		var props = this.props;
		
		var yScale = d3.scale.linear()
		  .domain([0, d3.max(this.props.data)])
		  .range([0, this.props.height]);

		var xScale = d3.scale.ordinal()
		  .domain(d3.range(this.props.data.length))
		  .rangeRoundBands([0, this.props.width], 0.05);
		
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
	    <Chart data={this.props.data} width={this.props.width} height={this.props.height}>
	    	<DataSeries data={this.props.data} width={this.props.width} height={this.props.height} />
	    </Chart>
	  );
	}
});