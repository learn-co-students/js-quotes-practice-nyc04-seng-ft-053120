// DOM Placement
const quoteList = document.getElementById('quote-list');

// Form Actions
const form = document.getElementById('new-quote-form');
const formButton = document.querySelector('.btn btn-primary');

// Form Content
const newQuote = document.getElementById('new-quote');
const newAuthor = document.getElementById('author');

fetch('http://localhost:3000/quotes?_embed=likes')
  .then((response) => response.json())
  .then((quoteArray) => {
    quoteArray.forEach((quote) => {
      quoteToHtml(quote);
    });
  });

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const newQuote = event.target.quote.value;
  const newAuthor = event.target.author.value;

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-type': 'Application/json',
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor,
    }),
  })
    .then((response) => response.json())
    .then((newQuote) => {
      newQuote.likes = [];
      quoteToHtml(newQuote);
    });
});

const quoteToHtml = (quote) => {
  // Outermost HTML Element
  const quoteLi = document.createElement('li');
  quoteLi.classList.add('quote-card');

  // HTML Content
  const quoteBlockquote = document.createElement('blockquote');
  quoteBlockquote.classList.add('blockquote');

  const quoteP = document.createElement('p');
  quoteP.classList.add('mb-0');
  quoteP.innerText = `${quote.quote}`;

  const quoteFooter = document.createElement('footer');
  quoteFooter.innerText = quote.author;

  const quoteLikeButton = document.createElement('button');
  quoteLikeButton.classList.add('btn-success');
  quoteLikeButton.id = quote.id;

  const quoteLikeButtonSpan = document.createElement('span');
  quoteLikeButtonSpan.innerText = `Likes: ${quote.likes.length}`;
  quoteLikeButton.append(quoteLikeButtonSpan);

  const quoteDeleteButton = document.createElement('button');
  quoteDeleteButton.innerText = 'Delete';
  quoteDeleteButton.classList.add('btn-danger');

  // Consolidate HTML Content
  quoteLi.append(
    quoteBlockquote,
    quoteP,
    quoteFooter,
    quoteLikeButton,
    quoteDeleteButton
  );
  // DOM Placement
  quoteList.append(quoteLi);

  // Event Listeners

  quoteDeleteButton.addEventListener('click', (event) => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        quoteLi.remove();
      });
  });

  quoteLikeButton.addEventListener('click', (event) => {
    const now = new Date();
    fetch(`http://localhost:3000/likes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        quoteId: parseInt(quoteLikeButton.id, 10),
        createdAt: now.getTime(),
      }),
    })
      .then((response) => response.json())
      .then((newLike) => {
        // Update what the user sees on the DOM
        quote.likes.push(newLike);
        quoteLikeButtonSpan.innerText = `Likes: ${quote.likes.length}`;
      });
  });
};
