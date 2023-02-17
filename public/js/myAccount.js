const myAccountButton = document.querySelector(".myAccount");

myAccountButton.addEventListener("click", async (event) => {
  let res = await fetch("/user");
  let result = await res.json();

  console.log(result);

  if (!result.username) {

    location.href = `/user.html?next=${location.href}`;
    return;
  }

  location.href = `/userBookingRecordPage.html`;
});
