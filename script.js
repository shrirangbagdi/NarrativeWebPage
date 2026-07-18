let scene = 1;
let selectedCountry = "";
const svg = d3.select("svg");

let data;

d3.csv("world_cup.csv").then(function(csv) {

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

