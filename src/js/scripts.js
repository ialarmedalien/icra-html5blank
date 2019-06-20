"use strict";

var icra_scripts = function(){
};

icra_scripts.prototype = {

	constructor: icra_scripts,

	init: function() {
		var self = this;
		if (document.readyState !== "loading"){
			self.go();
		} else if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", self.go);
		} else {
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState !== "loading") {
					self.go();
				}
			});
		}
	},

	go: function() {
		// do we have a chartify table?
		var self = this,
		tables = document.querySelectorAll(".pie-chartify"),
		b = document.getElementsByTagName('body')[0];
		// we have javascript!
		b.classList.add('js');
		self.responsiveMenu();
		if (tables.length > 0) {
			var req = encodeURIComponent( '{"modules":[{"name":"visualization","version":"1.0","packages":["corechart"],"callback":pieChartify}]}' );

			self.addScript("google-jsapi", "https://www.google.com/jsapi?autoload=" + req);
		}

		if (document.getElementById("fb-root")) {
			self.addScript("facebook-jssdk", "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3");
		}
		// GA
		(function(f,i,r,e,s,h,l){i['GoogleAnalyticsObject']=s;
		f[s]=f[s]||function(){
		(f[s].q=f[s].q||[]).push(arguments)},f[s].l=1*new Date();
		h=i.createElement(r),
		l=i.getElementsByTagName(r)[0];
		h.async=1;
		h.src=e;
		l.parentNode.insertBefore(h,l)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-59710430-1', 'icraeastbay.org');
		ga('send', 'pageview');
	},

	/*
		Add a script to the page
	*/
	addScript: function(id, src) {
		var
		s = document.getElementsByTagName("script")[0],
		js = document.createElement("script");
		if (document.getElementById(id)) {
			return;
		}
		js.id = id;
		js.src = src;
		js.async = 1;
		s.parentNode.insertBefore(js, s);
	},

	/**
		Pass in an HTML table
		extract the data and create a DataTable object from it
	*/
	dataTableFromTable: function (t) {
		var tbl = new google.visualization.DataTable(),
		col_type = "string";

		[].forEach.call( t.getElementsByTagName("th"), function(v,i){
			if (1 === i) {
				col_type = "number";
			}
			tbl.addColumn(col_type, v.textContent );
		});

		[].forEach.call( t.querySelectorAll("tbody tr"), function(v) {
			var arr = [].map.call(v.getElementsByTagName("td"), function(v2,i2){
				if (0 === i2) {
					return v2.textContent;
				}
				return parseFloat( v2.textContent );
			});
			tbl.addRow(arr);
		});
		return tbl;
	},

	/**
		create a chart for each of the tables with the class "pie-chartify"
		inserts a div after the table element that contains the chart
	*/
	pieChartify: function () {
		var i,
		tables = document.querySelectorAll(".pie-chartify"),
		tl = tables.length, id, dt,
		opt = {
			pieSliceText: "none",
			tooltip: {
				text: "percentage"
			},
			chartArea: {
				width: "90%",
				height: "90%"
			},
			width: 600,
			height: 400,
			legend: {
				position: "labeled"
			},
			fontName: "Helvetica",
			fontSize: 16,
			is3D: true
		},
		c;

		// get the data from the table
		for (i = 0; i < tl; i++) {
			id = "chart-" + i,
			dt = this.dataTableFromTable( tables[i] );
			// insert a div after the table
			tables[i].insertAdjacentHTML("afterend", "<div class='piechart' id='" + id + "'></div>");

			c = new google.visualization.PieChart(
				document.getElementById(id)
			);
			c.draw(dt, opt);
		}
	},

	handleEvent: function (e) {
		var t, self = this;

		console.log("handling a " + e.type + " on " + e.target.nodeName + "; event phase: " + e.eventPhase);

		if (e.target.hasAttribute("id") && ( "navlinkS" === e.target.id || "navlinkA" === e.target.id || "navlink" === e.target.id ) ) {
			self.menu.classList.toggle("show");
			return;
		}
		if (e.target.classList.contains("expand")) {
			e.preventDefault();
			// get the nextSibling and toggle the 'show' property
			t = e.target.parentNode.nextSibling;
			while ("UL" !== t.nodeName) {
				t = t.nextSibling;
				if (undefined === typeof t) {
					return;
				}
			}
			t.classList.toggle("show");
			// swap the content of the node

			return;
		}
	},

	responsiveMenu: function () {
		var self = this,
		menu = document.querySelector("nav > ul"),
		nav = menu.parentNode,
		subMenus = menu.querySelectorAll(".menu-item-has-children > a"),
		sl = subMenus.length,
		navl = document.querySelector("#navlinkA"),
		s,
		t;

		self.menu = menu;

		for (s = 0; s < sl; s++) {
			// add in the expanders
			subMenus[s].innerHTML =
				subMenus[s].innerHTML + "<span class='expand'>&#xe625;</span>";
		}
		navl.innerHTML = navl.innerHTML + "<span id='navlinkS' class='expand'>&#xe625;</span>";

		// add an event handler to the menu
		nav.addEventListener('click', self, false);

	}
};

/**
	Polyfills required:

	classList
	addEventListener
	[].forEach
	[].map

*/
function pieChartify() {
	var ic = new icra_scripts();
	ic.pieChartify();
}

(function () {
	var ic = new icra_scripts();
	ic.init();
}());
