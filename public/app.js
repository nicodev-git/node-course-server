document.querySelectorAll(".price").forEach((node) => {
  node.textContent = new Intl.NumberFormat("ru-RU", {
    currency: "UAH",
    style: "currency",
  }).format(node.textContent);
});
