// NEXT REVISION: UPDATE WITH BANK.JS AND WORK.JS (and LAPTOP.JS, but less urgent) FOR READABILITY
// AND TO HIDE VARIABLES HANDLING PAY TO MAKE THEM INACCESSIBLE OUTSIDE USE OF FUNCTIONS

const LAPTOP_API_URL = "https://hickory-quilled-actress.glitch.me/computers";   // json data URL
const BASE_URL = "https://hickory-quilled-actress.glitch.me/";                  // base url. for adding image path
const salary = 100; // how much to pay each time

let currentPay = 0; // your current pay status. FOR REVISION: Move this to work.app and make it local/hidden
let bankBalance = 0;    // current bank balance. FOR REVISION: Move this to bank.app and make it local/hidden
let outstandingLoan = 0; // REVISION: Move to bank.app
let hasLoan = false; // REVISION: Move to bank.app
// in this version, this is easily manipulated, so make them inacessible except through use of functions

let currentLaptopPrice = '';    // globally accesible variables (default value: empty) for handling chosen laptop out of scope of functs
let currentLaptopTitle = '';    // globally accesible variables (default value: empty) for handling chosen laptop out of scope of functs
let laptopList = [];    // empty array, for populating with json array consisting of objects

// ELEMENTS
// BANK ELEMENTS. FOR REVISION: MOVE TO BANK.APP
const getLoanButtonElement = document.getElementById("btn-get-loan");   // These are fairly evident
const bankBalanceElement = document.getElementById("bank-balance");     // thanks to Warrens conventions lecture ;)
const outstandingLoanElement = document.getElementById("outstanding-loan");

// WORK ELEMENTS. FOR REVISION: MOVE TO WORK.APP
const bankButtonElement = document.getElementById("btn-bank");
const workButtonElement = document.getElementById("btn-work");
const repayLoanButtonElement = document.getElementById('btn-repay-loan');
const payElement = document.getElementById("pay");

// laptop elements - 
const laptopListElement = document.getElementById("komputer-selector");
const laptopDescriptionElement = document.getElementById("komputer-description");

// DisplayElements - extention of laptop elements
const displayKomputerDisplayBox = document.getElementById("komputerdisplaybox")
const displayKomputerElement = document.getElementById("komputer-description");
const komputerPriceElement = document.getElementById("komputer-price");
const komputerPurchaseElement = document.getElementById("btn-komputer-purchase");
const laptopImageElement = document.getElementById("komputer-image");
const laptopSpecsElement = document.getElementById("komputer-specs");

// EVENT HANDLERS
laptopListElement.addEventListener('change',handleLaptopChoice); // Listens for changes = picking new laptop from menu
getLoanButtonElement.addEventListener('click',getLoanPrompt);   // Prompts for loan

workButtonElement.addEventListener('click',addPay);             // Work button, results in pay
repayLoanButtonElement.addEventListener('click',payBackAllCurrentPay);  // NOTE: REVISE THIS
bankButtonElement.addEventListener('click', movePayToBankBalance);  // Moves all pay to bank balance.

komputerPurchaseElement.addEventListener('click',purchaseKomputer); // (tries to) purchase Komputer

// functions

function purchaseKomputer() // checks if you have enough in bankBalance to buy current chosen laptop
{
    if (bankBalance >= currentLaptopPrice) // if you have at least the amount you need:
    { 
        bankBalance-=currentLaptopPrice;    // deducts the cost of laptop from your bank balance
        updateBankBalance(0);
        alert(`You're now the proud owner of a ${currentLaptopTitle}!`); // tells you you've bought it
        
        // NOTE: This should be made into a function this was an actual shop,
        // or, REVISION: add this laptop to a "ownedLaptops"-array
    } else { // else tells you you can't afford it based on your bank balance ...
        let sorryMessage = "I'm sorry, but you can't afford this item with your current bank balance.";
        if ((bankBalance + currentPay) >= currentLaptopPrice) {
            sorryMessage += "... However, it seems you have enough funds if you transfer from your work account!"
        }   // adds optional message if your current pay, though not yet transfered to bank, gives you enough $
        alert(sorryMessage); // displays full message

    }
}

function updateRepayLoanButtonVisibility(isVisible) {
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
        let maxLoan = (bankBalance * 2); // maximum loan amount = twice your current bank balance
       // NEXT REVISION: update with switch-statement instead of several if-sentences.
        if (askedLoan <= 0 ){ // break if requested amount is zero or less.
            alert("Requested loan has to be larger than 0.");
            return;
        }
        if (isNaN(askedLoan)) { // if anything else than a number is added
            alert("Please enter a valid number.");
            return;
        } 
        if (askedLoan > maxLoan) {
            alert(`You can apply for a maximum loan of twice your balance of ${bankBalance}, which in your case would be ${maxLoan}`);
    
        }
        else
       { 
         hasLoan = true;
         outstandingLoan = askedLoan;
            updateBankBalance(outstandingLoan);

        }
    } else {
        alert("You have to pay outstanding loan before asking for new one!");
    }
}

function updateBankBalance(amount) {    // updates bankBankbalance with an amount (can be + or -)
    bankBalance += amount;  // increase bankBalance by Amount
    bankBalanceElement.innerText = `Balance: ${bankBalance}` // update display of balance
    if (outstandingLoan>0) { // if you have a loan (greater than and not including 0) ....
        outstandingLoanElement.style.display='block'; // turn this block visible if there's a loan
        outstandingLoanElement.innerHTML = `Outstanding Loan: <span id="redword">${outstandingLoan}</span>` 
        // update with text. span element gives #redword tag, which is defined in style.css as .. being red
    } else {
        outstandingLoanElement.style.display='none'; // turn of display of "outstanding loan" text if there is none
    }
}

function movePayToBankBalance() // moves (adds) current pay to bank balance, reseting pay amount in work
{ 
    updateBankBalance(currentPay);  // uppdates bankBalance variable with + currentPay
   currentPay=0;                    // resets currentPay
   updatePayElement();              // displays changes on webpage
    updateRepayLoanButtonVisibility(false); // turns off "repay button" element as you're now empty
    
}

function payBackAllCurrentPay() {   
    if (!hasLoan) { // checks if you have loan, if not: tells you so, returns
        alert("You have no outstanding loan!");
        return;
        } else
        {
    repayLoan(currentPay);  // pays all your pay balance into remaining bankloan - REST INTO BANK BALANCE
    }
} 
function repayLoan(amount) {    // Repay Loan, by amount
    if (outstandingLoan>amount) { // if you're paying back less than total outstanding
        outstandingLoan-=amount; // deduct amount from outstanding
       currentPay = 0; // NOTE: This possibly needs to go
    } else if (outstandingLoan == amount) { // if you have the exact amount
        outstandingLoan = 0;                  // deletes outstanding loan
        currentPay = 0;                    // deducts from pay
        hasLoan = false;                     // deletes loan by negating bool hasLoan
    } else if (outstandingLoan < amount)    
    {                                       // IF YOU PAY MORE THAN YOU OWE:
        const surplusAfterPayingLoan = (amount - outstandingLoan); // calculate difference
        bankBalance += surplusAfterPayingLoan;  // add suprplus to bankBalance. NOTE: MAKE FUNCTION
        outstandingLoan = 0;                    // wipes out loan;
        hasLoan = false;                        // .. and boolean that shows if there's a loan
        currentPay = 0;                        // wipes out pay, as it's now gone to the bank, buddy

                                                // NOTE: REVISION SHOULD USE FUNCTION FOR RESETING CURRENT PAY
                                                // ADDPAY(-AMOUNT) DOESN'T WORK AS IT DEDUCTS ADDITIONAL 10% TO BNK
    }
    updatePayElement();   // update webpage with new currentpay amount
    updateBankBalance(0); // changes amount by zero but also calls function that displays new bank balance
}

function moveAmountToBankLoan(amount) { // deduct an amount from outstanding loan
    outstandingLoan -= amount;      
    if (outstandingLoan<=0) {           // if outstanding loan is paid down
                            hasLoan = false;   // set boolean "hasLoan" to false
                                        // NOTE: update in function that if it gets below zero,
                                        // surplus should be added to bank account.
                                        // this wont happen in this model, but it's a good functionality to have
                            }
    updateBankBalance(0);   // changes amount by zero in bank balance, but this function also calls display update
}
function updatePayElement() {   // makes sure your current pay balance shows
    payElement.innerText = `Pay: ${currentPay}`;    
}
function addPay() {
    if (!hasLoan) {         // if you don't have a loan
    currentPay+=salary;     // ..then your pay balance is increased by max salary
        } else
        {                 
            console.log("moving to bank loan");
                              // if you have a loan: 10% goes to the bank, while you get 90% to yourself
                            // this can (vouluntarily) be paid out to the bank
            moveAmountToBankLoan(salary * 0.10); // 10% to the bank
            currentPay+=(salary * 0.90); // 90% to pay
        }
    updatePayElement();             // updates element that shows pay
    updateRepayLoanButtonVisibility(true); // turn visibility of button on, as there's now payment here
}

function updateDisplayVisibility(isVisible) // updates Laptop Display-window by using a bool value, true = display, false = don't
{
    if(isVisible) { 
        displayKomputerDisplayBox.style.display='flex'; // if true, display the element, which in this case is a flexbox
    }
        else
    {
        displayKomputerDisplayBox.style.display='none'; // if false, turn it off
    }
}


function populateList() // fills out dropdownmenu
{                                                           
    laptopListElement.innerHTML="";     // empties list
    for (const laptop of laptopList)    // iterate through every laptop
    {
        laptopListElement.innerHTML+=`<option>${laptop.title}</option>`;
        // add new element in dropdownlist, using the html <option>-tag, including only laptops title
        // NB! as other elements are missing, this title description is used to index full list later
    }
}

function handleLaptopChoice(event) // function reacts to laptop being chosen from dropdown menu
{   
    const newLaptop = laptopList.find((item) => item.title == event.target.value); 
    // finds (first) match of title in chosen laptop and list, in order to extract other data from event data
    // assigns to newLaptop

   const newSpecs = newLaptop.specs; // specs data, to populate display

   currentLaptopPrice = newLaptop.price;    // assigned to global variable for handing outside this scope
   currentLaptopTitle = newLaptop.title;    // --""--
   
   const newSpecsJoined = newLaptop.specs.join("<br>"); // adds html line break between sentences, for readability
     
    laptopSpecsElement.innerHTML=`${newSpecsJoined}`;   // updates display with list of specs, now seperated w/ linebreak
    
    laptopDescriptionElement.innerHTML=`<h4>${currentLaptopTitle}</h4><p>${newLaptop.description}</p>`;
    // updates description with laptops title (h4 heading) and description (paragraph element)

    const fullLaptopImgUrl = BASE_URL+newLaptop.image;  // generates a full URL using base url + image path
         laptopImageElement.innerHTML=`<img src ="${fullLaptopImgUrl}" alt = "Image of ${currentLaptopTitle}" width = "200"></img>`;
         // updates with image data from api, and adds alt text for accessibility and/or if image link is broken/empty
  
        komputerPriceElement.innerHTML = `<h4>Price: ${currentLaptopPrice}</h4>`;   // shows price in h4 heading
        
        
    updateDisplayVisibility(true);                      // displays the laptop display and purchase button
}

function fetchLaptopAPIURL () {                         // fetches jsondata from provided url into laptoplist
    fetch(LAPTOP_API_URL)                               // tries to fetch data from provided URL
        .then(response => response.json())              // if able to fetch, return json data
        .then(json => { laptopList = json;              // then fill empty array laptopList with this json data
                        populateList();})               // run function that populates list (using laptopList)
        .catch(error => {console.log(error.message)});  // alternatively, logs error message to console
}

// Actions

fetchLaptopAPIURL();                                    // gets laptop URL and populates list
updateRepayLoanButtonVisibility(false);                 // turns "Repay Loan" button off by default
updateDisplayVisibility(false);                         // turns display of laptop off by default

