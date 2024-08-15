//Adding tile Layer for background
let baseMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        });

// creating map object
let map = L.map("map", {
    center: [35.46, -97.03],
    zoom: 5
});

baseMap.addTo(map);

// Call to retrieve earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    // Your data markers should reflect the magnitude of the earthquake by their size and the depth of the
    // earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with
    // greater depth should appear darker in color.

    //marker formatting
    function markerStyle(feature) {
        return {
            fillOpacity: 1,
            fillColor: depthColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag),
            weight: 0.5
            };
        }

    //function to determine color 
    function depthColor(depth) {
        switch(true) {
            case depth > 100:
                return "#982b2b";
            case depth > 75:
                return "#c12929";
            case depth > 50:
                return "#e22f2f";
            case depth > 25:
                return "#f04747";
            case depth > 10:
                return "#f58383";
            default: 
                return "#fed5d5";
        }
    }

    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }


 
    //GeoJSON layer
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: markerStyle,
        // popup for markers showing where, when, magnitude and depth
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                <h3>${feature.properties.place}</h3> <hr> 
                <p> 
                ${new Date(feature.properties.time)} <br>
                Magnitude: ${feature.properties.mag} <br>
                Depth: ${feature.geometry.coordinates[2]}
                </p>`);
        }
    }).addTo(map)

    //Legend
    let Legend = L.control({
        position: "bottomleft"
    });
    
    Legend.onAdd = function () {
        let div = L.DomUtil.create("div", "Legend");
        let grades = [-10, 10, 25, 50, 75, 100];
        let colors = ["#fed5d5", "#f58383", "#f04747", "#e22f2f", "#c12929", "#982b2b"];
    
        // Add some CSS styling for the legend
        div.innerHTML += '<style>.Legend i { background: #fff; border-radius: 50%; width: 18px; height: 18px; display: inline-block; margin-right: 8px; } .Legend { background: white; padding: 10px; border: 1px solid #ccc; } .Legend i { border-radius: 50%; }</style>';
        
        // Loop to generate labels and formatting
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };
    
    Legend.addTo(map);
    
});
