// Stable elements
const bodyContainer = document.querySelector("body.container.center");

const quoteListUl = document.querySelector("ul#quote-list");

const quoteForm = document.querySelector("form#new-quote-form");

const sortCheckbox = document.querySelector("#sort-checkbox");

// Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page.
quoteForm.addEventListener("submit", submitNewQuoteAndAddToDOM);

// Checking the checkbox will sort the quote cards
sortCheckbox.addEventListener("change", sortQuoteCards);

function getQuotes() {
// Populate page with quotes with a GET request to http://localhost:3000/quotes?_embed=likes. The query string in this URL tells json-server to include the likes for a quote in the JSON of the response.
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quoteObjectArray => {
      quoteObjectArray.forEach(quoteObject => gentlyPlaceQuoteOnDOM(quoteObject));
    });
}

function gentlyPlaceQuoteOnDOM(quoteObject) {
  // Take a quote object, create required elements, and then place on the DOM

  // Extract values of out quoteObject
  const author = quoteObject.author;
  const id = quoteObject.id;
  const likes = quoteObject.likes; // an array of all the quote's like objects
  const quote = quoteObject.quote;

  const quoteLi = document.createElement("li");
  quoteLi.className = "quote-card";

  const blockquoteEl = document.createElement("blockquote");
  blockquoteEl.className = "blockquote";

  quoteLi.append(blockquoteEl);

  const quotePara = document.createElement("p");
  quotePara.className = "mb-0";
  quotePara.innerText = quote;

  const quoteFooter = document.createElement("footer");
  quoteFooter.className = "blockquote-footer";
  quoteFooter.innerText = author;

  const lineBreak = document.createElement("br");

  const likeBtn = document.createElement("button");
  likeBtn.className = "btn-success";
  const numLikesSpan = document.createElement("span");

  (likes === undefined) ? (numLikesSpan.innerText = "0") : (numLikesSpan.innerText = likes.length)

  likeBtn.innerText = "Likes: ";
  likeBtn.append(numLikesSpan);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-danger";
  deleteBtn.innerText = "Delete";

  const editBtn = document.createElement("button");
  editBtn.className = "btn-warning";
  editBtn.innerText = "Edit";

  blockquoteEl.append(quotePara, quoteFooter, lineBreak, likeBtn, deleteBtn, editBtn);

  quoteListUl.append(quoteLi);

  // Clicking the delete button should delete the respective quote from the API and remove it from the page without having to refresh.
  deleteBtn.addEventListener("click", (evt) => {
    fetch("http://localhost:3000/quotes/" + id, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(deletedQuoteObject => {
        quoteLi.remove();
      });
  })

  // Clicking the like button will create a like for this particular quote in the API and update the number of likes displayed on the page without having to refresh.
  likeBtn.addEventListener("click", (evt) => {

    // createdAt key to track when the like was created. Use UNIX time (the number of seconds since January 1, 1970). 
    const now = new Date();  
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);

    // The .getTime() call retrieves the milliseconds since epoch in UTC. Convert them to seconds by dividing by 1000. This may create a decimal and you have to ensure an integer value by rounding to the next whole number. 

    const newLikeObject = {
      "quoteId": id,
      "createdAt": secondsSinceEpoch
    }

    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(newLikeObject)
    }).then(response => response.json())
      .then(newLikeObject => {
        numLikesSpan.innerText = parseInt(numLikesSpan.innerText) + 1;
      });
  })
  
  // Clicking the edit button will trigger a form to be added to the quoteLi, which is prepopulated with the quote object info (quote, author)
  editBtn.addEventListener("click", (evt) => {
    editQuote(evt,quoteObject);
  })
}

function editQuote(evt, quoteObject) {
  const editQuoteLi = evt.target.parentElement.parentElement;
  const editForm = document.createElement("form");
  editForm.innerHTML = 
  `
    <form id="editForm">
      <label for="quoteEditInput">Quote:</label><br>

      <textarea id="quoteEditInput" name="quoteEditInput">${editQuoteLi.querySelector(".mb-0").innerText}</textarea><br>

      <label for="authorEditInput">Author:</label><br>
      
      <input type="text" id="authorEditInput" name="authorEditInput" value="${editQuoteLi.querySelector(".blockquote-footer").innerText}"><br><br>

      <input type="submit" value="Submit">
    </form> 
  `
  
  editQuoteLi.append(editForm);

  // On submit, make a patch request for the particular quote, and update the DOM
  editForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    // Grab the form and the user's inputs
    const quoteEditInput = document.querySelector("#quoteEditInput").value;
    const authorEditInput = document.querySelector("#authorEditInput").value;

    const editedQuoteObject = {
      "quote": quoteEditInput,
      "author": authorEditInput
    }

    fetch('http://localhost:3000/quotes/' + quoteObject.id, {
      method: 'PATCH',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(editedQuoteObject)
    }).then(response => response.json())
      .then(editedQuoteObject => {
    
        editQuoteLi.querySelector(".mb-0").innerText = quoteEditInput;
        editQuoteLi.querySelector(".blockquote-footer").innerText = authorEditInput;
      });
      editForm.remove()
  })
   
  
}

function submitNewQuoteAndAddToDOM(evt) {
  evt.preventDefault();
  const quoteForm = evt.target;
  const quoteInput = quoteForm.quote.value;
  const authorInput = quoteForm.author.value;
  
  const newQuoteObject = {
    author: authorInput,
    quote: quoteInput
  };

  // Add new quote object to database and attach it to DOM
  postQuote(newQuoteObject); 
  quoteForm.reset();
}

function postQuote(newQuoteObject) {
  // Post new quote object to database, and attach to DOM
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(newQuoteObject)
  }).then(response => response.json())
    .then(newQuoteObject => {
      gentlyPlaceQuoteOnDOM(newQuoteObject);
    });
}

function sortQuoteCards(evt) {
  // When sortCheckbox is unchecked the list of quotes will appear sorted by the ID. When sortCheckbox is checked, it will display the quotes by author's name, alphabetically.
  if (sortCheckbox.checked) {
    
    let allQuoteCardLisNodeList = document.querySelectorAll(".quote-card");

    let sortedQuoteCardLisArr = sortByAuthor(allQuoteCardLisNodeList); // Will return an array with all quote card Li's sorted by author

    // Clear the quoteListUl
    quoteListUl.innerHTML = '';

    // Loop through each of the quoteCardLi in sortedQuoteCardLisArr and append to quoteListUl
    sortedQuoteCardLisArr.forEach(quoteCardLi => quoteListUl.append(quoteCardLi))
  } else {
    quoteListUl.innerHTML = '';
    getQuotes();
  }
}

function sortByAuthor(allQuoteCardLisNodeList) {
  // return an array with all quote card Li's sorted by author
  return Array.from(allQuoteCardLisNodeList).sort(function(currentQuoteCardLi, nextQuoteCardLi){
    if(authorOfQuoteCardLi(currentQuoteCardLi).toLowerCase() < authorOfQuoteCardLi(nextQuoteCardLi).toLowerCase()) { return -1; }
    if(authorOfQuoteCardLi(currentQuoteCardLi).toLowerCase() > authorOfQuoteCardLi(nextQuoteCardLi).toLowerCase()) { return 1; }
    return 0;
  })
}

function authorOfQuoteCardLi(quoteCardLi) {
  // Returns the string name of the author of the quote card
  return quoteCardLi.querySelector(".blockquote-footer").innerText;
}

getQuotes();