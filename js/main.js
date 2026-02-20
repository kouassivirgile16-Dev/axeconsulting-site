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
   5. Le formulaire de contact

   VOCABULAIRE CLE :
   - document     = la page web entiere
   - querySelector = cherche UN element dans la page
   - querySelectorAll = cherche TOUS les elements correspondants
   - addEventListener = "surveille" un evenement (clic, scroll, etc.)
   - classList     = la liste des classes CSS d'un element
   - classList.add()    = ajoute une classe
   - classList.remove() = enleve une classe
   - classList.toggle() = ajoute si absente, enleve si presente
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
   5. FORMULAIRE DE CONTACT
   =============================================
   Quand l'utilisateur soumet le formulaire :
   1. On empeche l'envoi par defaut (preventDefault)
   2. On recupere les donnees saisies
   3. On ouvre WhatsApp avec un message pre-rempli
      contenant les infos du formulaire
   4. On remet le formulaire a zero

   C'est une solution simple qui ne necessite
   pas de serveur ! Le message est envoye
   directement sur WhatsApp.
============================================= */

var contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // ^ preventDefault = empeche le comportement par defaut
    //   (qui serait de recharger la page)

    // On recupere les valeurs des champs
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    // On construit le message WhatsApp
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
