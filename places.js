
// Steps:
//  1. Get current position
//  2. Search google for places near location
//  3. Decide on list of places to choose? (each choose a few and exchange with others)
//  4. Display each place for user to vote
//  5. After all places are voted, notify peers of results
//  6. Display results

var location = {};
// Number of places to choose from list returned by API
var selections = 3;
var map = new google.maps.Map(document.getElementById('map'));
var service = new google.maps.places.PlacesService(map);

var displayResults = [];


function kickoff() {
	// Setup goodness

	// ~ Initialize message handlers in preparation for messages from peers
	// Set up handler for places that were chosen for voting
	network.funnel('places', compilePlaceSelections);
	// Set up handler for voting results
	network.funnel('choices', compileChoices);


	navigator.geolocation.getCurrentPosition(function (pos) {

	   	location.coords = pos.coords;
	   	location.ll = coords.latitude + ', ' + coords.longitude;

	   	// TODO: need signals
	   	signals.currentPosition = true;

	}, function (error) {
		console.warn('Unable to get user location!');
		// Display failure to user
	});
}


/**
 * Assumes user's current location has been loaded
 */
function searchPlaces() {
	service.nearbySearch({
		keyword: 'lunch',
		location: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
		maxPriceLevel: 2,
		openNow: true,
		radius: 4000,
		type: 'restaurant|food'
	}, pickPlaces);
}


function pickPlaces(places) {
	// Choose N places randomly
	var randomSort = _.sortBy(places, function () { return Math.random(); });
	var picks = _.first(randomSort, selections);

	// Emit picks to other peers
	network.broadcast('places', picks);

	// Add own places to list of selections
	displayResults = displayResults.concat(picks);
}


function compilePlaceSelections(otherPlaces) {
	displayResults = displayResults.concat(otherPlaces);

	// Display results to user for voting
	decisionTime(displayResults);
}


function decisionTime(places) {
	// Display places to user
	// TODO:
}


function handleChoices(choices) {
	// Notify other peers of selections
	// Choices is array of 'yes' selections:
	network.broadcast('choices', choices);
}


function compileChoices(choices) {
	var groups = _.groupBy(choices, _.identity);

	// Sort by number of votes
	var ranking = _.sortBy(groups, function (votes, place) {
		// Negative to sort in descending order
		return (- votes.length);
	});

	var winners = _.first(ranking, selections);

	// TODO: display winners
}



function getLocations() {
	navigator.geolocation.getCurrentPosition(function (pos) {
		console.log('Position:', pos);
		var coords = pos.coords;
		var ll = coords.latitude + ',' + coords.longitude;

		// GOOGLE -----------------------------------------------------------
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			keyword: 'lunch',
			location: new google.maps.LatLng(coords.latitude, coords.longitude), //{ lat: coords.latitude, lon: coords.longitude },
			maxPriceLevel: 2,
			openNow: true,
			radius: 4000,
			type: 'restaurant|food'
		}, function (results, status) {
			console.log('Google results:', results);

			// Random sort (this can probably be improved)
			var rando = _.sortBy(results, function () {
				return Math.random();
			});

			// Take top 5
			var chosen = _.first(rando, 5);

			// Display entries like it's cool
			_.each(chosen, function (business) {
				container.append(template({
					name: business.name,
					vicinity: business.vicinity,
					image: business.photos[0].getUrl({ maxHeight: 300 })
				}));
			});
		})



		// YELP -----------------------------------------------------------
		// Make request
		$.get('/search?term=lunch&ll=' + ll)
			.then(function (response) {
				console.log('Response:', response);

				var results = _.chain(response.businesses)
					.filter(function (b) {
						return !b.is_closed;
					})
					// .(function () {

					// })
			})
	})	
}