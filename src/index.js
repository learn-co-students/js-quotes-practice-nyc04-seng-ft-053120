const quoteListUl = document.querySelector("#quote-list")
const newForm = document.querySelector("#new-quote-form")

newForm.addEventListener("submit", (evt) => {
  evt.preventDefault()
  console.log(evt.target.quote.value)
  console.log(evt.target.author.value)

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "quote": evt.target.quote.value,
      "author": evt.target.author.value,
      "likes": []
    })
  }

  fetch("http://localhost:3000/quotes", options)
    .then(res => res.json())
    .then(newQuote => {
      addQuoteToList(newQuote)
    })
})

fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(quotesArray => {
    quoteListUl.innerHTML = ""
    quotesArray.forEach(quote => {
      addQuoteToList(quote)
    });
  })

const addQuoteToList = (quote) => {
  const quoteLi = document.createElement("li")
  quoteLi.className = "quote-card"

  const quoteBlockQuote = document.createElement("blockquote")
  quoteBlockQuote.className = "blockquote"

  const quoteP = document.createElement("p")
  quoteP.className = "mb-0"
  quoteP.innerText = quote.quote

  const quoteFooter = document.createElement("footer")
  quoteFooter.className = "blockquote-footer"
  quoteFooter.innerText = quote.author

  const likeButton = document.createElement("button")
  likeButton.className = "btn-success"
  likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`

  likeButton.addEventListener("click", (evt) => {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "quoteId": quote.id, "createdAt": Date.now() })
    }

    fetch("http://localhost:3000/likes", options)
      .then(res => res.json())
      .then(newLike => {
        quote.likes.push(newLike)
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
      })
  })

  const deleteButton = document.createElement("button")
  deleteButton.className = "btn-danger"
  deleteButton.innerText = "Delete"

  deleteButton.addEventListener("click", (evt) => {

    const options = {
      method: "DELETE",
    }

    fetch(`http://localhost:3000/quotes/${quote.id}`, options)
      .then(res => res.json())
      .then(result => {
        quoteLi.remove()
      })
  })

  const quoteBr = document.createElement("br")

  quoteBlockQuote.append(quoteP, quoteFooter, quoteBr, likeButton, deleteButton)
  quoteLi.append(quoteBlockQuote)
  quoteListUl.append(quoteLi)

}