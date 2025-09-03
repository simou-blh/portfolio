// ===== Smooth Scrolling =====
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Scroll Animations =====
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 100) {
      el.classList.add('active');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);

// ===== Typing Effect =====

document.addEventListener('DOMContentLoaded', () => {
  const elHi = document.getElementById('typing-hi');
  const elName = document.getElementById('typing-name');

  const textHi = "Hi, I am";
  const textName = "AHMED OUASSIM BOULOUH";

  let i = 0, j = 0;

  function typeHi() {
    if (i < textHi.length) {
      elHi.textContent += textHi.charAt(i);
      i++;
      setTimeout(typeHi, 80);
    } else {
      // after finishing first line, wait then start typing the name
      setTimeout(typeName, 500);
    }
  }

  function typeName() {
    if (j < textName.length) {
      elName.textContent += textName.charAt(j);
      j++;
      setTimeout(typeName, 100);
    }
  }

  typeHi();
});



// ===== Contact Form =====
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch("http://127.0.0.1:8000/send-mail/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name, email, message }),
      });

      const text = await response.text();
console.log("Raw response:", text);
const result = JSON.parse(text);

      console.log(result);

      alert(result.success ? "✅ Message sent!" : "❌ " + result.error);

      if (result.success) {
        form.reset();
      }
    } catch (error) {
      alert("✅ Message sent! " );
    }
  });
});
