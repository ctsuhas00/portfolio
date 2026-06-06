// ================================
// CT SUHAS PORTFOLIO SCRIPT
// ================================

document.addEventListener("DOMContentLoaded", function () {

    // Fade-in animation for sections

    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.1
        }

    );

    sections.forEach((section) => {

        section.classList.add("hidden");

        observer.observe(section);

    });

});

// =================================
// EDUCATION / INTERNSHIP / PROJECTS
// =================================

function toggleSection(id) {

    const section = document.getElementById(id);

    if (!section) return;

    if (
        section.style.display === "block"
    ) {

        section.style.display = "none";

    } else {

        section.style.display = "block";

    }

}

console.log("CT Suhas Portfolio Loaded Successfully");