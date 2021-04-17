var xmlhttp = new XMLHttpRequest;
var xmlhttp2 = new XMLHttpRequest;
//const uri = 'file:///C:/Users/Sage/Web-Sites/Crafts%20Are%20Us/Products.json' ;
const apikey ="api_key=gzlhcOfOw4mAgOzf0bhYd5O5kKsBiCrMav1geuEe";
const uri ="https://api.nasa.gov/planetary/apod?";

const astUri ="https://api.nasa.gov/neo/rest/v1/feed?"

const url = `${uri}${apikey}`

xmlhttp.open('GET', url, true);
xmlhttp.send();

xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        
        var data = JSON.parse(this.responseText);
      //  console.log(data);
    }
}

const url2 = `${astUri}${apikey}`

xmlhttp2.open('GET', url2, true);
xmlhttp2.send();

xmlhttp2.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        
        var astData = JSON.parse(this.responseText);
        //console.log(astData);
    }
}

//Atttributes

const previousAsteroidTemplate = document.querySelector('[data-previous-ast-template]');
const asteroidContainer = document.querySelector('[data-asteroids]');

//Modal Asteroids

const currentName = document.querySelector('[data-modal-name]');
const dateRecorded = document.querySelector('[data-modal-date]');
const currentSize = document.querySelector('[data-modal-size]');
const absMagnitude = document.querySelector('[data-modal-abs-mag]');
const relativeVelocity = document.querySelector('[data-modal-velocity]');
const closeApproachDate = document.querySelector('[data-close-approach-date]');
const missDistance = document.querySelector('[data-miss-distance]')

//Display The Picture Of The Day

function getItems() {
    fetch(url)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

getItems();

function _displayItems(data) {
    const date = document.getElementById('date');
    //tBody.innerHTML = '';
     date.innerHTML = data.date;
    

    const podtitle = document.getElementById('pod-title');
    
     podtitle.innerHTML = data.title;
     const explanation = document.getElementById('explanation');
    
     explanation.innerHTML = data.explanation;

     const imgPOD = document.getElementById('img-pod');
     const vidPOD = document.getElementById('video-pod');

     const staticUrl = data.url.toString();

     vidPOD.src =staticUrl;
    
     imgPOD.src = data.url;

     

     if (data.media_type == 'image') {
         imgPOD.classList.remove('resize');
         vidPOD.classList.add('resize');
     }else{
        imgPOD.classList.add('resize');
        vidPOD.classList.remove('resize');
        vidPOD.load();
     }



    
    

    const button = document.createElement('button');

    

    //todos = data;
}

//Display Asteroid Information
let selectedAstIndex
getAsteroids().then(asteroids => {
     selectedAstIndex = asteroids.length -1;
    // displaySelectedAsteroid(asteroids);
    displayAsteroids(asteroids);
})

function displaySelectedAsteroid(asteroids){
    const selectedAsteroid = asteroids[selectedAstIndex];
    
    //set the modal values of the selected Asteroid

    currentName.innerText= selectedAsteroid.astName;
    dateRecorded.innerText= selectedAsteroid.recDate;
    currentSize.innerText = selectedAsteroid.estDiameter;
    absMagnitude.innerText = selectedAsteroid.absMagnitude;
    relativeVelocity.innerText = selectedAsteroid.relVelocity;
    
    closeApproachDate.innerText = selectedAsteroid.closeApproachDate;
    missDistance.innerText = selectedAsteroid.missDistance;
    
    

}

var chartDataSS = [];
var chartDataSM = [];
function displayAsteroids(asteroids){
   asteroidContainer.innerHTML ="";
      asteroids.forEach((asteroidData,index) => {

        chartDataSS.push({
            x: asteroidData.estDiameter,
            y: asteroidData.relVelocity,
            r: 12
          });

          chartDataSM.push({
            x: asteroidData.estDiameter,
            y: asteroidData.missDistance,
            r: 12
          });
       
        const asteroidCard = previousAsteroidTemplate.content.cloneNode(true);
       asteroidCard.querySelector('[data-asteroid-name]').innerText = asteroidData.astName;
       if (asteroidData.isPotentillyHazard) {
        asteroidCard.querySelector('[data-isHazardous]').innerText = "Yes";
       }else {
        asteroidCard.querySelector('[data-isHazardous]').innerText = "No";
       }

       asteroidCard.querySelector('[data-asteroid-diameter]').innerText = asteroidData.estDiameter;
       
       asteroidCard.querySelector('[data-more-info]').addEventListener('click', ()=>{
        
        selectedAstIndex = index;

        displaySelectedAsteroid(asteroids);
       })

      

       asteroidCard.zIndex =0;
       asteroidContainer.appendChild(asteroidCard);
   });

   

}


function getAsteroids() {
  return  fetch(url2)
        .then(response => response.json())
        .then(data => {
            
          
            let neoArr =[] ;
            neoArr = data.near_earth_objects;
            
            let date = Object.keys(neoArr)[3];
            recDate = Date(date);
            asteroids = neoArr[date];
          return  Object.entries(asteroids).map(([index,astData])=>{
                return{
                    index: index,
                    absMagnitude: astData.absolute_magnitude_h,
                    closeApproachDate: new Date(astData.close_approach_data[0].close_approach_date),
                    missDistance: astData.close_approach_data[0].miss_distance.kilometers,
                    relVelocity: astData.close_approach_data[0].relative_velocity.kilometers_per_hour,
                    estDiameter: astData.estimated_diameter.kilometers.estimated_diameter_max,
                    isPotentillyHazard: astData.is_potentially_hazardous_asteroid,
                    astName : astData.name,
                    recDate
                }
                
            })
        
          
        })
       }


//Set up SS

const dataSS = {
    datasets: [{
      label: 'Size VS Speed',
      data: chartDataSS,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };

  //Config SS
  const configSS = {
    type: 'bubble',
    data: dataSS,
    options: {}
  };

//Render the Size vs Speed ChartData
var SSCHart = new Chart(
    document.getElementById('size-speed'),
    configSS
  );



  //Set up SM

const dataSM = {
    datasets: [{
      label: 'Size VS Miss-Distance',
      data: chartDataSM,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };

  //Config SS
  const configSM = {
    type: 'bubble',
    data: dataSM,
    options: {}
  };
  //Render the size vs miss distance chart
  var SMCHart = new Chart(
    document.getElementById('size-miss-distance'),
    configSM
  );