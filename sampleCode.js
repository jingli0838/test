// import config.js 

import { config } from './config.js';

const baseUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"

const myApiKey = config.NASA_API_KEY;

const dateNode = document.getElementById("earthDate");

const containerNode = document.getElementById("marsPhotosContainer");


async function fetchPhotos(date){
    const url =`${baseUrl}?earth_date=${date}&api_key=${myApiKey}`;

    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }
        // if response is good, use the JSON method to parse the response body
        const marsPhotosData = await response.json();
        console.log(marsPhotosData);
        
        // select the first 3 photos to make destructuring
        
        const photos = marsPhotosData.photos.slice(0,3).map((photo) => {
            const {camera:{full_name},
            sol, img_src} = photo;
            return {full_name, sol, img_src};
        });
        return photos;  
    } catch(error){
        // handle the error
        console.error(`Failed to fetch: ${error.message}`);
        const consoleErrorNode = document.createElement('p');
        consoleErrorNode.classList.add('console_error');

        consoleErrorNode.textContent = 'Oops, failed to fetch data';
        containerNode.appendChild(consoleErrorNode);
    }
}
      
   
//Display Photos on Initial Significant Date 
async function loadInitialPhotos(){
    // Clear the container once before loading
    containerNode.innerHTML = "";
    // set a designed date
    const initialDate =  "2018-06-19"; 
    dateNode.value = initialDate;
    const headDescription = `Discovery Organic Molecules on Mars (${initialDate})`;
    //fetch the data
    const photos = await fetchPhotos(initialDate);
    // display the photos 
    displayPhotos(photos,headDescription);
}
// call  the loadInitialPhotos function
window.onload = function() {
    loadInitialPhotos();
};



const buttonNode = document.getElementById("loadButton");

buttonNode.addEventListener("click",function(){
    // clear the container
    containerNode.innerHTML = "";

    const selectedDate = dateNode.value;
    // check the selecteddate is valid or not
    if(new Date(selectedDate) > new Date()){
        const dateErrorNode = document.createElement('p');
        dateErrorNode.classList.add('date-error');
        dateErrorNode.textContent = "selected date cannot be larger than today.";
        containerNode.appendChild(dateErrorNode);
        return;  
    }
    const headDescription = `Mars Rover Photos on ${selectedDate}`;
     //fetch the data
    fetchPhotos(selectedDate).then((photos) => {
         // check the array is empty or not
        if(photos.length === 0){
            // add the error message to notice users
            const noPhotoMessageNode = document.createElement('p');
            noPhotoMessageNode.classList.add('no_photo_message');
            noPhotoMessageNode.textContent = `No photos available for ${selectedDate}`;  
            containerNode.appendChild(noPhotoMessageNode);
            return;
        } 
        // display the photos 
        displayPhotos(photos,headDescription);
    });  
})


// Function to display photos
function displayPhotos(photos,description){
    // add a description of the photos
    const headDescriptionNode = document.createElement('h2');
    headDescriptionNode.textContent = description;
    containerNode.append(headDescriptionNode); 
    //display the photos selected and the description 
    photos.forEach(photo => { 
            const figureNode = document.createElement('figure');
            const imgNode = document.createElement('img');
            const text = `Taken by ${photo.full_name} on sol ${photo.sol}`;
            imgNode.setAttribute('src', photo.img_src);
            imgNode.setAttribute('alt',text);
            //append img to the container
            figureNode.appendChild(imgNode);
            
            const figcaptionNode = document.createElement('figcaption');
            // add the information of the camera
            figcaptionNode.textContent = text;
            figureNode.appendChild(figcaptionNode);
            containerNode.appendChild(figureNode);
        }     
    )
}
