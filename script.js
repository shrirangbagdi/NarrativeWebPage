let scene = 1;
let selectedCountry = "";
const svg = d3.select("svg");

let data;

d3.csv("fifa.csv").then(function(csv) {

    data = csv;

    data.forEach(function(d) {
        if (d.Winner == "Germany FR") {
            d.Winner = "Germany";
        }
    });

    drawScene();

});

d3.select("#next").on("click", function() {

    if (scene < 3) {
        scene++;
        drawScene();
    }

});

d3.select("#prev").on("click", function() {

    if (scene > 1) {
        scene--;
        drawScene();
    }

});

function drawScene() {

    svg.selectAll("*").remove();

    if (scene == 1) {
        scene1();
    }
    else if (scene == 2) {
        scene2();
    }
    else {
        scene3();
    }

}


function scene1(){

    d3.select("#country").style("display","none");

    d3.select("#message")
        .text("Scene 1: Which countries have won the most World Cups?");

    let wins={};

    data.forEach(function(d){

        if(wins[d.Winner]==null){
            wins[d.Winner]=1;
        }else{
            wins[d.Winner]++;
        }

    });

    let chart=[];

    for(let c in wins){

        chart.push({
            country:c,
            wins:wins[c]
        });

    }

    chart.sort(function(a,b){

        return b.wins-a.wins;

    });

    let x=d3.scaleLinear()
        .domain([0,5])
        .range([150,800]);

    let y=d3.scaleBand()
        .domain(chart.map(d=>d.country))
        .range([50,500])
        .padding(.2);

    svg.append("g")
        .attr("transform","translate(150,0)")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform","translate(0,500)")
        .call(d3.axisBottom(x));

    svg.selectAll("rect")
        .data(chart)
        .enter()
        .append("rect")
        .attr("x",150)
        .attr("y",d=>y(d.country))
        .attr("width",d=>x(d.wins)-150)
        .attr("height",y.bandwidth())
        .attr("fill","steelblue");

    svg.append("text")
        .attr("x",450)
        .attr("y",25)
        .text("Brazil has the most World Cup titles.");
}

function scene2() {

    d3.select("#message")
        .text("Scene 2: The World Cup has grown over time.");

    let x = d3.scaleLinear()
        .domain([1930, 2018])
        .range([100, 800]);

    let y = d3.scaleLinear()
        .domain([0, 35])
        .range([500, 50]);

    svg.append("g")
        .attr("transform", "translate(0,500)")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", "translate(100,0)")
        .call(d3.axisLeft(y));

    let line = d3.line()
        .x(function(d) {
            return x(d.Year);
        })
        .y(function(d) {
            return y(d.QualifiedTeams);
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return x(d.Year);
        })
        .attr("cy", function(d) {
            return y(d.QualifiedTeams);
        })
        .attr("r", 5)
        .attr("fill", "red");

    svg.append("text")
        .attr("x", 220)
        .attr("y", 25)
        .text("The tournament expanded from 13 teams to 32 teams.");

}


function scene3() {

    d3.select("#message")
        .text("Scene 3: Click a country to see when it won.");

    let wins = {};

    data.forEach(function(d) {

        if (wins[d.Winner] == null) {
            wins[d.Winner] = 1;
        }
        else {
            wins[d.Winner]++;
        }

    });

    let chart = [];

    for (let country in wins) {

        chart.push({
            country: country,
            wins: wins[country]
        });

    }

    chart.sort(function(a, b) {

        return b.wins - a.wins;

    });

    let x = d3.scaleLinear()
        .domain([0, 5])
        .range([150, 800]);

    let y = d3.scaleBand()
        .domain(chart.map(function(d) {
            return d.country;
        }))
        .range([50, 500])
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(150,0)")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", "translate(0,500)")
        .call(d3.axisBottom(x));

    svg.selectAll("rect")
        .data(chart)
        .enter()
        .append("rect")
        .attr("x", 150)
        .attr("y", function(d) {
            return y(d.country);
        })
        .attr("width", function(d) {
            return x(d.wins) - 150;
        })
        .attr("height", y.bandwidth())
        .attr("fill", "steelblue")
        .on("click", function(event, d) {

            selectedCountry = d.country;

            drawScene();

        });

    svg.selectAll(".label")
        .data(chart)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return x(d.wins) + 5;
        })
        .attr("y", function(d) {
            return y(d.country) + y.bandwidth() / 2 + 5;
        })
        .text(function(d) {
            return d.wins;
        });

    svg.append("text")
        .attr("x", 240)
        .attr("y", 25)
        .text("Click a bar to see the years that country won.");

    if (selectedCountry != "") {

        let years = [];

        data.forEach(function(d) {

            if (d.Winner == selectedCountry) {
                years.push(d.Year);
            }

        });

        svg.append("text")
            .attr("x", 150)
            .attr("y", 560)
            .text(selectedCountry + " won in: " + years.join(", "));

    }

}