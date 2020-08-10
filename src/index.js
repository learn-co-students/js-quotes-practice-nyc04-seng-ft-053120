const quoteListUl = document.querySelector("#quote-list");
const quotesForm = document.querySelector("#new-quote-form");

fetch("http://localhost:3000/quotes?_embed=likes")
  .then((resp) => resp.json())
  .then((quotesArray) => {
    quotesArray.forEach((quoteObj) => {
      convertToHtml(quoteObj);
    });
  });

function convertToHtml(quoteObj) {
  const quotesLi = document.createElement("li");
    quotesLi.className = "quote-card";

  const blockQuoteTag = document.createElement("blockquote");
    blockQuoteTag.className = "blockquote";

    quotesLi.append(blockQuoteTag);

  const pTag = document.createElement("p");
    pTag.className = "mb-0";
    pTag.innerText = quoteObj.quote;

  const footerTag = document.createElement("footer");
    footerTag.className = "blockquote-footer";
    footerTag.innerText = quoteObj.author;

  const brTag = document.createElement("br");

  const likesButton = document.createElement("button");
    likesButton.className = "btn-success";
    likesButton.innerText = "Likes";

  const spanLikesButton = document.createElement("span");
    spanLikesButton.innerText = quoteObj.likes.length;

    likesButton.append(spanLikesButton);

  const delButton = document.createElement("button");
    delButton.className = "btn-danger";
    delButton.innerText = "Delete";


  blockQuoteTag.append(pTag, footerTag, brTag, likesButton, delButton);
  quoteListUl.append(quotesLi);
//EVENT LISTENER FOR DELETE BUTTON
delButton.addEventListener("click", event => {
    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
    method: "DELETE"
    })
    .then(response => response.json())
    .then((emptyObject) => quotesLi.remove())
  });
//END OF EVENT LISTENER 

//EVENT LISTENER FOR SUBMIT FORM BUTTON
quotesForm.addEventListener("submit", event => {
    event.preventDefault()

    let newQuoteObj = {
        quote: event.target.quote.value,
        author: event.target.author.value
    }
   
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuoteObj)
    })
      .then((response) => response.json())
      .then((newQuote) => {
        convertToHtml(newQuote)
        event.target.reset()
      })
  });
}
//END OF EVENT LISTENER FOR SUBMIT FORM BUTTON