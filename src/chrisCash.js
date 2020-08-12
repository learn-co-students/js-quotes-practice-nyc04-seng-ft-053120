let quoteList = document.querySelector("#quote-list")
let newQuoteForm = document.querySelector("#new-quote-form")

fetch('http://localhost:3000/quotes?_embed=likes')
.then(res => res.json())
.then(arrOfQuotes =>
    arrOfQuotes.forEach((quoteObj) => {
        turnQuoteToHTML(quoteObj)
    })
)

let turnQuoteToHTML = (quoteObj) => {
// quoteObj = {id: 1, quote: "Expect nothing. Live frugally on surprise.", author: "Alice Walker", likes: Array(1)}
    let newLi = document.createElement("li")
    newLi.className = 'quote-card'

    let newBlockQuote = document.createElement("blockquote")
     newBlockQuote.className = "blockquote"

    newLi.append(newBlockQuote)

    let newP = document.createElement("p")
    newP.className = "mb-0"
    newP.innerText = quoteObj.quote

    let footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quoteObj.author

    let breakLine = document.createElement("br")

    let likeBtn = document.createElement("button")
    likeBtn.className = 'btn-success'
    likeBtn.innerText= "Likes: "

    let likeBtnSpan = document.createElement("span")
    likeBtnSpan.innerText = quoteObj.likes.length

    likeBtn.append(likeBtnSpan)

    let deleteBtn = document.createElement("button")
    deleteBtn.className = 'btn-danger'
    deleteBtn.innerText = "Delete"

    newBlockQuote.append(newP, footer, breakLine, likeBtn, deleteBtn)
    quoteList.append(newLi)

    deleteBtn.addEventListener("click", (evt) => {
     
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: 'DELETE',
        })
        .then(resp => resp.json())
        .then(() => newLi.remove())
    })

        likeBtn.addEventListener("click", evt => {

            fetch(`request to http://localhost:3000/likes`, {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                }, 
                body: JSON.stringify({
                  quoteId: quoteObj.id  
                })
                .then(res => res.json())
                .then(updatedLike => likeBtnSpan.innerText = ikeBtnSpan.innerText+=1)
            })
        })
}
        newQuoteForm.addEventListener("submit",  (evt) => {
            evt.preventDefault()
            let newQuote = evt.target.quote.value
            let newAuthor = evt.target.author.value
    
           fetch("http://localhost:3000/quotes?_embed=likes", {
               method: "POST",
               headers: {
                    "content-type" : "application/json"
               }, 
               body: JSON.stringify({
                   quote: newQuote,
                   author: newAuthor
               })
            })
            .then(res => res.json())
            .then(newlyCreatedQuote => { turnQuoteToHTML(newlyCreatedQuote)
              evt.target.reset()
            })
        })
