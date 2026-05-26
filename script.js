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
            
            // Переинициализируем галереи после показа
            initHorizontalGallery('scroll-container-1');
            initHorizontalGallery('scroll-container-2');
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

    if (revealObserver) {
        revealObserver.disconnect();
    }

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
            console.error('Ошибка fetch:', error);
            
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

// ===================== TOAST УВЕДОМЛЕНИЕ =====================
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

// Добавляем CSS-анимации для toast
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

// ===================== ГОРИЗОНТАЛЬНЫЕ ГАЛЕРЕИ С СУПЕР-ПЛАВНЫМ СКРОЛЛОМ =====================
function initHorizontalGallery(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    // Предотвращаем повторную инициализацию
    if (container.dataset.galleryInitialized === 'true') return;
    container.dataset.galleryInitialized = 'true';

    var wrapper = container.closest('.scroll-wrapper');
    var leftArrow = wrapper ? wrapper.querySelector('.scroll-arrow-left') : null;
    var rightArrow = wrapper ? wrapper.querySelector('.scroll-arrow-right') : null;
    var indicator = wrapper ? wrapper.querySelector('.scroll-indicator-bar') : null;

    var scrollAmount = 280;

    // ===== ПЕРЕМЕННЫЕ ДЛЯ ИНЕРЦИИ =====
    var amplitude = 0;
    var targetScroll = 0;
    var isDragging = false;
    var startX = 0;
    var startY = 0;
    var lastX = 0;
    var lastTime = 0;
    var isSwiping = false;
    var dragStartScrollLeft = 0;
    var animationId = null;
    var velocity = 0;

    // ===== ФУНКЦИЯ ИНЕРЦИОННОЙ АНИМАЦИИ =====
    function autoScroll() {
        var elapsed, delta;

        if (amplitude) {
            elapsed = Date.now() - lastTime;
            delta = -amplitude * Math.exp(-elapsed / 325);

            if (delta > 0.5 || delta < -0.5) {
                container.scrollLeft = targetScroll + delta;
                animationId = requestAnimationFrame(autoScroll);
            } else {
                container.scrollLeft = targetScroll;
                amplitude = 0;
                animationId = null;
                updateArrows();
            }
        } else {
            animationId = null;
        }
    }

    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        amplitude = 0;
        velocity = 0;
    }

    // ===== СОБЫТИЯ МЫШИ (десктоп) =====
    container.addEventListener('mousedown', function(e) {
        stopAnimation();
        isDragging = true;
        isSwiping = false;
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
        var currentTime = Date.now();
        var timeDelta = Math.max(currentTime - lastTime, 1);

        if (!isSwiping && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
            isSwiping = Math.abs(dx) > Math.abs(dy);
        }

        if (isSwiping) {
            e.preventDefault();

            velocity = (e.pageX - lastX) / timeDelta;
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
            targetScroll = container.scrollLeft;
            amplitude = velocity * 250;

            var maxAmplitude = 800;
            if (amplitude > maxAmplitude) amplitude = maxAmplitude;
            if (amplitude < -maxAmplitude) amplitude = -maxAmplitude;

            lastTime = Date.now();
            autoScroll();
        }

        isSwiping = false;
        velocity = 0;
    });

    // ===== СОБЫТИЯ КАСАНИЯ (мобильные) =====
    container.addEventListener('touchstart', function(e) {
        stopAnimation();

        var touch = e.touches[0];
        isDragging = true;
        isSwiping = false;
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = touch.clientX;
        lastTime = Date.now();
        dragStartScrollLeft = container.scrollLeft;
        container.style.scrollBehavior = 'auto';
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!isDragging) return;

        var touch = e.touches[0];
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        var currentTime = Date.now();
        var timeDelta = Math.max(currentTime - lastTime, 1);

        if (!isSwiping && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
            isSwiping = Math.abs(dx) > Math.abs(dy);
        }

        if (isSwiping) {
            if (Math.abs(dx) > Math.abs(dy)) {
                e.preventDefault();
            }

            velocity = (touch.clientX - lastX) / timeDelta;
            container.scrollLeft = dragStartScrollLeft - dx;

            lastX = touch.clientX;
            lastTime = currentTime;
            updateArrows();
        }
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
        if (!isDragging) return;

        var touch = e.changedTouches[0];
        var dx = touch.clientX - startX;

        isDragging = false;

        if (isSwiping && Math.abs(dx) > 3) {
            var finalVelocity = (touch.clientX - lastX) / Math.max(Date.now() - lastTime, 1);

            targetScroll = container.scrollLeft;
            amplitude = finalVelocity * 200;

            var maxAmplitude = 600;
            if (amplitude > maxAmplitude) amplitude = maxAmplitude;
            if (amplitude < -maxAmplitude) amplitude = -maxAmplitude;

            lastTime = Date.now();
            autoScroll();
        }

        isSwiping = false;
        velocity = 0;
        container.style.scrollBehavior = 'smooth';

        checkBounds();
    }, { passive: true });

    container.addEventListener('touchcancel', function() {
        if (isDragging) {
            isDragging = false;
            isSwiping = false;
            velocity = 0;
            container.style.scrollBehavior = 'smooth';
            checkBounds();
        }
    });

    // ===== ПРОВЕРКА ГРАНИЦ =====
    function checkBounds() {
        var maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft < 0) {
            smoothScrollTo(0);
        } else if (container.scrollLeft > maxScroll) {
            smoothScrollTo(maxScroll);
        }
    }

    function smoothScrollTo(target) {
        var startScroll = container.scrollLeft;
        var distance = target - startScroll;
        var startTime = performance.now();
        var duration = 300;

        function animate(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 4);

            container.scrollLeft = startScroll + distance * ease;
            updateArrows();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    // ===== СТРЕЛКИ =====
    function smoothScrollBy(distance) {
        stopAnimation();

        var startScroll = container.scrollLeft;
        var target = startScroll + distance;
        var maxScroll = container.scrollWidth - container.clientWidth;
        target = Math.max(0, Math.min(target, maxScroll));

        var startTime = performance.now();
        var duration = 500;

        function animate(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            container.scrollLeft = startScroll + (target - startScroll) * ease;
            updateArrows();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    if (leftArrow) {
        leftArrow.addEventListener('click', function() {
            smoothScrollBy(-scrollAmount);
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', function() {
            smoothScrollBy(scrollAmount);
        });
    }

    // ===== ИНДИКАТОР =====
    if (indicator) {
        indicator.style.display = 'block';
        indicator.style.transition = 'opacity 0.5s ease';

        var hideIndicatorTimeout;
        var indicatorVisible = true;

        function showIndicator() {
            if (!indicatorVisible) {
                indicator.style.display = 'block';
                indicator.style.opacity = '1';
                indicatorVisible = true;
            }
            clearTimeout(hideIndicatorTimeout);
        }

        function hideIndicator() {
            indicator.style.opacity = '0';
            indicatorVisible = false;
            hideIndicatorTimeout = setTimeout(function() {
                indicator.style.display = 'none';
            }, 500);
        }

        container.addEventListener('scroll', function() {
            if (container.scrollLeft > 30) {
                hideIndicator();
            }
        });

        container.addEventListener('touchstart', showIndicator);
        container.addEventListener('mousedown', showIndicator);
    }

    // ===== ОБНОВЛЕНИЕ СТРЕЛОК =====
    function updateArrows() {
        if (leftArrow) {
            var atStart = container.scrollLeft <= 1;
            leftArrow.style.opacity = atStart ? '0.3' : '1';
            leftArrow.style.pointerEvents = atStart ? 'none' : 'auto';
            leftArrow.style.transition = 'opacity 0.3s ease';
        }
        if (rightArrow) {
            var maxScroll = container.scrollWidth - container.clientWidth;
            var atEnd = container.scrollLeft >= maxScroll - 1;
            rightArrow.style.opacity = atEnd ? '0.3' : '1';
            rightArrow.style.pointerEvents = atEnd ? 'none' : 'auto';
            rightArrow.style.transition = 'opacity 0.3s ease';
        }
    }

    // ===== GPU-УСКОРЕНИЕ =====
    container.style.webkitOverflowScrolling = 'touch';
    container.style.overflowX = 'auto';
    container.style.overflowY = 'hidden';
    container.style.scrollBehavior = 'smooth';
    container.style.cursor = 'grab';
    container.style.willChange = 'scroll-position';
    container.style.transform = 'translateZ(0)';
    container.style.backfaceVisibility = 'hidden';
    container.style.perspective = '1000px';

    if (window.innerWidth <= 768) {
        container.style.scrollbarWidth = 'none';
        container.style.msOverflowStyle = 'none';
    }

    // ===== КОЛЁСИКО МЫШИ =====
    container.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            smoothScrollBy(e.deltaX * 1.5);
        }
    }, { passive: false });

    // ===== КЛАВИАТУРА =====
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            smoothScrollBy(-scrollAmount);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            smoothScrollBy(scrollAmount);
        }
    });

    // ===== АДАПТИВНОСТЬ =====
    window.addEventListener('resize', function() {
        updateArrows();
        checkBounds();
    });

    setTimeout(function() {
        updateArrows();
    }, 100);
}

// ===== ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕЙ =====
document.addEventListener('DOMContentLoaded', function() {
    initHorizontalGallery('scroll-container-1');
    initHorizontalGallery('scroll-container-2');
});

// Резервная инициализация
setTimeout(function() {
    if (!window.galleriesInitialized) {
        initHorizontalGallery('scroll-container-1');
        initHorizontalGallery('scroll-container-2');
        window.galleriesInitialized = true;
    }
}, 1000);
