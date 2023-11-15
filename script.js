const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: null,
  kind: null,
  price: null,
};

steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      toggleStep("flex", -1);
    });
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < 5 && validateForm()) {
      toggleStep("flex", 1);
      setTotal();
    }
  });
});

function toggleStep(display, stepChange) {
  document.querySelector(`.step-${currentStep}`).style.display = "none";
  currentStep += stepChange;
  currentCircle += stepChange;
  document.querySelector(`.step-${currentStep}`).style.display = display;
  circleSteps[currentCircle].classList.toggle("active", stepChange === 1);
  summary(obj);
}

function summary(obj) {
  const planName = document.querySelector(".plan-name");
  planPrice.textContent = `${obj.price.textContent}`;
  planName.textContent = `${obj.plan.textContent} (${
    obj.kind ? "yearly" : "monthly"
  })`;
}

function validateForm() {
  let valid = true;
  for (const input of formInputs) {
    if (!input.value) {
      valid = false;
      input.classList.add("err");
      input.labels[0].nextElementSibling.style.display = "flex";
    } else {
      input.classList.remove("err");
      input.labels[0].nextElementSibling.style.display = "none";
    }
  }
  return valid;
}

plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected")?.classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".plan-priced");
    obj.plan = planName;
    obj.price = planPrice;
  });
});

switcher.addEventListener("click", () => {
  const val = switcher.querySelector("input").checked;
  document.querySelector(".monthly").classList.toggle("sw-active", !val);
  document.querySelector(".yearly").classList.toggle("sw-active", val);
  switchPrice(val);
  obj.kind = val;
});

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.dataset.id;
    addonSelect.checked = !addonSelect.checked;
    addon.classList.toggle("ad-selected", addonSelect.checked);
    showAddon(ID, addonSelect.checked);
    e.preventDefault();
  });
});

function switchPrice(checked) {
  const prices = document.querySelectorAll(".plan-priced");
  const priceArray = checked ? [90, 120, 150] : [9, 12, 15];

  for (let i = 0; i < prices.length; i++) {
    prices[i].innerHTML = `$${priceArray[i]}/${checked ? "yr" : "mo"}`;
  }

  setTime(checked);
}

function showAddon(ad, val) {
  const addonsContainer = document.querySelector(".addons");

  if (val) {
    const serviceName = document.createElement("div");
    const servicePrice = document.createElement("div");
    const serviceID = document.createElement("div");

    serviceName.classList.add("service-name");
    servicePrice.classList.add("servic-price");
    serviceID.classList.add("selected-addon");

    serviceName.textContent = ad;
    servicePrice.textContent = document.querySelector(
      `[data-id="${ad}"] .price`
    ).textContent;
    serviceID.setAttribute("data-id", ad);

    addonsContainer.appendChild(serviceName);
    addonsContainer.appendChild(servicePrice);
    addonsContainer.appendChild(serviceID);
  } else {
    const addons = document.querySelectorAll(
      `.selected-addon[data-id="${ad}"]`
    );
    addons.forEach((addon) => addon.remove());
  }
}

function setTotal() {
  const planPriceText = planPrice.textContent;
  const planPriceValue = Number(planPriceText.replace(/\D/g, ""));
  const addonPrices = document.querySelectorAll(
    ".selected-addon .servic-price"
  );

  let val = 0;

  for (const addonPrice of addonPrices) {
    const addonPriceText = addonPrice.textContent;
    const addonPriceValue = Number(addonPriceText.replace(/\D/g, ""));
    val += addonPriceValue;
  }

  const totalText = `$${val + planPriceValue}/${time ? "yr" : "mo"}`;
  total.textContent = totalText;
}

function setTime(t) {
  time = t;
}
