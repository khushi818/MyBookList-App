//book class: Represents a book
class Book{
    constructor(title,author,id)
    {
    this.title = title.trim();
    this.author = author.trim();
    this.id = id;
    }
}
// UI class: Handle UI Tasks
class UI{
    static displayBooks()
    {
        // const StoredBooks = [
        //     {
        //         title:'Book One',
        //         author:'John Doe',
        //         id:'3434434'
        //     },
        //     {
        //         title:'Book Two',
        //         author:'Jane Doe',
        //         id:'45545'
        //     }
        // ];
          
        
    const books = Store.getBooks();
    books.forEach((book) => UI.addBooktoList(book));
    
    }

    static addBooktoList(book)
    {
    // adding a book (do check the function problem)
      const list  = document.querySelector('#book-list');
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.id}</td>
      <td><a href = "#" class = "btn btn-primary btn-sm p-0"><i class = "fas fa-edit" id = "pen"><i></a></td>
      <td><a href = "#" class = "btn btn-danger btn-sm delete p-0" id = "cross">X</a></td>
      `; 
      list.appendChild(row);
    }


    static showAlert(message,className)
    {
      const div = document.createElement('div')
      div.className =`alert alert-${className}`;
      div.appendChild(document.createTextNode(message))
      const con = document.querySelector('#form-container')
      con.insertBefore(div,con.children[0]); // it appends inside a parent and before a child

      setTimeout(() => {
        document.querySelector('.alert').remove()
      }, 3000);
    }

    static clearFields()
    {
      document.querySelector('#Title').value = '';
      document.querySelector('#Author').value = '';
      document.querySelector('#Id').value = '';
    }
    
    static deleteBook(el)
    {
      if(el.classList.contains('delete')) 
      {
        el.parentElement.parentElement.remove();
      }
    }
    //check id
    

    static updateBook(el)
    {
      document.querySelector('#Title').value = el.parentElement.parentElement.parentElement.children[0].textContent
      document.querySelector('#Author').value = el.parentElement.parentElement.parentElement.children[1].textContent
      document.querySelector('#Id').value = el.parentElement.parentElement.parentElement.children[2].textContent     
      UI.deleteBook(el.parentElement.parentElement.nextElementSibling.children[0]) 
    }
}

//Store class:Handles storage
class Store
{
  static getBooks()
  {
    let books;
    if(localStorage.getItem('books') === null)
    {
      books = []
    }
    else
    {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }
  static check(id)
    {
      const books = Store.getBooks();
      for (let book of books)
      {
       if(book.id === id)
       {
       return true;
       }
      }
      return false;
    }
  static addBook(book)
  {
    const books =  Store.getBooks();
    console.log(books);
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    window.location.reload();
  }
  static removeBook(id)
  {
    const books = Store.getBooks()

    books.forEach((book,index) => {
      if(book.id === id)
      {
        books.splice(index,1);
      }
  });

  localStorage.setItem('books',JSON.stringify(books));
  }
}


//Event:add a book
  document.querySelector('#book-form').addEventListener('submit',(e) =>
  {
    e.preventDefault();
    
    const title =  document.querySelector('#Title').value;
    const author = document.querySelector('#Author').value;
    const id = document.querySelector('#Id').value;
    
    //validate
    if(title === '' || author === '' || id === '' ||  Store.check(id))
    {
       UI.showAlert('please fill in all fields correctly or unique id','danger');
    }
    else {

        // Instantiate book
        const book = new Book(title,author,id);
        // add books
        UI.addBooktoList(book);
        //add to the store
        setTimeout(()=>{
        Store.addBook(book);
        },1000) 
        // clear fields
        UI.clearFields();

        UI.showAlert('Book Added','success');
    }
  })


//Event:Remove a Books
document.querySelector('#book-list').addEventListener('click' ,(e) =>{
  if(e.target.id === 'cross')
  {
    UI.deleteBook(e.target)
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent) 
    UI.showAlert('book removed','success')
  }
  else if(e.target.id === 'pen')
  {
    UI.updateBook(e.target)
    const del = e.target.parentElement.parentElement.previousElementSibling.textContent;
    Store.removeBook(del)
    UI.showAlert('book updated','success')
  }
    // e.preventDefault()
})

document.querySelector('#sort-button').addEventListener('click',()=>
{
  const books = Store.getBooks();
  books.sort((a,b) =>{
    return a.id - b.id; 
  })
  localStorage.setItem('books', JSON.stringify(books));// add to local storage
  window.location.reload();// so that window reload and set localstorage
})

//Event:Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);



// Search Box and its searchhh

//under search
const ultag = document.querySelector('#form-search')
const books = Store.getBooks();
for(let book = 0 ; book < books.length ; book++){
  const childdiv = ` <li class= "user-card  w-100 p-2  align-items-center  justify-content-center d-none"
                         data-user${book} = "${book}">
            Title:${books[book].title.trim()}     Author:${books[book].author.trim()}     Id:${books[book].id}
    </li>`;
ultag.insertAdjacentHTML('beforeend',childdiv)
}


const searchBox = document.querySelector('#Search-Box')
  const titles = books.map((book) =>
  {
    return book.title; 
  })
  const ids = books.map((book) =>
  {
    return book.id; 
  })
  const authors = books.map((book) =>
  {
    return book.author; 
  })


function noresult(){
  document.querySelector('#body-content').classList.remove('d-none');
  document.querySelector('#body-content').classList.add('d-block');
  
  const searchCard = document.querySelectorAll('.user-card')
  for (let card of searchCard){
  card.classList.add('d-none');
  card.classList.remove('d-flex');
  }
}  

searchBox.addEventListener('input',(e) =>
{
  document.querySelector('#body-content').classList.remove('d-block');
  document.querySelector('#body-content').classList.add('d-none');
  let input = e.target.value;
  input = input.toLowerCase();
  //Search(input);

if(input.length > 1){
  for(let i = 0 ; i < books.length ; i++)
  {
    if(titles[i].toLowerCase().includes(input))
    {
    let card = titles.indexOf(titles[i]);
    let searchCard = ultag.querySelector(`[data-user${card}]`);
    searchCard.classList.remove('d-none')
    searchCard.classList.add('d-flex')
    }
    else if(authors[i].toLowerCase().includes(input))
    {
    let card = authors.indexOf(authors[i]);
    let searchCard = ultag.querySelector(`[data-user${card}]`);
    searchCard.classList.remove('d-none')
    searchCard.classList.add('d-flex')
    }
    else if(ids[i].includes(input))
    {
    let card = ids.indexOf(ids[i]);
    let searchCard = ultag.querySelector(`[data-user${card}]`);
    searchCard.classList.remove('d-none')
    searchCard.classList.add('d-flex')
    }
   }
}

if(input.length === 1)
  {
  for(let i = 0 ; i < books.length ; i++)
  {
    if(ids[i].includes(input))
    {
    let card = ids.indexOf(ids[i]);
    let searchCard = ultag.querySelector(`[data-user${card}]`);
    searchCard.classList.remove('d-none')
    searchCard.classList.add('d-flex')
    }
  }
}

  if(input.length == 0)
  {
   noresult();
  }
  e.preventDefault();
})





