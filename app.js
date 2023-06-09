const LAPTOP_API_URL = "https://hickory-quilled-actress.glitch.me/computers";
const BASE_URL = "https://hickory-quilled-actress.glitch.me/";
const salary = 100; // how much to pay each time

let currentPay = 0; // move this to hidden
let bankBalance = 0;
let outstandingLoan = 0;
let hasLoan = false;
let currentLaptopPrice = '';
let currentLaptopTitle = '';


// Elements
// laptop elements
const laptopListElement = document.getElementById("komputer-selector");
const laptopDescriptionElement = document.getElementById("komputer-description");
const laptopSpecsElement = document.getElementById("komputer-specs");
const laptopImageElement = document.getElementById("komputer-image");
// Bank elements
const getLoanButtonElement = document.getElementById("btn-get-loan");
const bankBalanceElement = document.getElementById("bank-balance");
const outstandingLoanElement = document.getElementById("outstanding-loan");

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
const komputerPurchaseElement = document.getElementById("komputer-purchase-btn");

let laptopList = [];
// 

// event handlers
laptopListElement.addEventListener('change',handleLaptopChoice);
getLoanButtonElement.addEventListener('click',getLoanPrompt);

workButtonElement.addEventListener('click',addPay);
repayLoanButtonElement.addEventListener('click',payBackAllCurrentPay);
bankButtonElement.addEventListener('click', movePayToBankBalance);

komputerPurchaseElement.addEventListener('click',purchaseKomputer);

// functions

function purchaseKomputer() {
    console.log("running purchaseKomputer function");
    if ((bankBalance+currentPay) >= currentLaptopPrice) {
        alert("You're now the proud owner of a " + currentLaptopTitle + "!");
        // make this a function
    } else {
        alert("I'm sorry, but you can't afford this item");
    }
}

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
  
    if (!hasLoan) {
        let askedLoan = parseInt(prompt("How much would you like to loan?"));
        let maxLoan = (currentPay * 2);
        
        // add: if asked for 0, or if you type in a string: break
        if (askedLoan == 0 ){
            alert("Requested loan has to be larger than 0 to make any god damned sense.");
            return;
        }
        if (isNaN(askedLoan)) {
            alert("Please enter a valid number.");
            return;
        } 
        if (askedLoan > maxLoan) {
            alert("You can apply for a maximum loan of twice your balance of " + currentPay +", which in your case would be " + maxLoan + "!");
           
        }
        else
       { 
         hasLoan = true;
         outstandingLoan = askedLoan;
            console.log("outstandingLoan:",outstandingLoan);
            updateBankBalance(outstandingLoan);

        }
    } else {
        alert("You have to pay out outstanding loan before asking for new one!");
    }
}

function updateBankBalance(amount) {
    bankBalance += amount;
    bankBalanceElement.innerText = `Balance: ${bankBalance}`
    outstandingLoanElement.innerText = `Outstanding Loan: ${outstandingLoan}`
    console.log(bankBalance);
}

function movePayToBankBalance() {
    console.log("Moving pay to bank balance");
    updateBankBalance(currentPay);
   currentPay=0;
   updatePayElement();
    
    
}
function payBackAllCurrentPay() {
    if (!hasLoan) {
        alert("You have no outstanding loan!");
        return;
        } else
        {
    payBackLoan(currentPay);
    }
}
function payBackLoan(amount) {
    console.log("Paying back loan..." + amount);
    if (outstandingLoan>amount) {
        outstandingLoan-=amount;
        updateBankBalance(-amount); // NOTE: This possibly needs to go
    } else if (outstandingLoan == amount) {
        outstandingLoan=0; // note
        updateBankBalance(-amount);
        hasLoan= false;
    } else if (outstandingLoan < amount) 
    {
        // ONLY PAY PART

    }
    


}

function updatePayElement() {
    payElement.innerText = `Pay: ${currentPay}`;
}
function addPay() {
    if (!hasLoan) {
    currentPay+=salary;
        } else
        {
            payBackLoan(salary * 0.10); // 10% to the bank
            currentPay+=(salary * 0.90); // 90% to pay
        }
   updatePayElement();
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
   currentLaptopPrice = newLaptop.price;
   currentLaptopTitle = newLaptop.title;
   //console.log(newSpecs);
   const newSpecsJoined = newLaptop.specs.join("<br>");
   //console.log(newSpecsJoined);
  
    laptopSpecsElement.innerHTML=`${newSpecsJoined}`;
    laptopDescriptionElement.innerHTML=`<h4>${currentLaptopTitle}</h4><p>${newLaptop.description}</p>`;

    const fullLaptopImgUrl = BASE_URL+newLaptop.image;
         laptopImageElement.innerHTML=`<img src ="${fullLaptopImgUrl}" alt = "Image of ${currentLaptopTitle}" width = "200"></img>`;
  
        komputerPriceElement.innerHTML = `<h4>Price: ${currentLaptopPrice}</h4>`;
        
        
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

