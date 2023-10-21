// localStorageKey
const unreadBooks = "UNREAD_BOOKS";
const readBooks = "READ_BOOKS";
// container of boxes
const unreadBox = document.querySelector(".unread .unreadBox");
const readBox = document.querySelector(".read .readBox");
// button
const btnSubmit = document.getElementById("form");
// input
const title = document.getElementById("title");
const description = document.getElementById("description");
const public = document.getElementById("publication-year");
const linkBook = document.getElementById("link-book");

window.addEventListener("load", function () {
  if (typeof Storage != "undefined") {
    if (this.localStorage.getItem(unreadBooks) === null) {
      this.localStorage.setItem(unreadBooks, "[]");
    }
    if (this.localStorage.getItem(readBooks) === null) {
      this.localStorage.setItem(readBooks, "[]");
    }
    // render exist books
  } else {
    this.alert("your browser not support");
  }
  renderUnread();
  renderRead();
});

// ADD BOOK
btnSubmit.addEventListener("submit", function (e) {
  e.preventDefault();
  addNewBook();
  renderUnread();
});

// ADDING NEW BOOK IN THE LOCALSTORAGE
function addNewBook() {
  const titleValue = title.value;
  const descValue = description.value;
  const publicValue = public.value;
  // const linkValue = linkBook.value;
  const timestamp = +new Date();
  let book = {
    id: timestamp,
    title: titleValue,
    author: descValue,
    year: publicValue,
    isComplete: false,
  };
  const API = getAPI(unreadBooks);
  API.unshift(book);
  postAPI(unreadBooks, API);
}

// render Unread
function renderUnread() {
  const API = getAPI(unreadBooks);
  unreadBox.textContent = "";
  API.forEach((element) => {
    render(element, ".unread .unreadBox");
  });
}

function renderRead() {
  const API = getAPI(readBooks);
  readBox.textContent = "";
  API.forEach((element) => {
    render(element, ".read .readBox");
  });
}

// RENDER
function render(element, boxes) {
  const parent = document.querySelector(boxes);
  const box = document.createElement("div");
  const h6 = document.createElement("h6");
  const author = document.createElement("p");
  const pPublic = document.createElement("p");

  box.classList.add("box");
  box.id = element.id;
  h6.classList.add("title");
  author.classList.add("author");
  pPublic.classList.add("publication-year");

  // adding vale
  h6.textContent = element.title;
  author.textContent = element.author;
  pPublic.textContent = element.year;

  // enter to box
  box.appendChild(h6);
  box.appendChild(author);
  // box.appendChild(link);
  box.appendChild(pPublic);
  parent.appendChild(box);

  // create control
  const control = document.createElement("div");
  const read = document.createElement("div");
  const done = document.createElement("div");
  const del = document.createElement("div");

  control.classList.add("control");
  read.classList.add("read", "box");
  done.classList.add("done", "box");
  del.classList.add("del", "box");

  control.appendChild(read);
  control.appendChild(done);
  control.appendChild(del);
  box.appendChild(control);

  // move to already read
  alreadyRead(done, box);
  unread(read, box);
  remove(del, box);
}
// delete function
function remove(removeBtn, box) {
  if (box.closest(".read")) {
    removeBtn.addEventListener("click", function () {
      const API = getAPI(readBooks);
      const removeAPI = API.filter((e) => e.id != box.id);
      deleteAPI(readBooks);
      postAPI(readBooks, removeAPI);
      renderRead();
    });
  }
  if (box.closest(".unread")) {
    removeBtn.addEventListener("click", function () {
      const API = getAPI(unreadBooks);
      const removeAPI = API.filter((e) => e.id != box.id);
      deleteAPI(unreadBooks);
      postAPI(unreadBooks, removeAPI);
      renderUnread();
    });
  }
}
// unread Function
function unread(readBtn, box) {
  if (box.closest(".read")) {
    readBtn.addEventListener("click", function () {
      // delete Box
      const API = getAPI(readBooks);
      const findAPIIndex = API.findIndex((e) => e.id == box.id);
      if (findAPIIndex !== -1) {
        API[findAPIIndex].isComplete = false;
        const spliceAPI = API.splice(findAPIIndex, 1);
        const unreadAPI = getAPI(unreadBooks);
        const post = unreadAPI.concat(spliceAPI);
        postAPI(unreadBooks, post);
        renderUnread();
        // update read
        const removeAPI = API.filter((e) => e.id != box.id);
        deleteAPI(readBooks);
        postAPI(readBooks, removeAPI);
        renderRead();
      }
    });
  }
}
// alreadyread function
function alreadyRead(doneBtn, box) {
  if (box.closest(".unread"))
    doneBtn.addEventListener("click", function () {
      // delete box
      const API = getAPI(unreadBooks);
      const findAPIIndex = API.findIndex((e) => e.id == box.id);
      if (findAPIIndex !== -1) {
        API[findAPIIndex].isComplete = true;
        const spliceAPI = API.splice(findAPIIndex, 1);
        const readAPI = getAPI(readBooks);
        const post = readAPI.concat(spliceAPI);
        postAPI(readBooks, post);
        renderRead();
        // update unread API
        const removeAPI = API.filter((e) => e.id != box.id);
        deleteAPI(unreadBooks);
        postAPI(unreadBooks, removeAPI);
        renderUnread();
      }
    });
}

// get API
function getAPI(key) {
  return JSON.parse(localStorage.getItem(key));
}

// post API
function postAPI(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// delete APi
function deleteAPI(API) {
  localStorage.removeItem(API);
}
