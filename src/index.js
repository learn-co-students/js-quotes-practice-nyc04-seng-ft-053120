let quoteListUl = document.querySelector("#quote-list")

let quoteForm = document.querySelector("#new-quote-form")

fetch("http://localhost:3000/quotes?_embed=likes")
.then(r => r.json())
.then((arrayOfQuotes) => {
    arrayOfQuotes.forEach(singleQuote => {
        turnQuoteToHTML(singleQuote)
    });
})

let turnQuoteToHTML = (singleQuote) => {

    let newLi = document.createElement("li")
    newLi.className = "quote-card"

    let newBloc = document.createElement("blockquote")
    newBloc.className = "blockquote"

    let newP = document.createElement("p")
    newP.className = "mb-0"
    newP.innerText = singleQuote.quote

    let newFooter = document.createElement("footer")
    newFooter.className ="blockquote-footer"
    newFooter.innerText = singleQuote.author

    let newBreak = document.createElement("br")

    let likeButton = document.createElement("button")
    likeButton.className = "btn-success"
        likeButton.innerText = "Likes: "

    let newSpan = document.createElement("span")
    newSpan.innerText = singleQuote.likes.length
    likeButton.append(newSpan)

    let deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText ="Delete"

    newBloc.append(newP, newFooter, newBreak, likeButton, deleteButton )
    newLi.append(newBloc)
    quoteListUl.append(newLi)

    deleteButton.addEventListener("click", (evt) =>{
        fetch(`http://localhost:3000/quotes/${singleQuote.id}`,{
            method: "DELETE"
        }).then(r => r.json())
        .then(() => {
           newLi.remove()
        })
    })

    likeButton.addEventListener("click", (evt) => {
        let likesPlus = singleQuote.likes
        fetch(`http://localhost:3000/likes`,{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                quoteId: singleQuote.id,
                createdAt: Date.now()
            })
            }).then(res => res.json())
        .then((updatedLikes) => {
            likesPlus.push(updatedLikes)
            newSpan.innerText = likesPlus.length
            })
        })
    }

    quoteForm.addEventListener("submit", (evt)=>{   
        evt.preventDefault() 
        let userInput = {quote: evt.target.quote.value, author: evt.target.author.value}
        
        fetch("http://localhost:3000/quotes",{
            method: "POST",
            headers: {
                "content-type": "application/json"
            }, 
            body: JSON.stringify(userInput)
        })
        .then(r => r.json())
        .then((newQuote) => {
            turnQuoteToHTML(newQuote)
            quoteForm.reset()
        })

    })
