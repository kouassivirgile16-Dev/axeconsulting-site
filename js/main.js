/* ========================================
   AXECONSULTING RH - JavaScript Principal
   ========================================

   EXPLICATION POUR DEBUTANT :
   Ce fichier JavaScript ajoute le COMPORTEMENT au site.

   Si le HTML est le squelette (les os)
   et le CSS est l'apparence (vetements, maquillage),
   alors le JS est le CERVEAU : il fait bouger les choses !

   Ce fichier gere :
   1. Le menu hamburger sur mobile
   2. L'effet du header au scroll
   3. Les animations d'apparition au scroll
   4. Le compteur anime des statistiques
   5. Le formulaire de contact (avec securite)
   6. La navigation active au scroll
   7. Le systeme de changement de langue (FR/EN)

   VOCABULAIRE CLE :
   - document     = la page web entiere
   - querySelector = cherche UN element dans la page
   - querySelectorAll = cherche TOUS les elements correspondants
   - addEventListener = "surveille" un evenement (clic, scroll, etc.)
   - classList     = la liste des classes CSS d'un element
   - classList.add()    = ajoute une classe
   - classList.remove() = enleve une classe
   - classList.toggle() = ajoute si absente, enleve si presente
   - localStorage  = memoire du navigateur (persiste apres fermeture)
======================================== */


/* =============================================
   1. MENU HAMBURGER (Navigation mobile)
   =============================================
   Sur telephone, la navigation est cachee.
   Quand on clique sur le hamburger (3 barres),
   le menu s'ouvre en plein ecran.

   Quand on reclique ou qu'on clique sur un lien,
   le menu se referme.
============================================= */

// On recupere les elements dont on a besoin
var hamburgerBtn = document.getElementById('hamburgerBtn');
var mainNav = document.getElementById('mainNav');

// Quand on clique sur le hamburger...
hamburgerBtn.addEventListener('click', function () {
  // On bascule (toggle) la classe "open" sur la nav
  // Si "open" est la, on l'enleve. Sinon, on l'ajoute.
  mainNav.classList.toggle('open');

  // On bascule aussi la classe "active" sur le hamburger
  // pour l'animer en X
  hamburgerBtn.classList.toggle('active');
});

// Quand on clique sur un lien de la nav, on ferme le menu
var navLinks = document.querySelectorAll('.nav a');
// ^ querySelectorAll retourne une LISTE de tous les liens

navLinks.forEach(function (link) {
  // ^ forEach = "pour chaque lien dans la liste..."
  link.addEventListener('click', function () {
    // On enleve les classes pour fermer le menu
    mainNav.classList.remove('open');
    hamburgerBtn.classList.remove('active');
  });
});


/* =============================================
   2. HEADER AU SCROLL
   =============================================
   Quand l'utilisateur scrolle vers le bas,
   le header change d'apparence (ombre plus forte).

   window.scrollY = combien de pixels on a scrolle
   vers le bas depuis le haut de la page.

   Si on a scrolle plus de 50 pixels, on ajoute
   la classe "scrolled" qui change le style.
============================================= */

var header = document.getElementById('header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


/* =============================================
   3. ANIMATIONS D'APPARITION AU SCROLL
   =============================================
   Les elements avec la classe "rv" (reveal)
   sont invisibles au debut.

   Quand ils entrent dans la zone visible de
   l'ecran (le "viewport"), on ajoute la classe "v"
   qui les fait apparaitre avec une animation.

   On utilise "IntersectionObserver" :
   C'est comme un gardien qui surveille quand un
   element entre dans la zone visible.

   Parametre "threshold: 0.08" = l'animation se
   declenche quand 8% de l'element est visible.
============================================= */

var revealObserver = new IntersectionObserver(
  function (entries) {
    // "entries" = la liste des elements surveilles
    entries.forEach(function (entry) {
      // "entry.isIntersecting" = vrai si l'element est visible
      if (entry.isIntersecting) {
        entry.target.classList.add('v');
        // ^ On ajoute "v" (visible) pour declencher l'animation CSS
      }
    });
  },
  { threshold: 0.08 }
);

// On dit a l'observer de surveiller tous les elements ".rv"
var rvElements = document.querySelectorAll('.rv');
rvElements.forEach(function (el) {
  revealObserver.observe(el);
});


/* =============================================
   4. COMPTEUR ANIME DES STATISTIQUES
   =============================================
   Les chiffres dans la section "stats" s'animent :
   ils comptent de 0 jusqu'a leur valeur finale.

   Comment ca marche :
   1. On attend que la section stats soit visible
   2. Pour chaque nombre, on lit la valeur cible
      depuis l'attribut "data-count"
   3. On utilise setInterval pour incrementer
      le nombre progressivement
   4. Quand on atteint la cible, on arrete

   setInterval = execute une fonction toutes les
   X millisecondes (ici toutes les 30ms)
============================================= */

var counterDone = false;
// ^ Variable pour s'assurer qu'on anime UNE SEULE FOIS

var statsSection = document.querySelector('.stats');

if (statsSection) {
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterDone) {
          counterDone = true;
          animateCounters();
        }
      });
    },
    { threshold: 0.3 }
    // ^ 30% de la section doit etre visible
  );

  counterObserver.observe(statsSection);
}

function animateCounters() {
  var counters = document.querySelectorAll('.stat-number');

  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'));
    // ^ La valeur finale (ex: 2020, 150, 80, 98)
    var suffix = el.getAttribute('data-suffix') || '';
    // ^ Le suffixe a ajouter ("+", "%", ou rien)

    // Pour le nombre 2020 (annee), on ne l'anime pas de 0
    // On l'anime de 2000 a 2020 pour que ca soit plus rapide
    var start = target > 1000 ? target - 30 : 0;
    var current = start;

    // La vitesse d'incrementation
    var step = target > 1000 ? 1 : Math.max(1, Math.floor(target / 40));
    // ^ Pour les grands nombres (2020), on avance de 1 en 1
    //   Pour les petits (80, 98), on avance plus vite

    var interval = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        // ^ clearInterval = on arrete la repetition
      }
      el.textContent = current + suffix;
      // ^ On met a jour le texte affiche
    }, 30);
    // ^ Toutes les 30 millisecondes (≈33 fois par seconde)
  });
}


/* =============================================
   5. FORMULAIRE DE CONTACT (avec securite)
   =============================================
   Quand l'utilisateur soumet le formulaire :
   1. On verifie le champ piege (honeypot anti-bot)
   2. On verifie le delai entre deux envois (anti-spam)
   3. On nettoie les donnees saisies (anti-injection)
   4. On valide l'email et le telephone
   5. On verifie les longueurs maximales
   6. Si tout est bon, on ouvre WhatsApp
   7. On remet le formulaire a zero

   SECURITE :
   - sanitizeInput() : empeche l'injection de code HTML
   - isValidEmail()  : verifie le format de l'email
   - isValidPhone()  : verifie le format du telephone
   - honeypot        : champ cache que seuls les bots remplissent
   - rate limiting   : empeche l'envoi trop frequent
============================================= */

// --- Fonctions utilitaires de securite ---

/**
 * sanitizeInput - Nettoie une chaine pour empecher l'injection HTML
 *
 * EXPLICATION POUR DEBUTANT :
 * Si quelqu'un ecrit <script>alert('hack')</script> dans un champ,
 * cette fonction transforme les < et > en caracteres inoffensifs
 * (&lt; et &gt;) pour que le code ne s'execute JAMAIS.
 *
 * Astuce : on cree un element texte dans le DOM, puis on lit
 * son innerHTML, ce qui echappe automatiquement les caracteres dangereux.
 */
function sanitizeInput(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * isValidEmail - Verifie qu'une adresse email a le bon format
 *
 * EXPLICATION POUR DEBUTANT :
 * Une regex (expression reguliere) est un "motif" de texte.
 * Celle-ci verifie qu'il y a :
 * - quelque chose avant le @
 * - un @
 * - quelque chose apres le @
 * - un point
 * - quelque chose apres le point
 *
 * Exemples valides : nom@email.com, a@b.ci
 * Exemples invalides : nom@, @email, nom email.com
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * isValidPhone - Verifie qu'un numero de telephone a le bon format
 *
 * EXPLICATION POUR DEBUTANT :
 * Le telephone est optionnel. Si le champ est vide, c'est ok.
 * Si il est rempli, on verifie qu'il contient entre 7 et 20
 * caracteres parmi : chiffres (0-9), espaces, tirets, et
 * eventuellement un + au debut (pour l'indicatif pays).
 *
 * Exemples valides : +225 07 18 67 66 96, 0718676696
 * Exemples invalides : abc, 123
 */
function isValidPhone(phone) {
  if (!phone) return true; // optionnel : vide = valide
  return /^[\+]?[0-9\s\-]{7,20}$/.test(phone);
}

// --- Variable de limitation de frequence ---
// On memorise le moment du dernier envoi pour empecher le spam
var lastSubmitTime = 0;

// --- Gestionnaire du formulaire ---
var contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // ^ preventDefault = empeche le comportement par defaut
    //   (qui serait de recharger la page)

    // --- Etape 1 : Verification du champ piege (honeypot) ---
    // Le champ "website" est cache en CSS. Un humain ne le voit pas
    // et ne le remplit jamais. Seuls les bots le remplissent.
    var honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
      // Bot detecte ! On reinitialise le formulaire sans rien dire.
      contactForm.reset();
      return;
    }

    // --- Etape 2 : Limitation de frequence (rate limiting) ---
    // On empeche l'envoi plus d'une fois toutes les 30 secondes.
    // Date.now() retourne le nombre de millisecondes depuis le 1er janvier 1970.
    var now = Date.now();
    if (now - lastSubmitTime < 30000) {
      // 30000 ms = 30 secondes
      alert(
        currentLang === 'fr'
          ? 'Veuillez patienter avant de renvoyer.'
          : 'Please wait before resubmitting.'
      );
      return;
    }
    lastSubmitTime = now;

    // --- Etape 3 : Recuperation et nettoyage des donnees ---
    var name = sanitizeInput(document.getElementById('name').value.trim());
    var email = sanitizeInput(document.getElementById('email').value.trim());
    var phone = sanitizeInput(document.getElementById('phone').value.trim());
    var message = sanitizeInput(document.getElementById('message').value.trim());

    // --- Etape 4 : Verification des longueurs maximales ---
    // On empeche les saisies trop longues (protection contre les abus)
    if (name.length > 100) {
      alert(
        currentLang === 'fr'
          ? 'Le nom ne doit pas depasser 100 caracteres.'
          : 'Name must not exceed 100 characters.'
      );
      return;
    }
    if (email.length > 254) {
      alert(
        currentLang === 'fr'
          ? 'L\'email ne doit pas depasser 254 caracteres.'
          : 'Email must not exceed 254 characters.'
      );
      return;
    }
    if (phone.length > 20) {
      alert(
        currentLang === 'fr'
          ? 'Le telephone ne doit pas depasser 20 caracteres.'
          : 'Phone must not exceed 20 characters.'
      );
      return;
    }
    if (message.length > 2000) {
      alert(
        currentLang === 'fr'
          ? 'Le message ne doit pas depasser 2000 caracteres.'
          : 'Message must not exceed 2000 characters.'
      );
      return;
    }

    // --- Etape 5 : Validation de l'email ---
    if (!isValidEmail(email)) {
      alert(
        currentLang === 'fr'
          ? 'Veuillez entrer une adresse email valide.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    // --- Etape 6 : Validation du telephone (si rempli) ---
    if (!isValidPhone(phone)) {
      alert(
        currentLang === 'fr'
          ? 'Veuillez entrer un numero de telephone valide.'
          : 'Please enter a valid phone number.'
      );
      return;
    }

    // --- Etape 7 : Construction et envoi du message WhatsApp ---
    var waMessage =
      'Bonjour, je suis ' + name + '.\n' +
      'Email : ' + email + '\n' +
      (phone ? 'Tel : ' + phone + '\n' : '') +
      '\n' + message;

    // encodeURIComponent transforme les caracteres speciaux
    // en codes compatibles avec les URLs
    // (les espaces deviennent %20, les accents deviennent des codes, etc.)
    var waUrl = 'https://wa.me/2250718676696?text=' + encodeURIComponent(waMessage);

    // On ouvre WhatsApp dans un nouvel onglet
    window.open(waUrl, '_blank');

    // On remet le formulaire a zero
    contactForm.reset();
  });
}


/* =============================================
   6. NAVIGATION ACTIVE AU SCROLL
   =============================================
   Quand on scrolle sur la page, le lien de
   navigation correspondant a la section visible
   s'illumine automatiquement.

   On regarde quelle section est actuellement
   visible et on met a jour le lien actif.
============================================= */

var sections = document.querySelectorAll('section[id]');
// ^ On recupere toutes les sections qui ont un id

window.addEventListener('scroll', function () {
  var scrollPos = window.scrollY + 100;
  // ^ +100 pour un petit decalage (le header fait ~76px)

  sections.forEach(function (section) {
    var sectionTop = section.offsetTop;
    // ^ Position du haut de la section par rapport au debut de la page
    var sectionHeight = section.offsetHeight;
    // ^ Hauteur de la section
    var sectionId = section.getAttribute('id');

    // Si on est DANS cette section...
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      // On enleve "active" de tous les liens
      navLinks.forEach(function (link) {
        link.classList.remove('active');
      });

      // On ajoute "active" au lien qui pointe vers cette section
      var activeLink = document.querySelector('.nav a[href="#' + sectionId + '"]');
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
});


/* =============================================
   7. SYSTEME DE CHANGEMENT DE LANGUE (FR/EN)
   =============================================
   Le site est bilingue francais/anglais.

   Comment ca marche :
   1. On lit la preference de langue dans localStorage
      (memoire persistante du navigateur)
   2. Si aucune preference, on utilise "fr" par defaut
   3. Quand on clique sur le bouton de langue,
      on bascule entre FR et EN
   4. On sauvegarde le choix dans localStorage
   5. On met a jour l'attribut lang du HTML
   6. On ajoute la classe "lang-fr" ou "lang-en" au body
      (le CSS utilise ces classes pour montrer/cacher
       les textes dans la bonne langue)
   7. On met a jour les placeholders du formulaire

   localStorage :
   C'est comme un petit carnet de notes dans le navigateur.
   Les donnees persistent meme apres la fermeture du navigateur.
   - localStorage.setItem('cle', 'valeur') = ecrire
   - localStorage.getItem('cle') = lire
============================================= */

var langToggle = document.getElementById('langToggle');
var currentLang = localStorage.getItem('axe-lang') || 'fr';

/**
 * setLanguage - Change la langue du site
 *
 * @param {string} lang - 'fr' pour francais, 'en' pour anglais
 *
 * Cette fonction fait 4 choses :
 * 1. Sauvegarde la preference dans localStorage
 * 2. Met a jour l'attribut lang du <html> (pour l'accessibilite)
 * 3. Met a jour la classe du body (pour le CSS)
 * 4. Met a jour le bouton de langue (indicateur visuel)
 * 5. Met a jour les placeholders du formulaire
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('axe-lang', lang);

  // Met a jour l'attribut lang du <html>
  // Cela aide les lecteurs d'ecran et les moteurs de recherche
  document.documentElement.lang = lang;

  // Met a jour la classe du body
  // Le CSS utilise .lang-fr et .lang-en pour afficher
  // les textes dans la bonne langue
  document.body.classList.remove('lang-fr', 'lang-en');
  document.body.classList.add('lang-' + lang);

  // Met a jour le bouton de langue (indicateur visuel)
  if (langToggle) {
    var spans = langToggle.querySelectorAll('span');
    spans.forEach(function (s) { s.classList.remove('lang-active'); });
    // On active le bon span : spans[0] = FR, spans[1] = separateur "|", spans[2] = EN
    if (lang === 'fr') spans[0].classList.add('lang-active');
    else spans[2].classList.add('lang-active');
  }

  // Met a jour les placeholders du formulaire
  // Les placeholders sont les textes gris dans les champs vides
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var phoneInput = document.getElementById('phone');
  var messageInput = document.getElementById('message');

  if (lang === 'en') {
    if (nameInput) nameInput.placeholder = 'Your name';
    if (emailInput) emailInput.placeholder = 'your@email.com';
    if (phoneInput) phoneInput.placeholder = '+225 XX XX XX XX XX';
    if (messageInput) messageInput.placeholder = 'Describe your project or needs...';
  } else {
    if (nameInput) nameInput.placeholder = 'Votre nom';
    if (emailInput) emailInput.placeholder = 'votre@email.com';
    if (phoneInput) phoneInput.placeholder = '+225 XX XX XX XX XX';
    if (messageInput) messageInput.placeholder = 'Décrivez votre projet ou votre besoin...';
  }
}

// On initialise la langue au chargement de la page
setLanguage(currentLang);

// Quand on clique sur le bouton de langue, on bascule
if (langToggle) {
  langToggle.addEventListener('click', function () {
    setLanguage(currentLang === 'fr' ? 'en' : 'fr');
  });
}
