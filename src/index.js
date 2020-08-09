let quoteList = document.querySelector("#quote-list")
let quoteForm = document.querySelector("#new-quote-form")

fetch("http://localhost:3000/quotes?_embed=likes")
.then(res => res.json())
.then((quoteArr) => {
  quoteArr.forEach((quoteObj) => {
    turnQuoteIntoHTML(quoteObj)
  })
})

// 1. make the big box
// 2. fill the big box
// 3. slap it on the DOM
// 4. find objects in box
// 5. create event listeners

// for an edit event:
// 1. change in memory
// 2. change in database
// 3. change on page

let turnQuoteIntoHTML = (quoteObj) => {
  // quoteObj = {author: '', id: '', likes: [] or [{}], quote}

  let quoteBox = document.createElement("blockquote")
    quoteBox.className = "blockquote"

  let quoteText = document.createElement("p")
    quoteText.className = "mb-0"
    quoteText.innerText = quoteObj.quote

  let authorFooter = document.createElement("footer")
    authorFooter.className = "blockquote-footer"
    authorFooter.innerText = quoteObj.author

  let likesButton = document.createElement("button")
    likesButton.className = "btn-success"
    let likesNumber = document.createElement("span")

      if (quoteObj.likes) {
        likesNumber.innerText = quoteObj.likes.length
      }
      else {
        likesNumber.innerText = 0
      }

    likesButton.innerText = `Likes: `
    likesButton.append(likesNumber)

  let deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"

  let editButton = document.createElement("button")
      editButton.className = "btn-info"
      editButton.innerText = "Edit"

  quoteBox.append(quoteText, authorFooter, likesButton, editButton, deleteButton)

  quoteList.append(quoteBox)

  deleteButton.addEventListener("click", (evt) => {
    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then((removedQuote) => {
      quoteBox.remove()
    })
  })

  likesButton.addEventListener("click", (evt) => {
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        quoteId: quoteObj.id,
        createdAt: Date.now()
      })
    })
    .then(res => res.json())
    .then((likeObj) => {
      ++likesNumber.innerText
    })
  })

  editButton.addEventListener("click", (evt) => {
    let edit = createForm(quoteObj.quote, quoteObj.author)
    quoteBox.append(edit)

    edit.addEventListener("submit", (evt) => {
      evt.preventDefault()

      quoteObj.quote = evt.target.quote.value
      quoteObj.author = evt.target.author.value

      fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          quote: quoteObj.quote,
          author: quoteObj.author
        })
      })
      .then(res => res.json())
      .then(updatedQuote => {
        quoteText.innerText = updatedQuote.quote
        authorFooter.innerText = updatedQuote.author
      })
      edit.setAttribute('hidden', '')
    })
  })

}

// quotes are created with quote and author

quoteForm.addEventListener("submit", (evt)=> {
  evt.preventDefault()

  let newQuote = evt.target.quote.value
  let newAuthor = evt.target.author.value

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor,
    })
  })
  .then(res => res.json())
  .then(newQuoteObj => {
    turnQuoteIntoHTML(newQuoteObj)
  })

  evt.target.reset()
})

let createForm = (quote, author) => {
  let editForm = document.createElement("form")
    editForm.id = "edit-quote-form"

  let quoteDiv = document.createElement("div")
    quoteDiv.className = "form-group"

  let authorDiv = document.createElement("div")
    authorDiv.className = "form-group"

  let quoteLabel = document.createElement("label")
    quoteLabel.innerText = "Edit Quote: "
  
  let quoteInput = document.createElement("input")
    quoteInput.value = `${quote}`
    quoteInput.name = "quote"

  let authorLabel = document.createElement("label")
    authorLabel.innerText = "Edit Author: "

  let authorInput = document.createElement("input")
    authorInput.value = `${author}`
    authorInput.name = "author"

  quoteDiv.append(quoteLabel, quoteInput)
  authorDiv.append(authorLabel, authorInput)

  let submitButton = document.createElement("button")
    submitButton.type = "submit"
    submitButton.className = "btn btn-primary"
    submitButton.innerText = "Submit"

  editForm.append(quoteDiv, authorDiv, submitButton)

  return editForm
}

// APPEND DOESN"T RETURN AN OBJECT< RETURNS UNDEFINED< CHECK RETURN VALUES