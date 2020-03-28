let banknoteList = document.querySelector("ul");
let form = document.querySelector("form");
let ntb = document.querySelector("#ntb");
let modal = document.querySelector(".modal");
let yes = document.querySelector("#yes");
let cancel = document.querySelector("#cancel");

let regExYear = /^[0-9]{0,5}$/;
let regExValue = /^[0-9]{1,20}$/;
let regExp = /^[a-zA-Z0-9]{1,40}$/;

console.log(db.collection('coolest_banknotes'))

let banknoteListRender = doc => {
  let listElement = document.createElement("li");
  let divForParagraphs = document.createElement ("div")
  let img = document.createElement ("img")
  let infoParagraph1 = document.createElement("p");
  let infoParagraph2 = document.createElement("p");
  let infoParagraph3 = document.createElement("p");
  let del_btn = document.createElement("span");
  let space = "&nbsp &nbsp"
  
  listElement.setAttribute("data-id", doc.id);
  divForParagraphs.setAttribute("id", "info_paragraph");
  img.setAttribute("src",`${doc.data().imageUrl}`)

  infoParagraph1.innerHTML = `Banknote:${space}${doc.data().currencyValue} ${doc.data().currencyType},${space}issued: ${doc.data().releaseYear}`;
  infoParagraph2.innerHTML = `This banknote use:${space}${doc.data().useBy}`;
  infoParagraph3.innerHTML = `<a href=${doc.data().moreInfo}>More info about this banknote...</a>`;
  del_btn.innerText = "X";
  del_btn.classList = "delete_btn";

  banknoteList.appendChild(listElement);
  listElement.appendChild(img);
  listElement.appendChild(divForParagraphs)
  divForParagraphs.appendChild(del_btn);
  divForParagraphs.appendChild(infoParagraph1);
  divForParagraphs.appendChild(infoParagraph2);
  divForParagraphs.appendChild(infoParagraph3);


  // Preko html-a brise elemenat liste iz baze

  del_btn.addEventListener("click", e => {
    e.stopPropagation();    
    window.scrollTo(0, 0)
    let id = e.target.parentElement.parentElement.getAttribute("data-id");

    if ((modal.style.display = "none")) {
      modal.style.display = "block";
      yes.addEventListener("click", () => {
        db.collection("coolest_banknotes")
          .doc(id)
          .delete();
        modal.style.display = "none";
      });
      cancel.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
  });
};

// db.collection('coolest_banknotes').get()
// .then(e=>{
//   e.docs.forEach(doc=>{
//     console.log(doc.data())
//   })
// })

// Slusa promenu stanja u bazi, i updatuje aplikaciju (brise listu ukoliko je ona izbrisana iz baze)
db.collection("coolest_banknotes")
.orderBy("currencyType")
.onSnapshot(snapshop => {
  let chages = snapshop.docChanges();
  chages.forEach(change => {
    console.log(change)
    if (change.type == "added") {
        banknoteListRender(change.doc);
      } else if (change.type == "removed") {
        let li = banknoteList.querySelector(`[data-id=${change.doc.id}]`);
        banknoteList.removeChild(li);
      }
    });
  });


// Skuplja podatek iz forme i salje ih u bazu 

form.addEventListener("submit", e => {
  e.preventDefault();
  if (
    form.currencyType.value == "" ||
    regExValue.test(form.currencyValue.value) == "" ||
    regExYear.test(form.releaseYear.value) == "" ||
    form.useBy.value == "" ||
    form.imageUrl.value == "" ||
    form.moreInfo.value == ""
  ) {
    alert(
      "You need to fill form, curency value must be number, year must be four digits number!!!"
    );
  } else {
    db.collection("coolest_banknotes").add({
      currencyType: form.currencyType.value,
      currencyValue: parseInt(form.currencyValue.value),
      releaseYear: parseInt(form.releaseYear.value),
      useBy: form.useBy.value,
      imageUrl: form.imageUrl.value,
      moreInfo: form.moreInfo.value
    });
  }

  form.reset();
});
