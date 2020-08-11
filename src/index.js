
fetch ('http://localhost:3000/quotes?_embed=likes')
.then(res => res.json())
.then(quoteArr => quoteArr.forEach((quote) => {
    renderQuote(quote)
}))

let quoteContainer = document.querySelector('#quote-list')
let newForm = document.querySelector('#new-quote-form')

let renderQuote = (quoteObj) => {
    console.log(quoteObj)
    console.log(quoteObj.likes.length)
    let quoteLi = document.createElement('li')
        quoteLi.classList.add('quote-card')

    let quoteBlock = document.createElement('blockquote')
        quoteBlock.classList.add("blockquote")

    let quotePar = document.createElement('p')
        quotePar.classList.add("mb-0")
        quotePar.innerText = quoteObj.quote

    let quoteFooter = document.createElement('footer')
        quoteFooter.classList.add("blockquote-footer")
        quoteFooter.innerText = quoteObj.author

    let newBr = document.createElement('br')

    let likeButton = document.createElement('button')
        likeButton.classList.add("btn-success")
        let buttonSpan = document.createElement('span')
            buttonSpan.innerText = quoteObj.likes.length
        likeButton.innerHTML = 'Likes:'
            likeButton.append(buttonSpan)

    let deleteButton = document.createElement('button')
        deleteButton.classList.add("btn-danger")
        deleteButton.innerText = 'Delete'

    quoteBlock.append(quotePar, quoteFooter, newBr, likeButton, deleteButton )
    quoteLi.append(quoteBlock)
    quoteContainer.append(quoteLi)


//Deletes Posting from API and the DOM
    deleteButton.addEventListener("click", (evt) => {
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
        method: "DELETE"
        })
        .then(res => res.json())
        .then((emptyObject) => {
            quoteLi.remove()
        })
    })


//Clicking Button will create a like for specific quote
    likeButton.addEventListener("click", (evt) => {
        
       let innerInt = parseInt(buttonSpan.innerText)
       innerInt += 1

        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quoteId: quoteObj.id,
                createdAt: Date.now()
            })
         }   
        )
        .then(res => res.json())
        .then(likeData => {
            buttonSpan.innerText = innerInt
        })
        //I didnt use the returned data in this fetch
    })

}


//Creates new Post and updtes API and DOM

newForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let newQuote = evt.target['new-quote'].value
    let newAuthor = evt.target.author.value

    // console.log(newQuote)
    // console.log(newAuthor)


    fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify ({
                quote: newQuote,
                author: newAuthor,
            })
        })
        .then(res => res.json())
        .then((newPost) => {
            renderQuote(newPost)
            return quoteContainer
        }
    )



})