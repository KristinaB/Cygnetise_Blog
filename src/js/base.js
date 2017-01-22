
jQuery(document).ready(function(){
	"use strict";
	

	(function(){
		configureVideos();
		configureComments();
		configureShortcodes();
		configureInfiniteLoading();
		configureHighlighter();
		configureSubscription();
		configureAnalytics();
		configureBackground();
		configureTags();
	})();


	// FITVIDS

	function configureVideos(){
		jQuery(".player, header.video, .postbody").fitVids();
	}


	// MASONRY LAYOUT

	if(jQuery('#postlist').length){
		var container = jQuery('#postlist');
		container.masonry({
			itemSelector: '.postinlist',
			isAnimated: true,
			transitionDuration: '1s',
			hiddenStyle: { opacity: 0, transform: 'translateY(100px)' },
			visibleStyle: { opacity: 1, transform: 'translateY(0px)' }
		});
	}


	// POST FORMAT - VIDEO

	jQuery("#postlist").on('click', '.play', function(){
		var parent = jQuery(this).closest('.video');
		jQuery(parent).find(".meta, .gradient, .play").animate({
			bottom: '-40%',
			opacity: 0
		}, 400, function(){
			jQuery(parent).find(".background").animate({
				opacity: 0
			}, 400, function(){
				jQuery(parent).find(".player").css('z-index', '500');
			});
		});
	});


	// COMMENTS

	function configureComments(){
		jQuery('.commentsection #comments').show();
		if((jQuery('.commentsection').length !== 0) && config.disqus_shortname !== '' && config.disqus_shortname !== null && config.disqus_shortname !== undefined || config.google_comments === true){
			jQuery('.commentsection .comments').show();
		}
		if(config.autoload_comments === true){
			loadComments();
		}
	}

	function loadComments(){
		if((jQuery('.commentsection').length !== 0) && config.disqus_shortname !== '' && config.disqus_shortname !== null && config.disqus_shortname !== undefined || config.google_comments === true){
			if(config.disqus_shortname !== ''){
				var disqus_shortname = config.disqus_shortname;
				(function(){
				var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
				dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
				})();
			}else if(config.google_comments === true){
				jQuery.getScript("https://apis.google.com/js/plusone.js")
				.done(function(script, textStatus){
					gapi.comments.render('g-comments',{
						href: window.location,
						width: '760',
						first_party_property: 'BLOGGER',
						view_type: 'FILTERED_POSTMOD'
					});
				});
			}
		}
		jQuery('.disqus_thread, #g-comments').show();
		jQuery('#comments').html(' <h3><i class="fa fa-comments-o"></i>Comments</h3>');
		jQuery('#comments').css('cursor', 'default');
	}

	jQuery('#comments').click(function(){
		loadComments();
	});


	// DRAWER

	jQuery(".navicon").on('click', function(){
		toggleDrawer();
		jQuery("#drawer").animate({scrollTop : 0}, 800);
	});

	jQuery('#page-content').on('click', function(){
		if(jQuery('#toggle.on').length){
			toggleDrawer();
		}
	});

	function toggleDrawer(){
		jQuery('#toggle').toggleClass('on');
		jQuery('#drawer').toggleClass('active');
		jQuery('.navicon').toggleClass('active');
		jQuery('#page-content').toggleClass('active');
		jQuery('#drawer #social').toggleClass('active');
	}


	// BACK TO TOP

	jQuery('.backtotop a').click(function(){
		jQuery('html, body').animate({scrollTop : 0}, 800);
		return false;
	});


	// SHORTCODES

	function configureShortcodes(){
		jQuery('.shorttabs').each(function(){
			jQuery('.shorttabscontent', this).hide();
			jQuery('.shorttabscontent', this).first().show();
			jQuery('.shorttabsheader', this).first().addClass('active');
		});
	}


	// SHORTCODES - TOGGLE

	jQuery('.shorttoggle .toggleheader').click(function(){
		jQuery(this).siblings( ".togglecontent" ).toggle();
	});


	// SHORTCODE - TABS

	jQuery('.shorttabsheader').click(function(){
		jQuery('.shorttabscontent', jQuery(this).parent()).hide();
		jQuery('.shorttabsheader.active', jQuery(this).parent()).removeClass('active');
		jQuery(this).addClass('active');
		jQuery(".shorttabscontent[data-id='" + jQuery(this).attr('data-id') + "']").show();
	});


	// IMAGE GALLERY

	function nextImage(post){
		if( jQuery(post).find('.active').length === 0){
			jQuery(post).find('li:first-child').first().addClass('active');
		}
		jQuery(post).find('.active').fadeOut(600);
		var next = jQuery(post).find('.active').next();
		if(next.length === 0){
			next = jQuery(post).find('.gallery li').first();
		}
		jQuery(post).find('.active').removeClass('active');
		jQuery(next).addClass('active');
		jQuery(next).fadeIn(600);
	}

	function previousImage(post){
		if(jQuery(post).find('.active').length === 0){
			jQuery(post).find('li:first-child').first().addClass('active');
		}
		jQuery(post).find('.active').fadeOut(600);
		var next = jQuery(post).find('.active').next();
		if(next.length === 0){
			 next = jQuery(post).find('.gallery li').first();
		}
		jQuery(post).find('.active').removeClass('active');
		jQuery(next).addClass('active');
		jQuery(next).fadeIn(600);
	}

	jQuery('#postlist').on('click', '.next', function(){
		var post = jQuery(this).closest('.postinlist');
		nextImage(post);
	});

	jQuery('#postlist').on('click', '.previous', function(){
		var post = jQuery(this).closest('.postinlist');
		previousImage(post);
	});

	jQuery('header').on('click', '.next', function(){
		var post = jQuery(this).closest('header');
		nextImage(post);
	});

	jQuery('header').on('click', '.previous', function(){
		var post = jQuery(this).closest('header');
		previousImage(post);
	});


	// NAVIGATION ARROWS
	jQuery('li.menu-item-has-children > a').click(function(){
		var parent = jQuery(this).parent();
		jQuery('a i', parent).toggleClass('fa-chevron-down');
		jQuery('a i', parent).toggleClass('fa-chevron-up');
		jQuery('.sub-menu', parent).slideToggle();
		return false;
	});


	// INFINITE POST LOADING

	function configureInfiniteLoading(){
		if(window.config.disable_ajax === false && jQuery('#postlist').length !== 0){
			jQuery('.pageicon').hide();
			jQuery('ul.page-numbers').hide();
			jQuery('#statusbutton').show();
			if(jQuery(".pagination > .previous").length === 0){
				jQuery('#statusbutton').html('<i class="fa fa-times"></i>No More Posts');
				jQuery('#statusbutton').removeClass('loading');
				jQuery('#statusbutton').removeClass('loadmore');
				jQuery('#statusbutton').addClass('nomoreposts');
			}else{
				if(window.config.use_infinite === true){
					jQuery('#postlist').waypoint(function(){
						jQuery('#statusbutton').removeClass('loadmore');
						jQuery('#statusbutton').html('<i class="fa fa-spinner"></i>Fetching Posts');
						jQuery('#statusbutton').addClass('loading');
						loadPosts(function(nextpage){
							if(nextpage !== undefined){
								jQuery('#statusbutton').addClass('loadmore');
								jQuery('#statusbutton').html('<i class="fa fa-align-left"></i>More Posts');
								jQuery('#statusbutton').removeClass('loading');
							}else{
								jQuery('#statusbutton').html('<i class="fa fa-times"></i>No More Posts');
								jQuery('#statusbutton').removeClass('loading');
								jQuery('#statusbutton').removeClass('loadmore');
								jQuery('#statusbutton').addClass('nomoreposts');
								jQuery('#postlist').waypoint('destroy');
							}
							jQuery.waypoints('refresh');
						});
						return false;
					}, { offset: 'bottom-in-view' });
				}
				jQuery(".pagination").on('click', '.loadmore',function(){
					jQuery('#statusbutton').removeClass('loadmore');
					jQuery('#statusbutton').html('<i class="fa fa-spinner"></i>Fetching Posts');
					jQuery('#statusbutton').addClass('loading');
					loadPosts(function(nextpage){
						if(nextpage !== undefined){
							jQuery('#statusbutton').addClass('loadmore');
							jQuery('#statusbutton').html('<i class="fa fa-align-left"></i>More Posts');
							jQuery('#statusbutton').removeClass('loading');
						}else{
							jQuery('#statusbutton').html('<i class="fa fa-times"></i>No More Posts');
							jQuery('#statusbutton').removeClass('loading');
							jQuery('#statusbutton').removeClass('loadmore');
							jQuery('#statusbutton').addClass('nomoreposts');
						}
					});
					return false;
				});
			}
		}

		function loadPosts(callback){
			jQuery.get( jQuery(".pagination > .previous").attr('href'), function(data){
				var result = jQuery(data).find('.postinlist');
				var nextpage = jQuery(data).find(".pagination > .previous").attr('href');
				var currentPage = jQuery('.pagination > .previous').attr('href');
				container.append(result);
				result.css('opacity', '0');
				container.imagesLoaded(function(){
					if(!window.config.disable_pushstate){ history.pushState({}, '', currentPage); }
					container.masonry('appended', result, true);
					jQuery(".player").fitVids();
					callback(nextpage);
					configureTags();
				});
				if(nextpage !== undefined){
					jQuery(".pagination > .previous").attr('href', nextpage);
				}
			});
		}
		jQuery(".pagination").on('click', '.nomoreposts', function(){
			return false;
		});
	}


	// SYNTAX HIGHLIGHTER

	function configureHighlighter(){
		if(config.highlightcode === true){
			Rainbow.color();
		}
	}


	// WIDGET - SUBSCRIPTION

	function configureSubscription(){
		jQuery('.mc-field-group .email').attr('placeholder', 'Email Address');
	}


	// GOOGLE ANALYTICS

	function configureAnalytics(){
		if(config.analytics_id !== '' || config.analytics_id !== null || config.analytics_id !== undefined){
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', config.analytics_id, 'auto');
			ga('send', 'pageview');
		}
	}


	// BACKGROUND IMAGE
	function configureBackground(){
		if(config.enable_background_image){
			jQuery('body').prepend('<div class="mainbackground"></div>');
			if(jQuery('body').hasClass('light')){
				jQuery('.mainbackground').addClass('mainbackground-light');
			}else{
				jQuery('.mainbackground').addClass('mainbackground-dark');
			}
		}
	}


	// CATEGORY FORMATTING

	function configureTags(){
		var invalid = ["imagebg", "double", "gallery", "image", "quote", "status", "video", "audio", "leftsidebar", "rightsidebar", "fullwidth"];
		jQuery('.category > a:first-child').each(function(index){
			var tag = jQuery(this).text();
			if(jQuery.inArray(tag, invalid) >= 0){
				if(jQuery(this).next().length !== 0){
					var nexttag = jQuery(this).next().text();
					if(jQuery.inArray(nexttag, invalid) > 0){
						jQuery(this).hide();
						jQuery(this).next().next().show();
					}else{
						jQuery(this).hide();
						jQuery(this).next().show();
					}
				}
			}
		});
		jQuery('.tagcloud a').each(function(index){
			var tag = jQuery(this).text();
			if(jQuery.inArray(tag, invalid) >= 0){
				jQuery(this).hide();
			}
		});
	}


});
