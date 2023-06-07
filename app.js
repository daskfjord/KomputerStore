const LAPTOP_API_URL = "https://hickory-quilled-actress.glitch.me/computers";
const BASE_URL = "https://hickory-quilled-actress.glitch.me/";
let currentPay = 0; // move this to hidden

// Elements
// laptop elements
const laptopListElement = document.getElementById("komputer-selector");
const laptopDescriptionElement = document.getElementById("komputer-description");
const laptopSpecsElement = document.getElementById("komputer-specs");
const laptopImageElement = document.getElementById("komputer-image");
// Bank elements
const getLoanButtonElement = document.getElementById("btn-get-loan");

// Work Elements
const bankButtonElement = document.getElementById("btn-bank");
const workButtonElement = document.getElementById("btn-work");
const repayLoanButtonElement = document.getElementById('btn-repay-loan');
const payElement = document.getElementById("pay");
// NOTE! Should be one more button: pay back loan
// DisplayElements
const displayKomputerDisplayBox = document.getElementById("komputerdisplaybox")
const displayKomputerElement = document.getElementById("komputer-description");
const komputerPriceElement = document.getElementById("komputer-price");

let laptopList = [];
// 

// event handlers
laptopListElement.addEventListener('change',handleLaptopChoice);
getLoanButtonElement.addEventListener('click',getLoanPrompt);

workButtonElement.addEventListener('click',addPay);
// functions

function updateButtonVisibility(isVisible) {
        if(isVisible) {
        repayLoanButtonElement.style.display='block';
    }
        else
    {
        repayLoanButtonElement.style.display='none';
    }

}

function getLoanPrompt() {
    const askedLoan = prompt("How much would you like to loan?");
    // return this
}

function addPay() {
    currentPay+=100;
    payElement.innerText = `Pay: ${currentPay}`;
    updateButtonVisibility(true);
}

function updateDisplayVisibility(isVisible) {
    if(isVisible) {
        displayKomputerDisplayBox.style.display='flex';
    }
        else
    {
        displayKomputerDisplayBox.style.display='none';
    }
}


function populateList() {
    laptopListElement.innerHTML="";
    for (const laptop of laptopList) {
        laptopListElement.innerHTML+=`<option>${laptop.title}</option>`;
    }
}

function handleLaptopChoice(event) {
  console.log(event.target.value);
   const newLaptop = laptopList.find((item) => item.title == event.target.value);
 
   const newSpecs = newLaptop.specs;
   //console.log(newSpecs);
   const newSpecsJoined = newLaptop.specs.join("<br>");
   //console.log(newSpecsJoined);
  
    laptopSpecsElement.innerHTML=`${newSpecsJoined}`;
    laptopDescriptionElement.innerHTML=`<h4>${newLaptop.title}</h4><p>${newLaptop.description}</p>`;

    const fullLaptopImgUrl = BASE_URL+newLaptop.image;
         laptopImageElement.innerHTML=`<img src ="${fullLaptopImgUrl}" alt = "Image of ${newLaptop.title}" width = "200"></img>`;
  
    updateDisplayVisibility(true);
}

function fetchLaptopAPIURL () {
    fetch(LAPTOP_API_URL)
        .then(response => response.json())
        .then(json => { laptopList = json;
                        populateList();})
        .catch(error => {console.log(error.message)});
}

// actions

fetchLaptopAPIURL();
updateButtonVisibility(false);
updateDisplayVisibility(false);

