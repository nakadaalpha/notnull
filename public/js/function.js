AOS.init();

function filterByBrand(brandId) {
    window.location.href = "<?= base_url('warehouse') ?>?brand_id=" + brandId;
}

// document.addEventListener("DOMContentLoaded", () => {
//     const slider = document.getElementById("brandSlider");
//     const items = slider.children;

//     // Clone items to create seamless looping
//     Array.from(items).forEach((item) => {
//         const clone = item.cloneNode(true);
//         slider.appendChild(clone);
//     });

//     // Re-trigger animation to create seamless effect
//     slider.addEventListener("animationiteration", () => {
//         slider.style.animation = "none";
//         void slider.offsetWidth; // Trigger reflow
//         slider.style.animation = "scroll-left 1s linear infinite";
//     });
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const slider = document.getElementById("brandSlider");
//     // let isScrolling = false;

//     // // Stop auto-scroll when user interacts
//     // slider.addEventListener("scroll", () => {
//     //     if (!isScrolling) {
//     //         stopAutoScroll();
//     //         isScrolling = true;
//     //         setTimeout(() => {
//     //             isScrolling = false;
//     //             startAutoScroll();
//     //         }, 5000); // Resume auto-scroll after 3 seconds of inactivity
//     //     }
//     // });

//     // Clone items for seamless looping
//     const items = slider.children;
//     Array.from(items).forEach(item => {
//         const clone = item.cloneNode(true);
//         slider.appendChild(clone);
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('brandSlider');
    let sliderItems = slider.innerHTML;

    // Duplikasi konten untuk looping
    slider.innerHTML += sliderItems;
});