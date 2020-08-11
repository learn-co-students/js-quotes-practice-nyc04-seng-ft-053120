const form = document.getElementById('new-quote-form');
const quoteInput = document.getElementById('new-quote');
const authorInput = document.getElementById('author');
const quoteList = document.getElementById('quote-list');

fetchAndShowQuotes();
form.addEventListener('submit', postQuote);

function fetchAndShowQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => displayQuote(quote)));
}

function displayQuote(quoteObj) {
  const quoteLi = createQuoteLi(quoteObj);
  quoteList.append(quoteLi);
}

function createQuoteLi(quoteObj) {
  const li = document.createElement('li');
    li.className = "quote-card"
    li.dataset['quoteId'] = quoteObj.id;

  const blockquote = document.createElement('blockquote');
    blockquote.className = "blockquote";

  const p = document.createElement('p');
    p.className = "mb-0";
    p.textContent = quoteObj.quote;

  const footer = document.createElement('footer');
    footer.className = "blockquote-footer";
    footer.textContent = quoteObj.author;

  const br = document.createElement('br');
  
  const likesSpan = document.createElement('span');
    likesSpan.textContent = quoteObj.likes === undefined ? 0 : quoteObj.likes.length;

  const buttonEdit = document.createElement('button');
    buttonEdit.className = "btn-primary";
    buttonEdit.textContent = "EDIT";
    buttonEdit.addEventListener('click', toggleEditForm);

  const buttonLike = document.createElement('button');
    buttonLike.className = "btn-success";
    buttonLike.textContent = "Likes: ";
    buttonLike.append(likesSpan);
    buttonLike.addEventListener('click', likeQuote);

  const buttonDelete = document.createElement('button');
    buttonDelete.className = "btn-danger";
    buttonDelete.textContent = "Delete";
    buttonDelete.addEventListener('click', deleteQuote);

  blockquote.append(p, footer, br, buttonEdit, buttonLike, buttonDelete);
  li.append(blockquote);

  return li;
}

function toggleEditForm(e) {
  const parentQuoteLi = e.target.closest('li');
  const quote = parentQuoteLi.querySelector('p.mb-0').textContent;
  const author = parentQuoteLi.querySelector('footer').textContent;

  const currentForm = parentQuoteLi.querySelector('form');
  const hasNoEditForm = currentForm === null;
  
  if (hasNoEditForm) {
    const editForm = createEditForm(quote, author);
    parentQuoteLi.append(editForm);
  } else {
    currentForm.remove();
  }
}

function createEditForm(quote, author) {
  const form = document.createElement('form');
    form.id = "edit-quote-form";
    form.innerHTML = `<div class="form-group">
    <label for="edit-quote">Update Quote</label>
    <input name="quote" type="text" class="form-control" id="edit-quote" value="${quote}">
  </div>
  <div class="form-group">
    <label for="Author">Author</label>
    <input name="author" type="text" class="form-control" id="edit-author" value="${author}">
  </div>
  <button type="submit" class="btn btn-primary">Update</button>`
  form.addEventListener('submit', patchQuote);

  return form;
}

function patchQuote(e) {
  e.preventDefault();

  const parentQuoteLi = e.target.closest('li');
  const quoteId = parentQuoteLi.dataset['quoteId'];
  const quoteP = parentQuoteLi.querySelector('blockquote p.mb-0');
  const quoteAuthor = parentQuoteLi.querySelector('blockquote footer');

  const editForm = parentQuoteLi.querySelector('form');
  const quoteInput = editForm['edit-quote'].value;
  const authorInput = editForm['edit-author'].value;
  
  const patchConfig = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quote: quoteInput,
      author: authorInput
    })
  }

  fetch(`http://localhost:3000/quotes/${quoteId}`, patchConfig)
    .then(res => res.json())
    .then(quoteObj => {
      quoteP.textContent = quoteObj.quote.trim();
      quoteAuthor.textContent = quoteObj.author.trim();
    });
}

function postQuote(e) {
  e.preventDefault();

  const quote = quoteInput.value.trim();
  const author = authorInput.value.trim();

  const postConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quote: quote,
      author: author
    })
  }

  fetch('http://localhost:3000/quotes', postConfig)
    .then(res => res.json())
    .then(quoteObj => displayQuote(quoteObj));

  e.target.reset();
}

function likeQuote(e) {
  const parentQuoteLi = e.target.closest('li');
  const quoteId = parseInt(parentQuoteLi.dataset['quoteId']);
  const likeButton = e.target;
  const likeSpan = likeButton.querySelector('span');
  const createdAt = Date.now();

  const postConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quoteId: quoteId,
      createdAt: createdAt
    })
  }

  fetch('http://localhost:3000/likes', postConfig)
    .then(_ => likeSpan.textContent = parseInt(likeSpan.textContent) + 1);
}

function deleteQuote(e) {
  const parentQuoteLi = e.target.closest('li');
  const quoteId = parseInt(parentQuoteLi.dataset['quoteId']);
  
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE"
  }).then(_ => parentQuoteLi.remove())
}