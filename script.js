// ===== PRELOADER =====
window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    setTimeout(function() {
        preloader.style.display = 'none';
    }, 600);
});

// ===== COLLAGE TO MAIN CONTENT =====
document.getElementById('openInvitationBtn').addEventListener('click', function() {
    var collagePage = document.getElementById('collage-page');
    var mainContent = document.getElementById('main-content');
    
    collagePage.classList.add('hidden-page');
    
    setTimeout(function() {
        collagePage.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Перезапускаем таймер и анимации
        updateTimer();
        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    }, 600);
});

// ===== TIMER =====
var weddingDate = new Date("2026-08-08T15:00:00").getTime();

function updateTimer() {
    var now = new Date().getTime();
    var distance = weddingDate - now;

    if (distance < 0) {
        var timerEl = document.getElementById("timer");
        if (timerEl) {
            timerEl.innerHTML = "<h3 style='color:#D4AF37;'>Свадьба состоялась! 💍</h3>";
        }
        return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var daysEl = document.getElementById("days");
    var hoursEl = document.getElementById("hours");
    var minutesEl = document.getElementById("minutes");
    var secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

// ===== REVEAL ON SCROLL =====
var revealElements = document.querySelectorAll('.section.reveal');

var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(function(el) {
    revealObserver.observe(el);
});

// ===== RSVP FORM =====
var form = document.getElementById('rsvp-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var checkboxes = document.querySelectorAll('input[name="drinks"]:checked');
        var drinks = [];
        for (var i = 0; i < checkboxes.length; i++) {
            drinks.push(checkboxes[i].value);
        }
        var drinksString = drinks.join(', ');

        var btn = form.querySelector('.submit-btn');
        var originalText = btn.innerHTML;
        btn.innerHTML = '✅ Отправлено!';
        btn.style.background = '#D4AF37';
        btn.style.color = '#0F172A';

        alert('Спасибо за подтверждение!\nВаши напитки: ' + (drinksString || 'Не выбраны'));

        setTimeout(function() {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    });
}

// ===== HORIZONTAL SCROLL WITH ARROWS =====
function initHorizontalGallery(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var wrapper = container.closest('.scroll-wrapper');
    var leftArrow = wrapper ? wrapper.querySelector('.scroll-arrow-left') : null;
    var rightArrow = wrapper ? wrapper.querySelector('.scroll-arrow-right') : null;
    var indicator = wrapper ? wrapper.querySelector('.scroll-indicator-bar') : null;

    var scrollAmount = 280;

    if (leftArrow) leftArrow.addEventListener('click', function() {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    if (rightArrow) rightArrow.addEventListener('click', function() {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    if (indicator) {
        indicator.style.display = 'block';
        container.addEventListener('scroll', function() {
            if (container.scrollLeft > 20) {
                indicator.style.opacity = '0';
                setTimeout(function() {
                    indicator.style.display = 'none';
                }, 500);
            }
        });
    }

    function updateArrows() {
        if (leftArrow) {
            if (container.scrollLeft <= 0) {
                leftArrow.style.opacity = '0.3';
                leftArrow.style.pointerEvents = 'none';
            } else {
                leftArrow.style.opacity = '1';
                leftArrow.style.pointerEvents = 'auto';
            }
        }

        if (rightArrow) {
            var maxScroll = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft >= maxScroll - 5) {
                rightArrow.style.opacity = '0.3';
                rightArrow.style.pointerEvents = 'none';
            } else {
                rightArrow.style.opacity = '1';
                rightArrow.style.pointerEvents = 'auto';
            }
        }
    }

    container.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 100);

    // Свайп
    var startX = 0;
    var startY = 0;
    var isDragging = false;
    var isSwiping = false;

    container.addEventListener('touchstart', function(e) {
        var touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = true;
        isSwiping = false;
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        var touch = e.touches[0];
        var deltaX = touch.clientX - startX;
        var deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            isSwiping = true;
            e.preventDefault();
        }
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;

        if (isSwiping) {
            var touch = e.changedTouches[0];
            var deltaX = touch.clientX - startX;

            if (Math.abs(deltaX) > 50) {
                if (deltaX < 0) {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            }
            isSwiping = false;
        }
    }, { passive: true });
}

initHorizontalGallery('scroll-container-1');
initHorizontalGallery('scroll-container-2');