// Stable elements
const bodyContainer = document.querySelector("body.container.center");

const quoteListUl = document.querySelector("ul#quote-list");

const quoteForm = document.querySelector("form#new-quote-form");

// Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page.
quoteForm.addEventListener("submit", submitNewQuoteAndAddToDOM);


function getQuotes() {
// Populate page with quotes with a GET request to http://localhost:3000/quotes?_embed=likes. The query string in this URL tells json-server to include the likes for a quote in the JSON of the response.
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quoteObjectArray => {
      quoteObjectArray.forEach(quoteObject => gentlyPlaceQuoteOnDOM(quoteObject));
    });
}

function gentlyPlaceQuoteOnDOM(quoteObject) {
  // Take a quote object, create required elements, slap that thing on the DOM

  // Extract values of out quoteObject
  const author = quoteObject.author;
  const id = quoteObject.id;
  const likes = quoteObject.likes; // an array of all the quote's like objects
  const length = quoteObject.length;
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

  blockquoteEl.append(quotePara, quoteFooter, lineBreak, likeBtn, deleteBtn);

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

getQuotes();v
