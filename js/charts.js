function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // d3.json("samples.json").then(function(data){
  //   console.log(data);
  // });

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleArray[0];
    
    //console.log("sampleArray --> " , sampleArray);
    //console.log("firstSample -->" , firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    //console.log("otu_labels = " + otu_labels);

    var toptuids = otu_ids.slice(0,10);
    //console.log("toptuids = " + toptuids);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var top10Values = toptuids.map(toptuids => "OTU " + toptuids);
    //console.log("top10Values = " + top10Values); 
   
    var yticks = sample_values.sort((a,b) => a-b).reverse().slice(0,10);
    //var yticks = otu_ids.slice(0, 10).map(id => "OTU " + id).reverse();
    //console.log("yticks = " + yticks); 

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: yticks.reverse(),
      y: top10Values.reverse(),
      name: "Something",
      type: "bar",
      orientation: "h"
    };
    var bData = [barData];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    // 10. Use Plotly to plot the bar data and layout. 
    Plotly.newPlot("bar-plot", bData, barLayout);

    // Create a Bubble Chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
    //console.log("bubbleData -->" + bubbleData);
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title: "OTU ID", automargin: true },
      yaxis: { automargin: true },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the bubble data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, { reponsive: true });


    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gData, gaugeLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_SelID = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SelID[0]);

    // 3. Create a variable that holds the washing frequency.
    var washFreqz = metadata_SelID[0];
    //console.log("washFreqz --> " + Object.values(washFreqz)[6]);
    var washFreq = Object.values(washFreqz)[6];

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10],
          tickmode: "array",
          tickvals: [0, 2, 4, 6, 8, 10],
          ticktext: [0, 2, 4, 6, 8, 10]
        },
        bar: { color: 'black' },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    }];
    var gData = [gaugeData];
    //console.log("gData --> " + gData);
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      autosize: true,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "This gauge displays users weekly washing frequency",
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  
  // close d3  
  });

// close of buildCharts function 
}
