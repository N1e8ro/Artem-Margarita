// ===================== НАСТРОЙКИ GOOGLE ФОРМЫ =====================
var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScFII1N40AiFMUT9d74UJ6y8xB32XOckMBdR_iRVsPaSC9FQA/formResponse';
var FORM_ENTRIES = {
    firstName:   'entry.304578524',   // Имя
    lastName:    'entry.1743062081',  // Фамилия
    phone:       'entry.1808915097',  // Телефон
    guestsCount: 'entry.1990473099',  // Количество гостей
    guestsNames: 'entry.1154442462',  // Имена гостей
    drinks:      'entry.137658426'    // Напитки
};

// ===================== PRELOADER =====================
window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 600);
    }
});

// ===================== COLLAGE → MAIN CONTENT =====================
(function() {
    var openBtn = document.getElementById('openInvitationBtn');
    if (!openBtn) return;

    openBtn.addEventListener('click', function() {
        var collagePage = document.getElementById('collage-page');
        var mainContent = document.getElementById('main-content');

        if (!collagePage || !mainContent) return;

        collagePage.classList.add('hidden-page');

        setTimeout(function() {
            collagePage.style.display = 'none';
            mainContent.style.display = 'block';

            updateTimer();
            initRevealAnimations();
        }, 600);
    });
})();

// ===================== COUNTDOWN TIMER =====================
var weddingDate = new Date("2026-08-08T15:00:00").getTime();

function updateTimer() {
    var now = new Date().getTime();
    var distance = weddingDate - now;

    var timerEl = document.getElementById("timer");
    if (!timerEl) return;

    if (distance < 0) {
        timerEl.innerHTML = "<h3 style='color:#D4AF37;'>Свадьба состоялась! 💍</h3>";
        return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setText('days', days);
    setText('hours', hours);
    setText('minutes', minutes);
    setText('seconds', seconds);
}

function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.innerText = String(value).padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

// ===================== REVEAL ON SCROLL =====================
var revealObserver;

function initRevealAnimations() {
    var revealElements = document.querySelectorAll('.section.reveal');

    revealObserver = new IntersectionObserver(function(entries) {
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
}

initRevealAnimations();

// ===================== RSVP FORM → GOOGLE FORMS =====================
(function() {
    var form = document.getElementById('rsvp-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var btn = form.querySelector('.submit-btn');
        var originalHTML = btn.innerHTML;

        btn.innerHTML = '⏳ Отправка...';
        btn.style.background = '#64748B';
        btn.style.color = '#fff';
        btn.disabled = true;

        var inputs = form.querySelectorAll('input[type="text"]');
        var firstName = inputs[0] ? inputs[0].value.trim() : '';
        var lastName = inputs[1] ? inputs[1].value.trim() : '';
        var phone = form.querySelector('input[type="tel"]') ? form.querySelector('input[type="tel"]').value.trim() : '';
        var guestsCount = form.querySelector('input[type="number"]') ? form.querySelector('input[type="number"]').value.trim() : '0';
        var guestsNames = form.querySelector('textarea') ? form.querySelector('textarea').value.trim() : '';

        var checkboxes = form.querySelectorAll('input[name="drinks"]:checked');
        var drinks = [];
        checkboxes.forEach(function(cb) {
            drinks.push(cb.value);
        });

        var formData = new FormData();
        formData.append(FORM_ENTRIES.firstName, firstName);
        formData.append(FORM_ENTRIES.lastName, lastName);
        formData.append(FORM_ENTRIES.phone, phone);
        formData.append(FORM_ENTRIES.guestsCount, guestsCount || '0');
        formData.append(FORM_ENTRIES.guestsNames, guestsNames);

        drinks.forEach(function(drink) {
            formData.append(FORM_ENTRIES.drinks, drink);
        });

        if (drinks.length === 0) {
            formData.append(FORM_ENTRIES.drinks, '');
        }

        sendToGoogleForms(formData, btn, originalHTML);
    });

    function sendToGoogleForms(formData, btn, originalHTML) {
        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(function() {
            console.log('✅ Данные отправлены в Google Forms');
            
            btn.innerHTML = '✅ Отправлено!';
            btn.style.background = '#22C55E';
            btn.style.color = '#fff';

            showToast('Спасибо! Ваш ответ записан ❤️<br>Мы свяжемся с вами для подтверждения');

            form.reset();

            setTimeout(function() {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        })
        .catch(function(error) {
            console.error('Ошибка:', error);
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', GOOGLE_FORM_URL, true);
            
            xhr.onload = function() {
                btn.innerHTML = '✅ Отправлено!';
                btn.style.background = '#22C55E';
                btn.style.color = '#fff';
                showToast('Спасибо! Ваш ответ записан ❤️');
                form.reset();
                
                setTimeout(function() {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            };
            
            xhr.onerror = function() {
                btn.innerHTML = '❌ Ошибка';
                btn.style.background = '#EF4444';
                btn.style.color = '#fff';
                showToast('Ошибка соединения. Попробуйте позже.');
                
                setTimeout(function() {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            };
            
            xhr.send(formData);
        });
    }
})();

// ===================== TOAST =====================
function showToast(message) {
    var oldToast = document.querySelector('.custom-toast');
    if (oldToast) oldToast.remove();

    var toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = message;
    toast.style.animation = 'toastIn 0.4s ease, toastOut 0.4s ease 2.6s forwards';

    document.body.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode) toast.remove();
    }, 3200);
}

if (!document.getElementById('toast-animations')) {
    var styleEl = document.createElement('style');
    styleEl.id = 'toast-animations';
    styleEl.textContent = '\
        @keyframes toastIn {\
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }\
            to { opacity: 1; transform: translateX(-50%) translateY(0); }\
        }\
        @keyframes toastOut {\
            from { opacity: 1; transform: translateX(-50%) translateY(0); }\
            to { opacity: 0; transform: translateX(-50%) translateY(20px); }\
        }\
    ';
    document.head.appendChild(styleEl);
}

// ===================== ГОРИЗОНТАЛЬНЫЕ ГАЛЕРЕИ =====================
function initHorizontalGallery(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var wrapper = container.closest('.scroll-wrapper');
    var leftArrow = wrapper ? wrapper.querySelector('.scroll-arrow-left') : null;
    var rightArrow = wrapper ? wrapper.querySelector('.scroll-arrow-right') : null;
    var indicator = wrapper ? wrapper.querySelector('.scroll-indicator-bar') : null;

    var scrollAmount = 280;
    var animationId = null;
    var velocity = 0;
    var isDragging = false;
    var startX = 0;
    var startY = 0;
    var lastX = 0;
    var lastTime = 0;
    var isSwiping = false;
    var dragStartScrollLeft = 0;

    function applyInertia() {
        if (Math.abs(velocity) < 0.5) {
            velocity = 0;
            cancelAnimationFrame(animationId);
            animationId = null;
            updateArrows();
            return;
        }

        container.scrollLeft -= velocity;
        velocity *= 0.92;

        if (container.scrollLeft <= 0) {
            container.scrollLeft = 0;
            velocity = 0;
        }
        var maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = maxScroll;
            velocity = 0;
        }

        updateArrows();
        animationId = requestAnimationFrame(applyInertia);
    }

    function stopInertia() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        velocity = 0;
    }

    container.addEventListener('mousedown', function(e) {
        stopInertia();
        isDragging = true;
        startX = e.pageX;
        startY = e.pageY;
        lastX = e.pageX;
        lastTime = Date.now();
        dragStartScrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
        container.style.scrollBehavior = 'auto';
        e.preventDefault();
    });

    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.pageX - startX;
        var dy = e.pageY - startY;
        if (!isSwiping && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            isSwiping = Math.abs(dx) > Math.abs(dy);
        }
        if (isSwiping) {
            e.preventDefault();
            var currentTime = Date.now();
            var timeDelta = currentTime - lastTime;
            if (timeDelta > 0) {
                velocity = ((e.pageX - lastX) / timeDelta) * 15;
            }
            container.scrollLeft = dragStartScrollLeft - dx;
            lastX = e.pageX;
            lastTime = currentTime;
            updateArrows();
        }
    });

    window.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.scrollBehavior = 'smooth';
        if (isSwiping) {
            applyInertia();
        }
        isSwiping = false;
    });

    container.addEventListener('touchstart', function(e) {
        stopInertia();
        isDragging = true;
        var touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = touch.clientX;
        lastTime = Date.now();
        dragStartScrollLeft = container.scrollLeft;
        isSwiping = false;
        container.style.scrollBehavior = 'auto';
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        var touch = e.touches[0];
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        if (!isSwiping && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            isSwiping = Math.abs(dx) > Math.abs(dy);
        }
        if (isSwiping) {
            if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
            var currentTime = Date.now();
            var timeDelta = currentTime - lastTime;
            if (timeDelta > 0) {
                velocity = ((touch.clientX - lastX) / timeDelta) * 15;
            }
            container.scrollLeft = dragStartScrollLeft - dx;
            lastX = touch.clientX;
            lastTime = currentTime;
            updateArrows();
        }
    }, { passive: false });

    container.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        if (isSwiping) applyInertia();
        isSwiping = false;
        container.style.scrollBehavior = 'smooth';
    }, { passive: true });

    container.addEventListener('touchcancel', function() {
        if (isDragging) {
            isDragging = false;
            if (isSwiping) applyInertia();
            isSwiping = false;
            container.style.scrollBehavior = 'smooth';
        }
    });

    function smoothScrollBy(distance) {
        stopInertia();
        var startScroll = container.scrollLeft;
        var targetScroll = startScroll + distance;
        var startTime = performance.now();
        var duration = 400;
        var maxScroll = container.scrollWidth - container.clientWidth;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        function animateScroll(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            container.scrollLeft = startScroll + (targetScroll - startScroll) * ease;
            updateArrows();
            if (progress < 1) requestAnimationFrame(animateScroll);
        }
        requestAnimationFrame(animateScroll);
    }

    if (leftArrow) leftArrow.addEventListener('click', function() { smoothScrollBy(-scrollAmount); });
    if (rightArrow) rightArrow.addEventListener('click', function() { smoothScrollBy(scrollAmount); });

    if (indicator) {
        indicator.style.display = 'block';
        indicator.style.transition = 'opacity 0.5s ease';
        var hideTimeout;
        container.addEventListener('scroll', function() {
            if (container.scrollLeft > 20) {
                indicator.style.opacity = '0';
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(function() { indicator.style.display = 'none'; }, 500);
            }
        });
        container.addEventListener('touchstart', function() {
            indicator.style.display = 'block';
            indicator.style.opacity = '1';
            clearTimeout(hideTimeout);
        });
    }

    function updateArrows() {
        if (leftArrow) {
            leftArrow.style.opacity = container.scrollLeft <= 0 ? '0.3' : '1';
            leftArrow.style.pointerEvents = container.scrollLeft <= 0 ? 'none' : 'auto';
        }
        if (rightArrow) {
            var maxScroll = container.scrollWidth - container.clientWidth;
            rightArrow.style.opacity = container.scrollLeft >= maxScroll - 5 ? '0.3' : '1';
            rightArrow.style.pointerEvents = container.scrollLeft >= maxScroll - 5 ? 'none' : 'auto';
        }
    }

    container.style.webkitOverflowScrolling = 'touch';
    container.style.overflowX = 'auto';
    container.style.overflowY = 'hidden';
    container.style.scrollBehavior = 'smooth';
    container.style.cursor = 'grab';
    container.style.willChange = 'scroll-position';

    if (window.innerWidth <= 768) {
        container.style.scrollbarWidth = 'none';
        container.style.msOverflowStyle = 'none';
    }

    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 100);

    container.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            container.scrollLeft += e.deltaX;
        }
    }, { passive: false });
}

document.addEventListener('DOMContentLoaded', function() {
    initHorizontalGallery('scroll-container-1');
    initHorizontalGallery('scroll-container-2');
});

setTimeout(function() {
    if (!window.galleriesInitialized) {
        initHorizontalGallery('scroll-container-1');
        initHorizontalGallery('scroll-container-2');
        window.galleriesInitialized = true;
    }
}, 1000);
