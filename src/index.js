const quoteListUl = document.querySelector('ul#quote-list');
const newQuoteForm = document.querySelector('form#new-quote-form');
const sortButton = document.querySelector('button#sort')


fetch('http://localhost:3000/quotes?_embed=likes')
.then(response => response.json())
.then(quotesObjArray => quotesObjArray.forEach((quoteObj) => {
    quoteObjToHTML(quoteObj)
}));


function quoteObjToHTML(quoteObj) {
    let quoteLi = document.createElement('li')
    
    let blockquote = document.createElement('blockquote')
        blockquote.className = 'blockquote'
    
    quoteLi.append(blockquote)
    
    let quoteP = document.createElement('p')
        quoteP.classList.add('mb-0')
        quoteP.innerText = quoteObj.quote
    
    let quoteFooter = document.createElement('footer')
        quoteFooter.classList.add('blockquote-footer')
        quoteFooter.innerText = quoteObj.author

    let br = document.createElement('br')

    let quoteLikeButton = document.createElement('button')
        quoteLikeButton.classList.add('btn-success')
        quoteLikeButton.innerText = 'Likes: '

    let quoteLikeButtonSpan = document.createElement('span')
        quoteLikeButtonSpan.innerText = quoteObj.likes.length

    quoteLikeButton.append(quoteLikeButtonSpan)

    let quoteEditButton = document.createElement('button')
        quoteEditButton.innerText = 'Edit'

    let quoteDeleteButton = document.createElement('button')
        quoteDeleteButton.classList.add('btn-danger')
        quoteDeleteButton.innerText = 'Delete'

    blockquote.append(quoteP, quoteFooter, br, quoteLikeButton, quoteEditButton, quoteDeleteButton);
    quoteListUl.append(quoteLi);

    quoteDeleteButton.addEventListener('click', e => {
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => quoteLi.remove())
    });

    quoteLikeButton.addEventListener('click', e => {
        let likeObj = {
            quoteId: quoteObj.id,
            createdAt: Date.now()
        }
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(likeObj)
        })
        .then(response => response.json())
        .then(newLikeObj => quoteLikeButtonSpan.innerText = parseInt(quoteLikeButtonSpan.innerText)+ 1)
    });

    quoteEditButton.addEventListener('click', e => {

        if (blockquote.innerHTML.includes('<form>')) {
            let editForm = blockquote.querySelector('form')
            editForm.remove()
        } else {
            let editForm = document.createElement('form')
            
            let quoteInput = document.createElement('input')
                quoteInput.name = 'quote'
                quoteInput.type = 'text'
                quoteInput.className = 'form-control'
                quoteInput.placeholder = 'quote'
                quoteInput.value = quoteObj.quote
    
            let authorInput = document.createElement('input')
                authorInput.name = 'author'
                authorInput.type = 'text'
                authorInput.className = 'form-control'
                authorInput.placeholder = 'author'
                authorInput.value = quoteObj.author

            let submitEdit = document.createElement('button')
                submitEdit.innerText = 'submit'
    
            editForm.append(quoteInput, authorInput, submitEdit)
            blockquote.append(editForm)
            // event listener for form
            editForm.addEventListener('submit', e => {
                e.preventDefault()
                let editQuoteObj = {
                    quote: e.target.quote.value,
                    author: e.target.author.value
                }
                quoteObj.quote = e.target.quote.value
                quoteObj.author = e.target.author.value
                
                fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(editQuoteObj)
                })
                .then(response => response.json())
                .then(updatedQuoteObj => {
                    quoteP.innerText = updatedQuoteObj.quote
                    quoteFooter.innerText = updatedQuoteObj.author
                    let editForm = blockquote.querySelector('form')
                    editForm.remove()
                } )
            })
        }

    })

};

newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()

    let newQuoteObj = {
        quote: e.target.quote.value,
        author: e.target.author.value
    }

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(newQuoteObj)
    })
    .then(response => response.json())
    .then(quoteObj => {
        quoteObjToHTML(quoteObj)
        e.target.reset()
    })
});

sortButton.addEventListener('click', e => {
    let sortBy = sortButton.querySelector('span')

    if (sortBy.innerText === 'ID') {
        sortBy.innerText = 'Author'
        fetch('http://localhost:3000/quotes?_sort=author&_embed=likes')
        .then(response => response.json())
        .then(quotesObjArray => {
            quoteListUl.innerText = ""
            quotesObjArray.forEach((quoteObj) => quoteObjToHTML(quoteObj))
        });
    } else {
        sortBy.innerText = 'ID'
        fetch('http://localhost:3000/quotes?_sort=id&_embed=likes')
        .then(response => response.json())
        .then(quotesObjArray => {
            quoteListUl.innerText = ""
            quotesObjArray.forEach((quoteObj) => quoteObjToHTML(quoteObj))
        });
    }
})