// Google Key AIzaSyCDiyb6NpKXFUvRkcd61mGwSImhIr10Src
$(function () {

	var foundMarkers = [];
	var foundLatLong = [];
	var singleMarker;
	var infowindow;
	var tempCount;
	var currentWaterColor = '#68c3d9';
	var currentLandscapeColor = '#d6cfd5';
	
	$('#zipcode').focus();
	
	
	//Map Settings
	var mapSettings = {
		zoom: 5,
		center: new google.maps.LatLng(37.09024, -100.712891),
		// mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		
		panControlOptions: {
			position: google.maps.ControlPosition.BOTTOM_LEFT
		},
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: false,
	}
	//Map style
	var mapStyle = [
            {
				stylers: [
					{ hue: '#8dc63f' },
					{ visibility: 'simplified' },
					{ gama: 0.5 },
					{ weight: 0.5 }	
				]
			},
			{
				elementType: 'labels',
				stylers: [
					{ visibility: 'on' }
				]
			},
			{
				featureType: 'water',
				stylers: [
					{ color: currentWaterColor }
				]
			},
			{
				featureType: 'landscape',
				stylers: [
					{ color: currentLandscapeColor }
				]
			}
          ]
	
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapSettings);
	map.setOptions({
		styles: mapStyle
	});

	//Acction when search
	$('#dosearch').click( function () {
		doSearchAPI ();
	});
	
	//Change landscape color
	$('#landscape-radio-group').on('change', function() {
	   var landColor = ($('input[name=landscape-radio]:checked', '#landscape-radio-group').val());
	   var waterColor = ($('input[name=water-radio]:checked', '#water-radio-group').val());
	   
	   currentLandscapeColor = landColor;
	   
	   if (!waterColor) {
		   waterColor = currentWaterColor;
	   }
	   
	   
	   var mapStyle  = [
				{
					stylers: [
						{ hue: '#8dc63f' },
						{ visibility: 'simplified' },
						{ gama: 0.5 },
						{ weight: 0.5 }	
					]
				},
				{
					elementType: 'labels',
					stylers: [
						{ visibility: 'on' }
					]
				},
				{
					featureType: 'water',
					stylers: [
						{ color: waterColor }
					]
				},
				{
					featureType: 'landscape',
					stylers: [
						{ color: landColor }
					]
				}
			  ]
			  
		map.setOptions({
			styles: mapStyle
		});
	});
	
	//Change Water color
	$('#water-radio-group').on('change', function() {
	   var landColor = ($('input[name=landscape-radio]:checked', '#landscape-radio-group').val());
	   var waterColor = ($('input[name=water-radio]:checked', '#water-radio-group').val());
	   currentWaterColor = waterColor;
	   
	   if (!landColor) {
		   landColor = currentLandscapeColor;
	   }
	   
	   var mapStyle  = [
				{
					stylers: [
						{ hue: '#8dc63f' },
						{ visibility: 'simplified' },
						{ gama: 0.5 },
						{ weight: 0.5 }	
					]
				},
				{
					elementType: 'labels',
					stylers: [
						{ visibility: 'on' }
					]
				},
				{
					featureType: 'water',
					stylers: [
						{ color: waterColor }
					]
				},
				{
					featureType: 'landscape',
					stylers: [
						{ color: landColor }
					]
				}
			  ]
			  
		map.setOptions({
			styles: mapStyle
		});
	});
	
	//Excecute the search function when the "ENTER" key is pressed
	$(document).keypress( function (e) {
		var key = e?e.keyCode:event.keyCode;
		if (key === 13) {
			doSearchAPI ();
		}
	});

	// Function which does the search
	function doSearchAPI () {
		var dataFound = 0;
		//check if valid input
		var customZipCode = $('#zipcode').val();
		if (!$.isNumeric(customZipCode)) {
			alert('Zip Code is NOT a number');
			return
		} else if (customZipCode.length != 5) {
			alert('Wrong Zip Code format');
			return
		} else {
			console.log('Great!!!');
		}
			
		
		//Clean previous search
		clearOverlays();
		$('.flex-item-odd, .flex-item-even').remove();
		if (!customZipCode) {
			// console.log('empty');
			
		} else {
			console.log(customZipCode);
			
			$.ajax({
				Type: "GET",
				contentType: "application/json; character=utf-8",
				dataType: 'JSONP',
				url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + customZipCode,
				beforeSend: function () {
					$('#loadingDiv').addClass('loadingAjax');	
					$('#loadingDiv').removeClass('no-view');
				},
				success: function (data) {
					if ( data.results[0].id === "Error" ){	//Check if Empty response
						alert("Didn't find that zip code.");
						$('#loadingDiv').removeClass('loadingAjax');
						$('#loadingDiv').addClass('no-view');
						foundMarkers = [];
						return
					}
					
					if ($( window ).width() > 1280) {			
						$('.flex-container').animate({
							left: '0',
						}, 800);
						$('.map-view').css("width", "70%");
					} else if ($( window ).width() > 769){
						$('.flex-container').animate({
							left: '0',
						}, 800);
						$('.map-view').css("width", "60%");
					} else {
						$('.map-view').css("height", "80%");
					}
					
					dataFound = 1;
					var countRow = 0;
					$.each(data.results, function (id, value){
						// console.log(value.id);
						// console.log(value.marketname);
						$.ajax({
							Type: "GET",
							contentType: "application/json; character=utf-8",
							dataType: 'JSONP',
							url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + value.id,
							// beforeSend:,
							success: function (data) {
								
								//console.log(data.marketdetails);
								var googleLink = decodeURIComponent(data.marketdetails.GoogleLink);
								var latLong = googleLink.split('=')[1];
								latLong = latLong.split('(')[0];
								var latitud = latLong.split(',')[0];
								var longitud = latLong.split(',')[1];
								
								//Alternate colors for each line
								countRow ++;
								if (countRow % 2 === 0) {
									var itemClass = "flex-item-even";
								} else {
									var itemClass = "flex-item-odd";
								}
								
								var myDiv = '<div class="' + itemClass + '">' +
										'<div class="wrapper">' +
										'<h3 class="p-clean">' + $.trim(value.marketname) + '</h3>' +
										'<h4 class="p-clean">' + $.trim(data.marketdetails.Address) + '</h4>'
										
										var tempSchedule = data.marketdetails.Schedule.replace(/<br>/g, '');
										if (tempSchedule) {
											myDiv += '<p class="p-clean">' + $.trim(tempSchedule) + '</p>'
										}
										
										myDiv += 	'</div>' +
													'</div>'
								$('.flex-container').append(myDiv);
								
								currentPosition = new google.maps.LatLng(latitud,longitud),
								
								singleMarker = new google.maps.Marker ({
									position: currentPosition,
									map: map,
									title: value.marketname,
									animation: google.maps.Animation.DROP,
									icon: "img/marker-filled.png",
									html: myDiv
								});

								foundLatLong.push(currentPosition);
								foundMarkers.push(singleMarker);
								tempCount ++;
				
								//Open Information Window on Map
								infowindow = new google.maps.InfoWindow({
								  content: myDiv
								});

								google.maps.event.addListener(singleMarker, 'click', function () {
									infowindow.setContent(this.html);
									infowindow.open(map, this);
								});	
								
								//Get bounds
								var bounds = new google.maps.LatLngBounds ();
								$.each(foundLatLong, function (id, value) {
									bounds.extend (value);
								});
								//Center map
								map.setCenter(bounds.getCenter());
								map.fitBounds (bounds);
								dataFound = 1;
							},
							error: function () {
								$('#loadingDiv').removeClass('loadingAjax');
								$('#loadingDiv').addClass('no-view');
							}
						});
						
					});
					//Get the screen size 
					$('#loadingDiv').removeClass('loadingAjax');
					$('#loadingDiv').addClass('no-view');
				},
				error: function () {
					$('#loadingDiv').removeClass('loadingAjax');
					$('#loadingDiv').addClass('no-view');
				}
			});
		}
	};

	//Clean previous search
	function clearOverlays() {
		for (var i = 0; i < foundMarkers.length; i++ ) {
			foundMarkers[i].setMap(null);
		}
		foundMarkers.length = 0;
		foundMarkers = [];
		foundLatLong = [];
	}

});

































