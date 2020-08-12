const quotesArray = [];
const quotesUl = document.querySelector("#quote-list")
const newquoteForm = document.querySelector("#new-quote-form")
// console.log(newquoteForm)
// fetch quotes array
fetch("http://localhost:3000/quotes?_embed=likes")
.then((resp) => resp.json())
.then((quotesArr) => {
    quotesArr.forEach((quoteObj) => {
        convertToHTML(quoteObj)
        quotesArray.push(quoteObj)
  })
}); 
// convert to html function expression
let convertToHTML = (singleQuote) => {
    const quoteLi = document.createElement("li")
        quoteLi.className = "quote-card"
    const blockQuote = document.createElement("blockquote")
        blockQuote.className = "blockquote"
    const quoteP = document.createElement("p")
        quoteP.innerText = singleQuote.quote
        quoteP.className = "mb-0"
    const quoteFooter = document.createElement("footer")
        quoteFooter.innerText = singleQuote.author
        quoteFooter.className = "blockquote-footer"
    const quoteBr = document.createElement("br")
    const likesButton = document.createElement("button")
        likesButton.className = "btn-success"
        likesButton.innerText = "Likes: "
    const likesSpan = document.createElement("span")
        likesSpan.innerText = singleQuote.likes.length
        likesButton.append(likesSpan)
    const deleteButton = document.createElement("button")
        deleteButton.className = "btn-danger"
        deleteButton.innerText = "Delete"

    blockQuote.append(quoteP, quoteFooter, quoteBr, likesButton, deleteButton)
    quoteLi.append(blockQuote)
    quotesUl.append(quoteLi)

    // EVENT LISTENER TO DELETE BUTTON
    deleteButton.addEventListener("click", (evt) => {
        fetch(`http://localhost:3000/quotes/${singleQuote.id}`, {
            method: "DELETE"  
        })
        .then(resp => resp.json())
        .then(() => {
            quoteLi.remove()
        })
    }) // END OF DELETE EVENT LISTENER

    //  EVENT LISTENER TO LIKE BUTTON
    likesButton.addEventListener("click", (evt) => {
            let likesPlus = singleQuote.likes
        fetch(`http://localhost:3000/likes/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteId: singleQuote.id,
                createdAt: Date.now()
            })
            })
            .then(resp => resp.json())
            .then((newLike) => {
                // PUSH THE NEW LIKE TO OUR LIKES ARRAY AKA LIKESPLUS
                likesPlus.push(newLike)
                // ADD THE UPDATED ARRAY AKA LIKESPLUS TO OUR LIKES SPAN
                likesSpan.innerText = likesPlus.length
            })
        })
    }; // END OF CONVERT INTO HTML

newquoteForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    let userInput = {
        quote: evt.target.quote.value,
        author: evt.target.author.value
    }

    fetch(`http://localhost:3000/quotes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInput)
            })
            .then(res => res.json())
            .then((newQuote) => {
                convertToHTML(newQuote)
                newquoteForm.reset()
            })
}); // END OF EVENT LISTENER