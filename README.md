# Jose Rascon's Map Project

This page shows in the map local farmer markets when a zip code is specified. It is responsive, so the layout changes depend of the screen size. It was a great challenge, due I wanted to learn how to add a map in a page, and I learned it along with jQuery and CSS in my CodeLou course. 


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. No deployment is necessary.


### Prerequisites
1 - Browser with internet.
2 - Google Maps API Key (For CodeLou test purpose, I have leave mine in the code)

Examples:
- Google Chrome
- Mozilla Firefox
- Microsoft Internet Explorer
- Apple Safari


### Installing
1 - Download the project 
2 - Double click on "index.html"
3 - Enjoy


## Author
* **Jose Rascon**
- https://github.com/jalainrn


## Acknowledgments
* This Project is consuming the USDA's API which provide all data.
- https://www.ams.usda.gov
- http://search.ams.usda.gov/farmersmarkets/v1/svcdesc.html

1 - Market API
http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=

2 - Detail API
http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id="


### Important!!!
- It is responsive. However, make sure to refresh the page each time you resize the screen. Due I am doing some animation through jQuery, if the screen is resized by hands it will keep the properties jQuery previously made.

- When the width of the screen is less than 769px, the map will cover the whole screen (Width:100%, height:100%). Ones you do a search, if any data is found, the screen will be resizing to 80% height. it is because, it is thought for mobile devices. By showing one record on the bottom, I am letting the user know that there is data below the Map.
