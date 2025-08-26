jQuery(document).ready(function($){
	//update these values if you change these breakpoints in the style.css file (or _layout.scss if you use SASS)
	var MqM= 768,
		MqL = 1024;

	var faqsSections = $('.cd-faq-group'),
		faqTrigger = $('.cd-faq-trigger'),
		faqsContainer = $('.cd-faq-items'),
		faqsCategoriesContainer = $('.cd-faq-categories'),
		faqsCategories = faqsCategoriesContainer.find('a'),
		closeFaqsContainer = $('.cd-close-panel'),
		faqsPerPage = 12,
		category = false,
		currentPage = 1;


	//pagination
	const paging = (page, scroll = true) => {
		if(scroll) {
			$('body,html').animate({'scrollTop': faqsContainer.offset().top - 100}, 200);
		}

		currentPage = page;

		$('.cd-faq-trigger.show').removeClass('show');

		let to = (page * faqsPerPage),
			from = to - faqsPerPage,
			cat = category ? $(category).find('.cd-faq-trigger') : $('.cd-faq-trigger');//default 'All' cat

		for(let i = from; i < to; i++) {
			$(cat[i]).addClass('show');
		}

		if($(cat).length > faqsPerPage) {
			$('#pagination').show();
			$('#pagination').children().hide();
			let pages = Math.ceil($(cat).length / faqsPerPage);
			for(let i = 1; i <= pages; i++) {
				$('#pagination div#'+ i).show();
			}

			$('#pagination .current').removeClass('current');
			$('#pagination div#'+page).addClass('current');

			$('#pagination .action.disabled').attr("disabled", false).removeClass('disabled');

			if(page === 1) {
				$("#pagination #previous").attr("disabled", true).addClass('disabled');
			} else if(page === pages) {
				$("#pagination #next").attr("disabled", true).addClass('disabled');
			}
		} else {
			$('#pagination').hide();
		}
	};

	const previousPage = () => {
		if( ! $('#pagination #previous').hasClass('disabled') ) {
			paging(--currentPage);
		}
	};

	const nextPage = () => {
		if( ! $('#pagination #next').hasClass('disabled') ) {
			paging(++currentPage);
		}
	};

	let maxPages = Math.ceil(faqTrigger.length / faqsPerPage);
	$('.cd-faq-categories #all').text($('.cd-faq-categories #all').text() + ' (' + faqTrigger.length + ')' );

	if(maxPages > 1) {
		let prev = document.createElement('div');
		prev.id = 'previous';
		prev.className = 'action';
		prev.onclick = () => previousPage();
		$('#pagination').append(prev);

		for (let i = 1; i <= maxPages; i++) {
			let div = document.createElement('div');
			div.textContent = i;
			div.id = i;
			div.className = 'page';
			div.onclick = () => paging(i);

			$('#pagination').append(div);
		}

		let next = document.createElement('div');
		next.id = 'next';
		next.className = 'action';
		next.onclick = () => nextPage();
		$('#pagination').append(next);
	}

	//faqs per cat
	let cats = [... faqsCategories];
	cats.forEach(el => {
		if(el.hash !== '') {
			let title = $(el.hash + ' .cd-faq-title h2');
			if (title.length !== 0) {
				let totalFaqs = document.createElement('span');
				totalFaqs.textContent = $(el.hash).find('a.cd-faq-trigger').length + ' Total';

				title.append(totalFaqs);
			}
		}
	});

	if($(window).width() > MqM) {
		paging(1, false);
	}

	//select a faq section
	faqsCategories.on('click', function(event){
		event.preventDefault();
		let selectedHref = $(this).attr('href');
		if( $(window).width() < MqM) {
			faqsContainer.scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(selectedHref).addClass('selected');
			closeFaqsContainer.addClass('move-left');
			$('body').addClass('cd-overlay');
		} else {
			$('.cd-faq-categories .displaying').removeClass('displaying');
			$(this).addClass('displaying');
			$('.selected').removeClass('selected');

			if(this.hash === '' || this.id === 'all') {
				category = false;
				paging(1);
			} else {
				$(this.hash).addClass('selected');
				category = $(this.hash);
				paging(1);

			}
		}

	});

	//close faq lateral panel - mobile only
	$('body').bind('click touchstart', function(event){
		if( $(event.target).is('body.cd-overlay') || $(event.target).is('.cd-close-panel')) {
			closePanel(event);
		}
	});

	faqsContainer.on('swiperight', function(event){
		closePanel(event);
	});

	//show faq content clicking on faqTrigger
	faqTrigger.on('click', function(event){
		event.preventDefault();
		$(this).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
	});

	$("a.faq-forgot-password").click(function(e){
		e.preventDefault();
        showForgotPassword();
	});

	//update category sidebar while scrolling
	/*$(window).on('scroll', function(){
		if ( $(window).width() > MqL ) {
			(!window.requestAnimationFrame) ? updateCategory() : window.requestAnimationFrame(updateCategory);
		}
	});*/

    $("a.otherFaq").click(function(e){
        e.preventDefault();
        var hashContainer = $("a.cd-faq-trigger[href="+$(this).attr('href')+"]");
        if ($(window).width() < MqM) {
            hashContainer = hashContainer.parent();
            var childPos = hashContainer.offset(),
				parentPos = hashContainer.parent().offset(),
				childOffset = {
					top: childPos.top - parentPos.top,
					left: childPos.left - parentPos.left
				};
            $('.cd-faq-items').animate({ 'scrollTop': childOffset.top - 10}, 200);
        } else {
            $('body,html').animate({ 'scrollTop': hashContainer.offset().top - 24}, 200);
            if (!hashContainer.parent().find("div.cd-faq-content").is(":visible")) {
                hashContainer.click();
            }
        }
    });

    try {
        if (document.referrer && document.referrer.length > 1 && document.referrer.indexOf("profile=") !== -1) {
            var backTo = document.referrer;
            $("span.backToSearch").show();
            $("span.backToSearch a").click(function(e){
                e.preventDefault();
                window.location.href = backTo;
            });
        }
    } catch (e) {

    }

    //hack to open the hash in mobile
    if(location.hash && location.hash.length > 2 && $("a[href="+location.hash+"]")[0]) {
        var hashContainer = $("a[href="+location.hash+"]");
        if ($(window).width() < MqM) {
            if (hashContainer.hasClass("cd-faq-trigger")){
                //inner item
                var parentId = hashContainer.parent().parent().attr("id");
                $("a[href=#"+parentId+"]").click();
                hashContainer = hashContainer.parent();
                var childPos = hashContainer.offset(),
                    parentPos = hashContainer.parent().offset(),
                    childOffset = {
                        top: childPos.top - parentPos.top,
                        left: childPos.left - parentPos.left
                    };
                $('.cd-faq-items').animate({ 'scrollTop': childOffset.top - 10}, 200);
            } else {
                //it's a main menu item
                hashContainer.click();
            }
        } else if (location.hash.indexOf("-") !==-1 && hashContainer.hasClass("cd-faq-trigger")) {
            $('body,html').animate({ 'scrollTop': hashContainer.offset().top - 24}, 200);
            if (!hashContainer.parent().find("div.cd-faq-content").is(":visible")) {
                hashContainer.click();
            }
        }
    }

	$(window).on('resize', function(){
		if($(window).width() <= MqL) {
			faqsCategoriesContainer.removeClass('is-fixed').css({
				'-moz-transform': 'translateY(0)',
			    '-webkit-transform': 'translateY(0)',
				'-ms-transform': 'translateY(0)',
				'-o-transform': 'translateY(0)',
				'transform': 'translateY(0)',
			});
		}
		if( faqsCategoriesContainer.hasClass('is-fixed') ) {
			faqsCategoriesContainer.css({
				'left': faqsContainer.offset().left,
			});
		}
	});

	function closePanel(e) {
		e.preventDefault();
		faqsContainer.removeClass('slide-in').find('li').show();
		closeFaqsContainer.removeClass('move-left');
		$('body').removeClass('cd-overlay');
	}

	function updateCategory(){
		updateCategoryPosition();
		updateSelectedCategory();
	}

	function updateCategoryPosition() {
		var top = $('.cd-faq').offset().top,
			height = jQuery('.cd-faq').height() - jQuery('.cd-faq-categories').height(),
			margin = 20;
		if( top - margin <= $(window).scrollTop() && top - margin + height > $(window).scrollTop() ) {
			var leftValue = faqsCategoriesContainer.offset().left,
				widthValue = faqsCategoriesContainer.width();
			faqsCategoriesContainer.addClass('is-fixed').css({
				'left': leftValue,
				'top': margin,
				'-moz-transform': 'translateZ(0)',
			    '-webkit-transform': 'translateZ(0)',
				'-ms-transform': 'translateZ(0)',
				'-o-transform': 'translateZ(0)',
				'transform': 'translateZ(0)',
			});
		} else if( top - margin + height <= $(window).scrollTop()) {
			var delta = top - margin + height - $(window).scrollTop();
			faqsCategoriesContainer.css({
				'-moz-transform': 'translateZ(0) translateY('+delta+'px)',
			    '-webkit-transform': 'translateZ(0) translateY('+delta+'px)',
				'-ms-transform': 'translateZ(0) translateY('+delta+'px)',
				'-o-transform': 'translateZ(0) translateY('+delta+'px)',
				'transform': 'translateZ(0) translateY('+delta+'px)',
			});
		} else {
			faqsCategoriesContainer.removeClass('is-fixed').css({
				'left': 0,
				'top': 0,
			});
		}
	}

	function updateSelectedCategory() {
		faqsSections.each(function(){
			var actual = $(this),
				margin = parseInt($('.cd-faq-title').eq(1).css('marginTop').replace('px', '')),
				activeCategory = $('.cd-faq-categories a[href="#'+actual.attr('id')+'"]'),
				topSection = (activeCategory.parent('li').is(':first-child')) ? 0 : Math.round(actual.offset().top);

			if ( ( topSection - 20 <= $(window).scrollTop() ) && ( Math.round(actual.offset().top) + actual.height() + margin - 20 > $(window).scrollTop() ) ) {
				activeCategory.addClass('selected');
			}else {
				activeCategory.removeClass('selected');
			}
		});
	}
});
