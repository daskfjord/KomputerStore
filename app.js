// FUTURE REVISIONS: 
// -- UPDATE WITH BANK.JS AND WORK.JS (and LAPTOP.JS, but less urgent) FOR READABILITY + untouchable variables
// -- make sure to add functions for handling pay and bank balance, not locally changing variables
// -- remove default choice in laptoplist OR make sure it displays in laptopdisplay as default pick
// -- STYLE: Format "Balance", "Outstanding loan" and "Pay" so labels gets pulled left, values pulled right.
// -- STYLE: OPTIONAL: Give boxes static pixel height to avoid them expanding when new buttons are made visible

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

function updateRepayLoanButtonVisibility(isVisible) { // toggles Repay Loan button on / off using bool
        if(isVisible) {
        repayLoanButtonElement.style.display='block'; // if visible, make this a block element
    }
        else
    {
        repayLoanButtonElement.style.display='none'; // if not, turn off display
    }

}

function getLoanPrompt() {
  
    if (!hasLoan) // If you DON'T have a loan, run all this code
    { 
        let askedLoan = parseInt(prompt("How much would you like to loan?")); //parseInt forces returned number to be integer
        let maxLoan = (bankBalance * 2); // maximum loan amount = twice your current bank balance
       // NEXT REVISION: update with switch-statement instead of several if-sentences.
        if (askedLoan <= 0 ){ // break if requested amount is zero or less.
            alert("Requested loan has to be larger than 0.");
            return; // return from function
        }
        if (isNaN(askedLoan)) { // if anything else than a number is added, such as text
            alert("Please enter a valid number.");
            return;
        } 
        if (askedLoan > maxLoan) { // if you ask for a loan larger than maximum loan of 2* bank balance
            alert(`You can apply for a maximum loan of twice your balance of ${bankBalance}, which in your case would be ${maxLoan}`);
            // gives you your balance and max possible loan for the mathematically impaired
        }
        else    // if loan you ask for is within range:
       { 
         hasLoan = true;    // bool that flags as true as you now have an active loan
         outstandingLoan = askedLoan;   // you get the loan you asked for
            updateBankBalance(outstandingLoan); // adds loan to your bank account

        }
    } else { // I've used way too many if/else-statements here, and could do with a switch.
             // however: This "else" is triggered if you DO have a loan (= if not !hasLoan, double neg parameter)
        alert("You have to pay outstanding loan before asking for new one!");
    }
}

function updateBankBalance(amount) {    // updates bankBankbalance with an amount (can be + or -)
    bankBalance += amount;  // increase bankBalance by Amount
    const formattedBankBalance = formatCurrency(bankBalance); // adds prefix KR, drops decimals
    bankBalanceElement.innerText = `Balance: ${formattedBankBalance}` // update display of balance
    if (outstandingLoan>0) { // if you have a loan (greater than and not including 0) ....
        const formattedOutstandingLoan = formatCurrency(outstandingLoan); // converts to no decimals + NOK
        outstandingLoanElement.style.display='block'; // turn this block visible if there's a loan
        outstandingLoanElement.innerHTML = `Outstanding Loan: <span id="redword">${formattedOutstandingLoan}</span>` 
        // update with text. span element gives #redword tag, which is defined in style.css as .. being red
    } else {
        outstandingLoanElement.style.display='none'; // turn of display of "outstanding loan" text if there is none
    }
}

function movePayToBankBalance() // moves (adds) current pay to bank balance, reseting pay amount in work
{ 
    if(currentPay>0) { // makes sure you have something to transfer before triggering below code
    updateBankBalance(currentPay);  // uppdates bankBalance variable with + currentPay
   currentPay=0;                    // resets currentPay
   updatePayElement();              // displays changes on webpage
    updateRepayLoanButtonVisibility(false); // turns off "repay button" element as you're now empty
} else {
    alert("No money to transfer! Get to work!");
}
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
    const currentPayFormatted = formatCurrency(currentPay);
    payElement.innerText = `Pay: ${currentPayFormatted}`;    
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

function formatCurrency(number) {   // formats currency
    const formatter = new Intl.NumberFormat('nb-NO', {  // full disclosure, this is more or less copypasted from the web
        style: 'currency',                              // which feels dirty, but come on. To show I get it:
        currency: 'NOK',                                // Intl.NumberFormat is a constructor
        maximumFractionDigits: 0,                       // and this is the only thing I changed in the code, dropping digits
    });
    return formatter.format(number);                    // returns the new formated number without Decimals, but with prefix KR
}

/* I have consequently used traditional declaration of functions here, as I currently find them more
readable at a glance. And when I first started, I kind of wanted to keep the code consistent.
However, to show that I get how they work and to impress the teacher, this is how I would write it:
const formatCurrency = (number) => {
    [...rest of code, which is similar]
    what this does (holy smoke, I can't believe I'm writing this, but here we go):
    formatCurrency returns a const, it takes a parameter ("number"). Yep that's it.
} */

function populateList() // fills out dropdownmenu
{                       
                              
   // laptopListElement.innerHTML="";     // empties list
   laptopListElement.innerHTML = `<option disabled selected>Select a laptop</option>`; 
   // Makes disabled option default, instead of simply emptying list
   
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
        const formattedCurrentLaptopPrice = formatCurrency(currentLaptopPrice); // formats number with KR, no decimals
        komputerPriceElement.innerHTML = `<h4>Price: ${formattedCurrentLaptopPrice}</h4>`;   // shows price in h4 heading
        
        
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

