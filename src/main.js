document.addEventListener('DOMContentLoaded', () => {
    // 1. Ініціалізація іконок
    lucide.createIcons();

    // 2. Логіка мобільного меню
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const body = document.querySelector('body');
    const navLinks = document.querySelectorAll('.header__link');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isOpened = nav.classList.contains('active');
            body.style.overflow = isOpened ? 'hidden' : ''; // Блокуємо скрол
        });

        // Закриваємо меню при кліку на посилання
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // 3. Анімація Hero (Anime.js)
    const heroTimeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    heroTimeline
    .add({
        targets: '.hero__badge',
        translateY: [-20, 0],
        opacity: [0, 1],
        delay: 200
    })
    .add({
        targets: '.hero__title',
        translateY: [30, 0],
        opacity: [0, 1],
    }, '-=600')
    .add({
        targets: '.hero__desc',
        translateY: [20, 0],
        opacity: [0, 1],
    }, '-=600')
    .add({
        targets: '.hero__btns .btn',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
    }, '-=800')
    .add({
        targets: '.hero__bg-grid',
        opacity: [0, 0.3],
        scale: [1.1, 1],
        duration: 2000
    }, '-=1000');


    // 4. Анімація появи секцій при скролі
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target.querySelectorAll('.section__title, .section__subtitle, .trend-card, .solution-card, .blog-post, .contact__info, .form, .faq__item'),
                    translateY: [50, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(100),
                    easing: 'easeOutQuad',
                    duration: 800
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 5. Логіка форми та Валідація Телефону
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone'); // Знаходимо інпут телефону
    const captchaQuestion = document.getElementById('captchaQuestion');
    const captchaAnswer = document.getElementById('captchaAnswer');
    const formMessage = document.getElementById('formMessage');

    // --- ВАЛІДАЦІЯ ТЕЛЕФОНУ (ТІЛЬКИ ЦИФРИ) ---
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Замінюємо все, що не є цифрою (0-9), на пустий рядок
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Генерація капчі
    let num1, num2, correctAnswer;
    function generateCaptcha() {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = num1 + num2;
        if(captchaQuestion) {
            captchaQuestion.textContent = `${num1} + ${num2}`;
        }
        if(captchaAnswer) {
            captchaAnswer.value = '';
        }
    }
    
    if (form) {
        generateCaptcha(); // Ініціалізація при завантаженні

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            formMessage.textContent = '';
            formMessage.className = 'form__message';

            // Перевірка капчі
            if (parseInt(captchaAnswer.value) !== correctAnswer) {
                formMessage.textContent = 'Ошибка капчи. Попробуйте еще раз.';
                formMessage.classList.add('error');
                generateCaptcha();
                return;
            }

            // Імітація відправки
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                formMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
                formMessage.classList.add('success');
                form.reset();
                generateCaptcha();
            }, 2000);
        });
    }

    // 6. Cookie Popup
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('show');
        });
    }

    // 7. FAQ Акордеон
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закриваємо інші (опціонально)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq__answer').style.maxHeight = null;
                }
            });

            // Перемикаємо поточний
            item.classList.toggle('active');
            
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    console.log('Myth-Tica scripts loaded. Технология нового поколения активирована.');
});