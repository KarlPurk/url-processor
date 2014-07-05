var phantom = require('phantom'),
	argv = require('yargs').argv;

/**
 * Parses the data returned from phantom and
 * returns a new object containing header and url.
 * 
 * Data will contain the following properties:
 *  - header
 *  - origin
 *  - href
 *
 * The returned object will contain the following properties:
 *  - title
 *  - url
 */
var parseData = function(data) {

	/**
	 * Parses the URL from the data object
	 */
	var parseUrl = function(data) {
			var matches = data.header.innerHTML.match(/href="([^"]+)"/);
			if (matches === null) {
				return data.href;
			}
			return data.origin + matches[1];
		},

		/**
		 * Parses the page title from the data object
		 */
		parseTitle = function(data) {
			var title = data.header.innerText;
			title = title.replace("\n", ' - ');
			return title;
		},

		/**
		 * Extract the page URL
		 */
		url = parseUrl(data),
		
		/**
		 * Extract the page title
		 */
		title = parseTitle(data);

	/**
	 * Return an object that contains the parsed title and URL
	 */
	return {
		title: title,
		url: url
	};
};

/**
 * Parses a single URL and returns an object that represents
 * the page header and URL.  The object returned contains
 * the following parameters:
 *  - title
 *  - url
 */
var getDataFromUrl = function(url, cb) {

	/**
	 * Create an instance of phantom
	 */
	phantom.create(function(ph) {

		/**
		 * Create a phantom page object
		 */
		ph.createPage(function(page) {

			/**
			 * Request the specified URL
			 */
			page.open(url, function(status) {

				/**
				 * Evaluate the given function in the context of the webpage
				 */
				page.evaluate(function() {

					/**
					 * Return the h1 element, the origin and href from the webpage
					 */
					return {
						header: document.getElementsByTagName('h1')[0],
						origin: location.origin,
						href: location.href
					};
				}, 
				/**
				 * Handle the data returned from the evaluation call
				 */
				function(data) {

					/**
					 * Parse the data into a specialised object
					 */
					var data = parseData(data);	
					
					/**
					 * Invoke the callback, passing the parsed data
					 */
					cb(data);

					/**
					 * Exit phantom
					 */
					ph.exit();
				});
			});
		});
	});
};

/**
 * Allow this script to be used stand-alone from the command line.
 */
if (argv.url) {
	getDataFromUrl(argv.url, console.log);
}

module.exports = {

	/**
	 * Parses a single URL or array of URLs
	 * and invokes the callback function for each
	 * URL that is parsed.
	 */
	parseUrl: function(urls, cb) {
		/**
		 * Turn a URL string into an array
		 */
		if (!urls instanceof Array) {
			urls = [urls];
		}
		/**
		 * Loop through each URL and invoke getDataFromUrl
		 * passing the URL and callback
		 */
		urls.forEach(function(url) {
			getDataFromUrl(url, cb);
		})
	},
};
