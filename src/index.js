let quoteUl = document.querySelector("#quote-list")
let quoteForm = document.querySelector("#new-quote-form")

fetch("http://localhost:3000/quotes?_embed=likes")
.then(r => r.json())
.then(quotes => { 
    quotes.forEach(quote => {
        turnQuoteIntoHTML(quote)
    })
})

function turnQuoteIntoHTML(quoteObj){
let quoteLi = document.createElement("li")
quoteLi.innerHTML = `<li class='quote-card'>
<blockquote class="blockquote">
  <p class="mb-0">${quoteObj.quote}</p>
  <footer class="blockquote-footer">${quoteObj.author}</footer>
  <br>
  <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
  <button class='btn-danger'>Delete</button>
</blockquote>
</li>`

let deleteButton = quoteLi.querySelector(".btn-danger")
deleteButton.addEventListener("click", (event) => {
fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
    method : "DELETE"
})
.then(r => r.json())
.then((emptyObj) => {
    quoteLi.remove()
})  
})

let likeButton = quoteLi.querySelector(".btn-success")
let likeSpan = quoteLi.querySelector("span")
likeButton.addEventListener("click", (event) => {
    quoteObj.likes.count +=1
    fetch(`http://localhost:3000/likes`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            quoteId: quoteObj.id,
            createdAt: Date.now()
        })
    })
    .then(r => r.json())
    .then((newLike) => {
        likeSpan.innerText =  parseInt(likeSpan.innerText) + 1
    })  
    })

quoteUl.append(quoteLi)
}

quoteForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let quoteNew = event.target.quote.value
    let authorNew = event.target.author.value

    fetch("http://localhost:3000/quotes", {
        method : "POST",
        headers : {
            "Content-Type" : `application/json`
        },
        body: JSON.stringify({
            quote : quoteNew,
            author : authorNew,
            likes : []
        })
    })
    .then(r => r.json())
    .then((newQuote) => {
        turnQuoteIntoHTML(newQuote)
    })

})
