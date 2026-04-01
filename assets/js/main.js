/**
* Template Name: Personal - v2.1.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  var sectionSelector = '#header, section[id]';

  // Force visible sections in case stale template CSS keeps them hidden.
  $('section').addClass('section-show').css({
    opacity: 1,
    visibility: 'visible',
    top: 'auto',
    bottom: 'auto'
  });

  function setActiveNav(hash) {
    $('.nav-menu li, .mobile-nav li').removeClass('active');
    $('.nav-menu a[href="' + hash + '"]').closest('li').addClass('active');
    $('.mobile-nav a[href="' + hash + '"]').closest('li').addClass('active');
  }

  function closeMobileNav() {
    if ($('body').hasClass('mobile-nav-active')) {
      $('body').removeClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').fadeOut();
    }
  }

  function updateNavByScroll() {
    var scrollPos = $(window).scrollTop() + 120;
    var activeHash = '#header';

    $(sectionSelector).each(function() {
      var top = $(this).offset().top;
      var bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        activeHash = '#' + $(this).attr('id');
      }
    });

    setActiveNav(activeHash);
  }

  // Smooth anchor navigation
  $(document).on('click', '.nav-menu a, .mobile-nav a, #header .scroll-down', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var $target = $(hash);

      if ($target.length) {
        e.preventDefault();
        var targetOffset = hash === '#header' ? 0 : $target.offset().top - 12;

        $('html, body').animate({
          scrollTop: Math.max(targetOffset, 0)
        }, 550, 'swing', function() {
          updateNavByScroll();
          setActiveNav(hash);
        });

        closeMobileNav();
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
        return false;
      }
    }
  });

  $(window).on('load scroll resize', function() {
    updateNavByScroll();
  });

  if (window.location.hash && $(window.location.hash).length) {
    setTimeout(function() {
      var targetOffset = $(window.location.hash).offset().top - 12;
      $('html, body').scrollTop(Math.max(targetOffset, 0));
      updateNavByScroll();
      setActiveNav(window.location.hash);
    }, 150);
  }

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    $('.venobox').venobox();
  });

})(jQuery);