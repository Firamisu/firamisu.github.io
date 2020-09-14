document.querySelector(".order").addEventListener("click", () => {
    const form = document.querySelector(".form-box");
    form.style.visibility = "visible";
});
document.querySelector(".close").addEventListener("click", () => {
    const form = document.querySelector(".form-box");
    form.style.visibility = "hidden";
});