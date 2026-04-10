// ==========================================
// HARDTECH PREMIUM JAVASCRIPT - VERSÃO SEO & CLIENTES
// Sistema completo de interações e animações
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // CONFIGURAÇÕES GLOBAIS
    // ==========================================
    
    const CONFIG = {
        loadingDuration: 2000,
        animationDelay: 100,
        scrollOffset: 80,
        particleCount: 50,
        statsAnimationDuration: 2000,
        formSubmissionDelay: 1500,
        whatsappMessage: "Olá! Quero saber como a HardTech pode ajudar minha empresa a aparecer no Google e atrair mais clientes.",
        whatsappNumber: "5511999999999"
    };

    // ==========================================
    // UTILITÁRIOS
    // ==========================================
    
    const Utils = {
        // Throttle para performance
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Debounce para inputs
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        // Animação de números
        animateNumber: function(element, start, end, duration) {
            const startTime = performance.now();
            const range = end - start;
            
            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (range * easeOutQuart));
                
                element.textContent = current.toLocaleString('pt-BR');
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            
            requestAnimationFrame(updateNumber);
        },

        // Intersection Observer para animações
        createObserver: function(callback, options = {}) {
            const defaultOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };
            
            return new IntersectionObserver(callback, { ...defaultOptions, ...options });
        },

        // Validação de email
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Validação de telefone brasileiro
        isValidPhone: function(phone) {
            const phoneRegex = /^(\+55\s?)?(\(?[1-9]{2}\)?)\s?9?\d{4}-?\d{4}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        },

        // Formatação de telefone
        formatPhone: function(phone) {
            const numbers = phone.replace(/\D/g, '');
            if (numbers.length === 11) {
                return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (numbers.length === 10) {
                return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            return phone;
        }
    };

    // ==========================================
    // LOADING SCREEN PREMIUM
    // ==========================================
    
    class LoadingScreen {
        constructor() {
            this.loadingScreen = document.getElementById('loadingScreen');
            this.progressBar = this.loadingScreen?.querySelector('.loading-progress');
            this.progress = 0;
            this.init();
        }

        init() {
            if (!this.loadingScreen) return;
            
            this.startProgress();
            
            // Garantir que o loading termine mesmo se a página carregar rapidamente
            setTimeout(() => {
                this.complete();
            }, CONFIG.loadingDuration);
            
            // Completar quando a página estiver totalmente carregada
            if (document.readyState === 'complete') {
                setTimeout(() => this.complete(), 500);
            } else {
                window.addEventListener('load', () => {
                    setTimeout(() => this.complete(), 800);
                });
            }
        }

        startProgress() {
            const interval = setInterval(() => {
                this.progress += Math.random() * 15;
                if (this.progress >= 90) {
                    this.progress = 90;
                    clearInterval(interval);
                }
                this.updateProgress();
            }, 100);
        }

        updateProgress() {
            if (this.progressBar) {
                this.progressBar.style.width = `${this.progress}%`;
            }
        }

        complete() {
            this.progress = 100;
            this.updateProgress();
            
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                this.initPageAnimations();
            }, 500);
        }

        initPageAnimations() {
            // Iniciar animações da página após o loading
            document.body.style.overflow = '';
            
            // Animar elementos iniciais
            const heroElements = document.querySelectorAll('.hero-premium .hero-text-premium > *');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'all 0.8s ease';
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 50);
                }, index * CONFIG.animationDelay);
            });

            // Iniciar partículas
            if (window.ParticlesSystem) {
                window.ParticlesSystem.init();
            }

            // Iniciar animações de charts
            setTimeout(() => {
                this.animateChartBars();
            }, 1500);
        }

        animateChartBars() {
            const chartBars = document.querySelectorAll('.chart-bar');
            chartBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1)';
                }, index * 200);
            });
        }
    }

    // ==========================================
    // HEADER E NAVEGAÇÃO
    // ==========================================
    
    class NavigationSystem {
        constructor() {
            this.header = document.getElementById('header');
            this.mobileToggle = document.getElementById('mobileToggle');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.mobileClose = document.getElementById('mobileClose');
            this.navLinks = document.querySelectorAll('.nav-link-premium, .mobile-nav-link');
            this.currentSection = 'inicio';
            
            this.init();
        }

        init() {
            this.bindEvents();
            this.handleScroll();
            this.updateActiveLink();
        }

        bindEvents() {
            // Scroll do header
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
                this.updateActiveSection();
            }, 16));

            // Mobile menu toggle
            this.mobileToggle?.addEventListener('click', () => this.openMobileMenu());
            this.mobileClose?.addEventListener('click', () => this.closeMobileMenu());
            
            // Fechar mobile menu ao clicar no background
            this.mobileMenu?.querySelector('.mobile-menu-bg')?.addEventListener('click', () => {
                this.closeMobileMenu();
            });

            // Smooth scroll para links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            });

            // Fechar mobile menu ao redimensionar
            window.addEventListener('resize', Utils.throttle(() => {
                if (window.innerWidth > 992 && this.mobileMenu?.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }, 250));
        }

        handleScroll() {
            const scrolled = window.pageYOffset > 50;
            
            if (scrolled) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
        }

        updateActiveSection() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.pageYOffset + CONFIG.scrollOffset + 50;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    if (this.currentSection !== sectionId) {
                        this.currentSection = sectionId;
                        this.updateActiveLink();
                    }
                }
            });
        }

        updateActiveLink() {
            this.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${this.currentSection}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        handleNavClick(e) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Fechar mobile menu se estiver aberto
                    if (this.mobileMenu?.classList.contains('active')) {
                        setTimeout(() => this.closeMobileMenu(), 300);
                    }
                }
            }
        }

        openMobileMenu() {
            this.mobileMenu?.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animar toggle button
            const spans = this.mobileToggle?.querySelectorAll('span');
            if (spans) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
        }

        closeMobileMenu() {
            this.mobileMenu?.classList.remove('active');
            document.body.style.overflow = '';
            
            // Resetar toggle button
            const spans = this.mobileToggle?.querySelectorAll('span');
            if (spans) {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        }
    }

    // ==========================================
    // SISTEMA DE PARTÍCULAS HERO
    // ==========================================
    
    class ParticlesSystem {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.animationId = null;
            this.container = document.getElementById('particles');
        }

        init() {
            if (!this.container) return;
            
            this.createCanvas();
            this.createParticles();
            this.bindEvents();
            this.animate();
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            this.resizeCanvas();
        }

        resizeCanvas() {
            if (!this.canvas || !this.container) return;
            
            const rect = this.container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        createParticles() {
            const particleCount = Math.min(CONFIG.particleCount, Math.floor(this.canvas.width / 20));
            
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', Utils.throttle(() => {
                this.resizeCanvas();
                this.particles = [];
                this.createParticles();
            }, 250));
        }

        animate() {
            if (!this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Atualizar posição
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Desenhar partícula
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 200, 83, ${particle.opacity})`;
                this.ctx.fill();
            });
            
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }

    // ==========================================
    // ANIMAÇÕES DE ESTATÍSTICAS
    // ==========================================
    
    class StatsAnimator {
        constructor() {
            this.statsElements = document.querySelectorAll('.stat-number[data-count]');
            this.animatedElements = new Set();
            this.init();
        }

        init() {
            if (this.statsElements.length === 0) return;
            
            const observer = Utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateStats(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            });

            this.statsElements.forEach(el => observer.observe(el));
        }

        animateStats(element) {
            const targetValue = parseInt(element.getAttribute('data-count'));
            const currentValue = parseInt(element.textContent) || 0;
            
            // Adicionar efeito visual
            element.style.transform = 'scale(1.1)';
            element.style.color = '#00C853';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
            
            Utils.animateNumber(element, currentValue, targetValue, CONFIG.statsAnimationDuration);
        }
    }

    // ==========================================
    // FILTRO DE RESULTADOS/PORTFOLIO
    // ==========================================
    
    class PortfolioFilter {
        constructor() {
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.portfolioItems = document.querySelectorAll('.result-item-premium');
            this.currentFilter = 'all';
            this.init();
        }

        init() {
            if (this.filterButtons.length === 0) return;
            
            this.bindEvents();
            this.setupInitialState();
        }

        bindEvents() {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filter = button.getAttribute('data-filter');
                    this.filterItems(filter);
                    this.updateActiveButton(button);
                });
            });
        }

        setupInitialState() {
            // Animar entrada inicial dos items
            this.portfolioItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.8s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        filterItems(filter) {
            this.currentFilter = filter;
            
            this.portfolioItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || itemCategory === filter;
                
                if (shouldShow) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-30px)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }

        updateActiveButton(activeButton) {
            this.filterButtons.forEach(btn => btn.classList.remove('active'));
            activeButton.classList.add('active');
            
            // Efeito visual no botão
            activeButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                activeButton.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // ==========================================
    // SISTEMA DE FORMULÁRIO PREMIUM
    // ==========================================
    
    class ContactForm {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.submitButton = this.form?.querySelector('.form-submit');
            this.formFields = {};
            this.validators = {};
            this.isSubmitting = false;
            
            this.init();
        }

        init() {
            if (!this.form) return;
            
            this.setupFormFields();
            this.setupValidators();
            this.bindEvents();
            this.setupRealTimeValidation();
        }

        setupFormFields() {
            const fields = this.form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                this.formFields[field.name] = {
                    element: field,
                    indicator: field.parentNode.querySelector('.form-indicator'),
                    isValid: false,
                    hasBeenTouched: false
                };
            });
        }

        setupValidators() {
            this.validators = {
                name: (value) => {
                    if (!value || value.length < 2) {
                        return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
                    }
                    if (value.length > 100) {
                        return { isValid: false, message: 'Nome muito longo' };
                    }
                    return { isValid: true, message: 'Nome válido' };
                },
                
                email: (value) => {
                    if (!value) {
                        return { isValid: false, message: 'E-mail é obrigatório' };
                    }
                    if (!Utils.isValidEmail(value)) {
                        return { isValid: false, message: 'E-mail inválido' };
                    }
                    return { isValid: true, message: 'E-mail válido' };
                },
                
                phone: (value) => {
                    if (!value) {
                        return { isValid: false, message: 'Telefone é obrigatório' };
                    }
                    if (!Utils.isValidPhone(value)) {
                        return { isValid: false, message: 'Telefone inválido' };
                    }
                    return { isValid: true, message: 'Telefone válido' };
                },
                
                business: (value) => {
                    if (!value) {
                        return { isValid: false, message: 'Selecione o tipo de empresa' };
                    }
                    return { isValid: true, message: 'Seleção válida' };
                },
                
                service: (value) => {
                    if (!value) {
                        return { isValid: false, message: 'Selecione o serviço desejado' };
                    }
                    return { isValid: true, message: 'Serviço selecionado' };
                },
                
                message: (value) => {
                    if (!value || value.length < 10) {
                        return { isValid: false, message: 'Mensagem deve ter pelo menos 10 caracteres' };
                    }
                    if (value.length > 1000) {
                        return { isValid: false, message: 'Mensagem muito longa' };
                    }
                    return { isValid: true, message: 'Mensagem válida' };
                }
            };
        }

        bindEvents() {
            // Submit do formulário
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Formatação automática do telefone
            const phoneField = this.formFields.phone?.element;
            if (phoneField) {
                phoneField.addEventListener('input', (e) => {
                    e.target.value = Utils.formatPhone(e.target.value);
                });
            }
            
            // Validação em tempo real
            Object.keys(this.formFields).forEach(fieldName => {
                const field = this.formFields[fieldName];
                
                field.element.addEventListener('blur', () => {
                    field.hasBeenTouched = true;
                    this.validateField(fieldName);
                });
                
                field.element.addEventListener('input', Utils.debounce(() => {
                    if (field.hasBeenTouched) {
                        this.validateField(fieldName);
                    }
                }, 500));
            });
        }

        setupRealTimeValidation() {
            // Indicador visual de progresso do formulário
            const progressIndicator = document.createElement('div');
            progressIndicator.className = 'form-progress-indicator';
            progressIndicator.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0% completo</span>
            `;
            
            // Inserir antes do botão de submit
            this.submitButton?.parentNode.insertBefore(progressIndicator, this.submitButton);
            this.progressIndicator = progressIndicator;
            
            this.updateFormProgress();
        }

        validateField(fieldName) {
            const field = this.formFields[fieldName];
            const validator = this.validators[fieldName];
            
            if (!field || !validator) return;
            
            const value = field.element.value.trim();
            const validation = validator(value);
            
            field.isValid = validation.isValid;
            this.updateFieldUI(fieldName, validation);
            this.updateFormProgress();
            this.updateSubmitButton();
        }

        updateFieldUI(fieldName, validation) {
            const field = this.formFields[fieldName];
            const indicator = field.indicator;
            
            if (!indicator) return;
            
            // Remover classes anteriores
            field.element.classList.remove('valid', 'invalid');
            indicator.classList.remove('success', 'error');
            
            if (field.hasBeenTouched) {
                if (validation.isValid) {
                    field.element.classList.add('valid');
                    indicator.classList.add('success');
                    indicator.innerHTML = `<i class="fas fa-check"></i> ${validation.message}`;
                } else {
                    field.element.classList.add('invalid');
                    indicator.classList.add('error');
                    indicator.innerHTML = `<i class="fas fa-times"></i> ${validation.message}`;
                }
            }
        }

        updateFormProgress() {
            const totalFields = Object.keys(this.formFields).length;
            const validFields = Object.values(this.formFields).filter(field => field.isValid).length;
            const progress = Math.round((validFields / totalFields) * 100);
            
            if (this.progressIndicator) {
                const progressFill = this.progressIndicator.querySelector('.progress-fill');
                const progressText = this.progressIndicator.querySelector('.progress-text');
                
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${progress}% completo`;
            }
        }

        updateSubmitButton() {
            const allValid = Object.values(this.formFields).every(field => field.isValid);
            
            if (this.submitButton) {
                this.submitButton.disabled = !allValid || this.isSubmitting;
                
                if (allValid) {
                    this.submitButton.classList.add('ready');
                } else {
                    this.submitButton.classList.remove('ready');
                }
            }
        }

        async handleSubmit(e) {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            // Validar todos os campos
            let allValid = true;
            Object.keys(this.formFields).forEach(fieldName => {
                this.formFields[fieldName].hasBeenTouched = true;
                this.validateField(fieldName);
                if (!this.formFields[fieldName].isValid) {
                    allValid = false;
                }
            });
            
            if (!allValid) {
                this.showFormError('Por favor, corrija os campos destacados.');
                return;
            }
            
            // Verificar checkbox de privacidade
            const privacyCheckbox = this.form.querySelector('input[name="privacy"]');
            if (privacyCheckbox && !privacyCheckbox.checked) {
                this.showFormError('Você deve aceitar a política de privacidade.');
                return;
            }
            
            this.isSubmitting = true;
            this.updateSubmitButton();
            
            // Mostrar loading no botão
            this.submitButton.classList.add('loading');
            
            try {
                // Simular envio (aqui você integraria com sua API)
                await this.simulateFormSubmission();
                
                // Sucesso
                this.showFormSuccess();
                this.form.reset();
                this.resetForm();
                
                // Tracking de conversão (Google Analytics, Facebook Pixel, etc.)
                this.trackFormSubmission();
                
            } catch (error) {
                console.error('Erro no envio do formulário:', error);
                this.showFormError('Erro ao enviar formulário. Tente novamente.');
            } finally {
                this.isSubmitting = false;
                this.submitButton.classList.remove('loading');
                this.updateSubmitButton();
            }
        }

        async simulateFormSubmission() {
            // Simular delay da API
            return new Promise((resolve) => {
                setTimeout(resolve, CONFIG.formSubmissionDelay);
            });
        }

        showFormSuccess() {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-message success';
            successMessage.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-check-circle"></i>
                    <h4>Formulário enviado com sucesso!</h4>
                    <p>Entraremos em contato em até 1 hora. Também enviamos as informações por e-mail.</p>
                </div>
            `;
            
            this.form.parentNode.insertBefore(successMessage, this.form.nextSibling);
            
            // Remover mensagem após alguns segundos
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => successMessage.remove(), 500);
            }, 8000);
            
            // Scroll para a mensagem
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        showFormError(message) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-message error';
            errorMessage.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Erro no envio</h4>
                    <p>${message}</p>
                </div>
            `;
            
            this.form.parentNode.insertBefore(errorMessage, this.form);
            
            // Remover mensagem após alguns segundos
            setTimeout(() => {
                errorMessage.style.opacity = '0';
                setTimeout(() => errorMessage.remove(), 500);
            }, 6000);
            
            // Scroll para a mensagem
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        resetForm() {
            // Reset de todos os campos
            Object.keys(this.formFields).forEach(fieldName => {
                const field = this.formFields[fieldName];
                field.isValid = false;
                field.hasBeenTouched = false;
                field.element.classList.remove('valid', 'invalid');
                if (field.indicator) {
                    field.indicator.classList.remove('success', 'error');
                    field.indicator.innerHTML = '';
                }
            });
            
            this.updateFormProgress();
            this.updateSubmitButton();
        }

        trackFormSubmission() {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    form_name: 'contact_form',
                    value: 1
                });
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Contact Form'
                });
            }
            
            // Tracking personalizado
            console.log('Form submission tracked successfully');
        }
    }

    // ==========================================
    // SCROLL TO TOP
    // ==========================================
    
    class ScrollToTop {
        constructor() {
            this.button = document.getElementById('scrollToTop');
            this.init();
        }

        init() {
            if (!this.button) return;
            
            this.bindEvents();
            this.handleScroll();
        }

        bindEvents() {
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 100));
            
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        handleScroll() {
            if (window.pageYOffset > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }
    }

    // ==========================================
    // WHATSAPP INTEGRATION PREMIUM
    // ==========================================
    
    class WhatsAppIntegration {
        constructor() {
            this.whatsappButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
            this.init();
        }

        init() {
            this.setupWhatsAppLinks();
            this.trackWhatsAppClicks();
        }

        setupWhatsAppLinks() {
            // Atualizar links do WhatsApp com mensagem personalizada
            this.whatsappButtons.forEach(button => {
                if (!button.href.includes('text=')) {
                    const separator = button.href.includes('?') ? '&' : '?';
                    button.href += `${separator}text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
                }
                
                // Adicionar tracking
                button.addEventListener('click', () => {
                    this.trackWhatsAppClick(button);
                });
            });
        }

        trackWhatsAppClick(button) {
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'engagement',
                    event_label: 'whatsapp_click'
                });
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    content_name: 'WhatsApp Click'
                });
            }
            
            console.log('WhatsApp click tracked');
        }
    }

    // ==========================================
    // SISTEMA DE REVEAL ANIMATIONS
    // ==========================================
    
    class RevealAnimations {
        constructor() {
            this.elements = document.querySelectorAll('.service-card-premium, .result-item-premium, .highlight-item, .mission-point');
            this.init();
        }

        init() {
            if (this.elements.length === 0) return;
            
            const observer = Utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.revealElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });

            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                observer.observe(el);
            });
        }

        revealElement(element) {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('revealed');
        }
    }

    // ==========================================
    // PERFORMANCE MONITORING
    // ==========================================
    
    class PerformanceMonitor {
        constructor() {
            this.metrics = {
                loadTime: 0,
                domContentLoaded: 0,
                firstPaint: 0,
                firstContentfulPaint: 0
            };
            
            this.init();
        }

        init() {
            this.measureLoadTime();
            this.measurePaintTimings();
            this.monitorFormPerformance();
        }

        measureLoadTime() {
            window.addEventListener('load', () => {
                this.metrics.loadTime = performance.now();
                console.log(`Page load time: ${this.metrics.loadTime.toFixed(2)}ms`);
            });
            
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.domContentLoaded = performance.now();
                console.log(`DOM Content Loaded: ${this.metrics.domContentLoaded.toFixed(2)}ms`);
            });
        }

        measurePaintTimings() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.name === 'first-paint') {
                            this.metrics.firstPaint = entry.startTime;
                            console.log(`First Paint: ${entry.startTime.toFixed(2)}ms`);
                        } else if (entry.name === 'first-contentful-paint') {
                            this.metrics.firstContentfulPaint = entry.startTime;
                            console.log(`First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['paint'] });
            }
        }

        monitorFormPerformance() {
            // Monitorar tempo de preenchimento do formulário
            const form = document.getElementById('contactForm');
            if (form) {
                let formStartTime = null;
                
                const firstInput = form.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.addEventListener('focus', () => {
                        if (!formStartTime) {
                            formStartTime = performance.now();
                        }
                    }, { once: true });
                }
                
                form.addEventListener('submit', () => {
                    if (formStartTime) {
                        const formCompletionTime = performance.now() - formStartTime;
                        console.log(`Form completion time: ${(formCompletionTime / 1000).toFixed(2)}s`);
                        
                        // Tracking de performance do formulário
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'timing_complete', {
                                name: 'form_completion',
                                value: Math.round(formCompletionTime)
                            });
                        }
                    }
                });
            }
        }
    }

    // ==========================================
    // INICIALIZAÇÃO PRINCIPAL
    // ==========================================
    
    class HardTechApp {
        constructor() {
            this.systems = {};
            this.init();
        }

        init() {
            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initSystems());
            } else {
                this.initSystems();
            }
        }

        initSystems() {
            try {
                // Loading screen primeiro
                this.systems.loadingScreen = new LoadingScreen();
                
                // Sistemas principais
                this.systems.navigation = new NavigationSystem();
                this.systems.particles = new ParticlesSystem();
                this.systems.statsAnimator = new StatsAnimator();
                this.systems.portfolioFilter = new PortfolioFilter();
                this.systems.contactForm = new ContactForm();
                this.systems.scrollToTop = new ScrollToTop();
                this.systems.whatsapp = new WhatsAppIntegration();
                this.systems.revealAnimations = new RevealAnimations();
                this.systems.performanceMonitor = new PerformanceMonitor();
                
                // Expor sistemas globalmente para debug
                window.HardTech = this.systems;
                
                // Expor sistema de partículas para loading screen
                window.ParticlesSystem = this.systems.particles;
                
                console.log('🚀 HardTech Systems initialized successfully');
                
            } catch (error) {
                console.error('❌ Error initializing HardTech systems:', error);
            }
        }

        destroy() {
            // Cleanup de todos os sistemas
            Object.values(this.systems).forEach(system => {
                if (system.destroy && typeof system.destroy === 'function') {
                    system.destroy();
                }
            });
        }
    }

    // ==========================================
    // ESTILOS CSS DINÂMICOS PARA FORMULÁRIO
    // ==========================================
    
    const dynamicStyles = `
        <style>
            .form-progress-indicator {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                border: 1px solid rgba(0, 200, 83, 0.1);
            }
            
            .progress-bar {
                width: 100%;
                height: 6px;
                background: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 0.8rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #00C853, #4CAF50);
                transition: width 0.8s ease;
                border-radius: 3px;
            }
            
            .progress-text {
                font-size: 0.9rem;
                font-weight: 600;
                color: #4a5568;
            }
            
            .form-group input.valid,
            .form-group select.valid,
            .form-group textarea.valid {
                border-color: #00C853;
                box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.1);
            }
            
            .form-group input.invalid,
            .form-group select.invalid,
            .form-group textarea.invalid {
                border-color: #f44336;
                box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
            }
            
            .form-indicator.success {
                color: #00C853;
                font-weight: 600;
            }
            
            .form-indicator.error {
                color: #f44336;
                font-weight: 600;
            }
            
            .btn-premium.ready {
                background: linear-gradient(135deg, #00C853, #4CAF50);
                box-shadow: 0 10px 30px rgba(0, 200, 83, 0.3);
                animation: readyPulse 2s infinite;
            }
            
            @keyframes readyPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            .form-message {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                margin: 2rem 0;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border-left: 5px solid;
                opacity: 1;
                transition: all 0.5s ease;
            }
            
            .form-message.success {
                border-color: #00C853;
                background: linear-gradient(135deg, rgba(0, 200, 83, 0.05), rgba(76, 175, 80, 0.05));
            }
            
            .form-message.error {
                border-color: #f44336;
                background: linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(255, 107, 107, 0.05));
            }
            
            .message-content {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .message-content i {
                font-size: 1.5rem;
                margin-top: 0.3rem;
            }
            
            .form-message.success i {
                color: #00C853;
            }
            
            .form-message.error i {
                color: #f44336;
            }
            
            .message-content h4 {
                margin-bottom: 0.5rem;
                color: #2d3748;
                font-weight: 700;
            }
            
            .message-content p {
                color: #4a5568;
                margin: 0;
                line-height: 1.5;
            }
        </style>
    `;

    // Inserir estilos dinâmicos
    document.head.insertAdjacentHTML('beforeend', dynamicStyles);
    
    // ==========================================
    // INICIALIZAR APLICAÇÃO
    // ==========================================
    
    const app = new HardTechApp();
    
    // Export para uso global
    window.HardTechApp = app;

})();
