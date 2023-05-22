/**
 * Copyright 2013 Stephino
 */
$(document).ready(function(){
    "use strict";
    var intval = function (mixed_var, base) {var tmp;var type = typeof(mixed_var);if (type === 'boolean') {return +mixed_var;} else if (type === 'string') {tmp = parseInt(mixed_var, base || 10);return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;} else if (type === 'number' && isFinite(mixed_var)) {return mixed_var | 0;} else {return 0;}};
    var str_repeat = function (input, multiplier) {var y = '';while (true) {if (multiplier & 1) {y += input;}multiplier >>= 1;if (multiplier) {input += input;}else {break;}}return y;};
    var rand = function(numLow, numHigh) {var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;return Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);};
    var timeouts = [];
    
    // Define the main class
    var Silicate = function() {
        var options = {};
            
        // Initiate the project
        this.init = function() {
            // Initialize the options
            this.initOptions();
            
            // Create the countdown
            this.createCountdown();
            
            // Create the sliders
            this.sliders();
            
            // Prepare the social icons
            this.socialIcons();
            
            // Create the scrollbars
            this.scrollBars();
            
            // Validate forms
            this.formValidation();
            
            // Add the tooltips
            $('[title]').tooltip();
            
            // Parallax effect on the ripples
            this.parallax('hourglass .fixed, #page_wrap, .slide');
        };
        
        // Form validation
        this.formValidation = function() {
            // Parse forms
            $('.submit.btn').on('click', function(){
                $(this).closest('form').submit();
            });
            $.each($('form.validate'), function(){
                $(this).validate({
                    submitHandler: function(form) {
                        var data = $(form).serializeArray();
                        var action = $(form).attr('action');
                        $.ajax({
                            method: 'post',
                            dataType: 'json',
                            url: action,
                            data: data,
                            success: function(d) {
                                // Prepare the message
                                var message = '';
                                $.each(d, function(k, m){
                                    var messageType = 'boolean' === $.type(m.status) ? (m.status?'success':'error') : m.status;
                                    message += '<div class="alert alert-'+messageType+'">'+m.message+'</div>';
                                });
                                // Replace the form with the message
                                $(form).replaceWith($(message));
                            },
                            error: function() {
                                var error = $('<div class="alert alert-error">Could not contact host. Please try again later.</div>');
                                $(form).replaceWith(error);
                            }
                        });
                    }
                });
            });
        };
        
        this.scrollBars = function() {
             $('#page_wrap').mCustomScrollbar({
                set_width:false, /*optional element width: boolean, pixels, percentage*/
                set_height:false, /*optional element height: boolean, pixels, percentage*/
                horizontalScroll:false, /*scroll horizontally: boolean*/
                scrollInertia:50, /*scrolling inertia: integer (milliseconds)*/
                scrollEasing:"easeOutCirc", /*scrolling easing: string*/
                mouseWheel:"pixels", /*mousewheel support and velocity: boolean, "auto", integer, "pixels"*/
                mouseWheelPixels:50, /*mousewheel pixels amount: integer*/
                autoDraggerLength:false, /*auto-adjust scrollbar dragger length: boolean*/
                scrollButtons:{ /*scroll buttons*/
                    enable:false, /*scroll buttons support: boolean*/
                    scrollType:"continuous", /*scroll buttons scrolling type: "continuous", "pixels"*/
                    scrollSpeed:20, /*scroll buttons continuous scrolling speed: integer*/
                    scrollAmount:40 /*scroll buttons pixels scroll amount: integer (pixels)*/
                },
                advanced:{
                    updateOnBrowserResize:true, /*update scrollbars on browser resize (for layouts based on percentages): boolean*/
                    updateOnContentResize:true, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
                    autoExpandHorizontalScroll:false, /*auto expand width for horizontal scrolling: boolean*/
                    autoScrollOnFocus:true /*auto-scroll on focused elements: boolean*/
                }
            });
        };
        
        this.sliders = function() {
            var content = '<div class="panel">CNT</div>' +
                '<div class="handle">' +
                    '<div class="content">' +
                        'HANDLE' +
                    '</div>' +
                    '<div class="close">+</div>' +
                '</div>';
                        
            // Get all sliders
            $.each($('.slide'), function(){
                // Get the handle contents
                var handleContent = $(this).children('span').html();
                
                // Get the rest of the content
                $(this).children('span').remove();
                var panelContent = $(this).html();
                
                // Replace the HTML
                $(this).html(content.replace(/CNT/, panelContent).replace(/HANDLE/, handleContent));

                // Get the options
                var borderColor = !$(this).attr('data-border-color') ? '#ffffff' : $(this).attr('data-border-color');
                var backgroundColor = !$(this).attr('data-background-color') ? '#000000' : $(this).attr('data-background-color');
                var speed = !$(this).attr('data-speed') ? 1000 : intval($(this).attr('data-speed'));
                
                // Save the options
                $(this).data('options', {
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                });
                
                // Slide colors
                $(this).css({
                    borderColor: borderColor,
                    background: backgroundColor,
                });
                
                // Handle colors
                $(this).find('.handle').css({
                    borderColor: borderColor,
                    background: backgroundColor,
                });
                
                // Close color
                $(this).find('.close').css({
                    color: borderColor,
                });
                
                // By default, the slide is inactive
                $(this).removeClass('active');
                
                // Clicking the icon makes the slider show
                $(this).find('.handle').click(function(e){
                    var height = $(this).siblings('.panel').height();
                    if ($(this).parents('.slide').hasClass('active')) {
                        return true;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    
                    $(this).parents('.slide').animate({
                        height: (height) + 'px'
                    }, {
                        duration: speed,
                        step: function() {
                            $(this).css({overflow: 'visible'});
                        },
                        complete: function() {
                            $(this).addClass('active');
                        }
                    });
                });
                var slide = $(this);
                $(window).resize(function(){
                    slide.removeClass('active').css({height:'0px'});
                });
                $(this).find('.close').click(function(e){
                    if (!$(this).parents('.slide').hasClass('active')) {
                        return true;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    
                    $(this).parents('.slide').animate({
                        height: '0px'
                    }, {
                        duration: speed,
                        step: function() {
                            $(this).css({overflow: 'visible'});
                        },
                        complete: function(){
                            $(this).removeClass('active');
                        }
                    });
                });
            });
            
            
        };
        
        this.createCountdown = function() {
            // Get the countdown
            var countdown = $('.countdown');
            
            // Get the options
            options.countdownColor = !countdown.attr('data-color') ? '#5c503b' : countdown.attr('data-color');
            options.countdownTextColor = !countdown.attr('data-text-color') ? '#ffffff' : countdown.attr('data-text-color');
            options.countdownSpeed = !countdown.attr('data-speed') ? 3000 : intval(countdown.attr('data-speed'));
            options.countdownGrains = !countdown.attr('data-grains') ? 20 : intval(countdown.attr('data-grains'));

            var hourGlassMatrix = '<div class="hourglass" id="ID">' +
                '<div class="fixed"></div>' +
                '<div class="rim top number"><span></span></div>' + 
                str_repeat('<div class="grain"></div>', options.countdownGrains) +
                '<div class="top holder">' + 
                    '<div class="glass">' + 
                        '<div class="triangle"></div>' + 
                    '</div>' + 
                    '<div class="triangle"></div>' + 
                '</div>' + 
                '<div class="bottom holder">' + 
                    '<div class="glass">' + 
                        '<div class="triangle"></div>' + 
                    '</div>' + 
                    '<div class="triangle"></div>' + 
                '</div>' + 
                '<div class="rim bottom"><p></p></div>' + 
            '</div>';
        
            // Get the date
            var date = countdown.attr('date');
            date = date.split('-');

            // Invalid date format
            if (date.length !== 3) {return;}

            // Set the actual date
            date = new Date(intval(date[0]), intval(date[1]) - 1, intval(date[2]));
            
            // Add the necessary HTML
            countdown.html('<div class="container row-fluid">' +
                '<div class="span2 col offset2">' +
                    hourGlassMatrix.replace(/ID/, 'days') +
                '</div>' +
                '<div class="span2 col">' +
                    hourGlassMatrix.replace(/ID/, 'hours') +
                '</div>' +
                '<div class="span2 col">' +
                    hourGlassMatrix.replace(/ID/, 'minutes') +
                '</div>' +
                '<div class="span2 col">' +
                    hourGlassMatrix.replace(/ID/, 'seconds') +
                '</div>' +
            '</div>');
            
            // Set the colors
            $('.hourglass .rim.bottom, .hourglass .grain').css({background: options.countdownColor, color: options.countdownTextColor});
            $('.hourglass > .holder > .glass > .triangle').css({borderColor: options.countdownColor + ' transparent'});
            
            // Store the glass values
            var hourGlassWidth = $('.hourglass').width() - 40;
            var hourGlassHeight = $('.hourglass').height() - 60;
                
            // Update hourglass height
            window.setInterval(function(){
                if (hourGlassWidth !== $('.hourglass').width() || hourGlassHeight !== $('.hourglass').height()) {
                    // Restore the values
                    hourGlassWidth = $('.hourglass').width() - 40;
                    hourGlassHeight = $('.hourglass').height() - 60;

                    // Update the drawings
                    $('.hourglass > .holder.top > .glass > .triangle, .hourglass > .holder.top > .triangle').css({
                        borderWidth: (hourGlassHeight/2) + 'px ' + (hourGlassWidth/2 + 1) + 'px 0px ' + (hourGlassWidth/2 + 1) + 'px',
                    });
                    $('.hourglass > .holder.bottom > .glass > .triangle, .hourglass > .holder.bottom > .triangle').css({
                        borderWidth: '0px ' + (hourGlassWidth/2 + 1) + 'px ' + (hourGlassHeight/2) + 'px ' + (hourGlassWidth/2 + 1) + 'px',
                    });
                    $('.hourglass > .holder').css({
                        height: hourGlassHeight/2
                    });
                    $('.hourglass > .holder > .glass').css({
                        width: hourGlassWidth
                    });
                }
            }, 500);
            
            var HourGlass = function() {
                this.firstRun = true;
                this.init = function(fnc) {
                    // Hide the background shadows
                    $('.hourglass > .holder > .triangle').css({
                        opacity: 0
                    });
                    
                    // No sand yet
                    $('.hourglass > .holder > .glass').css({
                        height: '0%',
                    });
                    
                    // Close the hourglass
                    $('.hourglass').css({
                        height: '0px'
                    }).animate({
                        height: '260px'
                    }, {
                        duration: options.countdownSpeed / 2,
                        complete: function(){
                            // Show the background shadows
                            $('.hourglass > .holder > .triangle').stop().animate({
                                opacity: 1
                            }, {
                                duration: options.countdownSpeed / 2
                            });
                            
                            // Show the sand
                            $('.hourglass > .top.holder > .glass').stop().animate({
                                height: '100%',
                            }, {
                                duration: options.countdownSpeed / 2
                            });
                        }
                    });
                    
                    window.setTimeout(fnc, options.countdownSpeed);
                };
                
                this.update = function(object, value, max) {
                    // Calculate the percentage
                    if (value > max) {value = max;}
                    
                    // Exponential fall
                    var percentage = 100 - 100/Math.pow(100, value/max);
                    var duration = 800;
                    
                    // Update the number
                    if ('' === $(object).find('.number span').html() || intval(value) !== intval($(object).find('.number span').html())) {
                        $(object).find('.number span').html(value);
                        
                        // Update the top glass height
                        if (hourglassObj.firstRun) {
                            $(object).find('.top > .glass').stop().animate({
                                height: percentage + '%'
                            }, {
                                duration: options.countdownSpeed / 2
                            });
                        } else {
                            $(object).find('.top > .glass').stop().animate({
                                height: percentage + '%'
                            }, {
                                duration: options.countdownSpeed / 4
                            });
                        }
                        
                        // Rotate!
                        if (0 === percentage) {
                            // Hide the number and seconds
                            $(object).find('.number span, p, .grain').css({
                                opacity: 0
                            });

                            $(object).find('.fixed').transition({
                                rotate: '-180deg',
                                duration: duration,
                                complete: function() {
                                    // Back to normal quick
                                    $(this).css('transit:transform', '');
                                }
                            });
                            
                            $(object).css({zIndex:10}).transition({
                                rotate: '180deg',
                                duration: duration,
                                complete: function() {
                                    // Back to normal quick
                                    $(this).css('transit:transform', '').css({zIndex:0});
                                    
                                    // Show the number and seconds
                                    $(object).find('.number span, p, .grain').stop().animate({
                                        opacity: 1,
                                    }, {
                                        duration: duration/2
                                    });
                                    $(object).find('.top > .glass').css({
                                        height: '100%'
                                    });
                                    $(object).find('.bottom > .glass').css({
                                        height: '0%'
                                    });
                                }
                            });
                        }
                        
                        if (percentage > 90 && !hourglassObj.firstRun) {
                            // Fast update
                            $(object).find('.bottom > .glass').css({height: (100 - percentage) + '%'});
                        } else {
                            window.setTimeout(function(){
                                // Update the bottom glass height
                                $(object).find('.bottom > .glass').stop().animate({
                                    height: (100 - percentage) + '%'
                                }, {
                                    duration: hourglassObj.firstRun ? (options.countdownSpeed / 2) : 200
                                });
                            }, duration * percentage/100 + 10);
                        }
                        
                        // Make the sand fall
                        $.each($(object).find('.grain'), function(k){
                            var element = $(this);
                            var elementDimension = rand(2,5);
                            
                            // Set the timeout
                            timeouts[timeouts.length] = window.setTimeout(function(){
                                $(element).css({
                                    display: 'block', 
                                    top: '50%',
                                    left: '50%',
                                    opacity: rand(0,1) ? 0.5 : 1,
                                    width: elementDimension + 'px',
                                    height: elementDimension + 'px',
                                    marginLeft: (-elementDimension/2) + 'px',
                                 }).stop().animate({
                                    top: '100%',
                                    left: (60 - rand(0, 20)) + '%',
                                }, {
                                    duration: duration * rand(5,10) / 10, 
                                    complete: function(){
                                        $(this).css({display: 'none'});
                                        if (hourglassObj.firstRun) {
                                            hourglassObj.firstRun = false;
                                        }
                                    }
                                });
                            }, k * duration * rand(1,10)/10);
                        });
                    }
                };
            };
            var hourglassObj = new HourGlass();
            
            //counter update function
            var checkDate = function() {
                //get actually date
                var now = new Date();
                //get difference from launch date (declared in head in index.html)
                var diff = date.getTime() - now.getTime();

                //change multisecond result to seconds, minutes, hours and days
                var tmp = diff / 1000;
                var seconds = Math.floor(tmp % 60);
                tmp /= 60;
                var minutes = Math.floor(tmp % 60);
                tmp /= 60;
                var hours = Math.floor(tmp % 24);
                tmp /= 24;
                var days = Math.floor(tmp);
                
                // Update the hourglass
                hourglassObj.update($("#days"), days, 360);
                hourglassObj.update($("#hours"), hours, 24);
                hourglassObj.update($("#minutes"), minutes, 60);
                hourglassObj.update($("#seconds"), seconds, 60);
                
                var spelling = {
                    days:    [countdown.attr('day') ? countdown.attr('day') : "day", countdown.attr('days') ? countdown.attr('days') : "days"],
                    hours:   [countdown.attr('hour') ? countdown.attr('hour') : "hour", countdown.attr('hours') ? countdown.attr('hours') : "hours"],
                    minutes: [countdown.attr('minute') ? countdown.attr('minute') : "minute", countdown.attr('minutes') ? countdown.attr('minutes') : "minutes"],
                    seconds: [countdown.attr('second') ? countdown.attr('second') : "second", countdown.attr('seconds') ? countdown.attr('seconds') : "seconds"],
                };

                $("#days p").html(days === 1 ? spelling.days[0] : spelling.days[1]);
                $("#hours p").html(hours === 1 ? spelling.hours[0] : spelling.hours[1]);
                $("#minutes p").html(minutes === 1 ? spelling.minutes[0] : spelling.minutes[1]);
                $("#seconds p").html(seconds === 1 ? spelling.seconds[0] : spelling.seconds[1]);
            };
            
            // After initialization, start the countdown
            hourglassObj.init(function(){
                checkDate();
                
                window.setInterval(function() {
                    checkDate();
                }, 1000);
            });
        };
        
        this.socialIcons = function() {
            var translations = {
                'youtube': "&#xe000;",
                'yandex': "&#xe001;",
                'vkontakte': "&#xe002;",
                'vk': "&#xe003;",
                'vimeo': "&#xe004;",
                'twitter': "&#xe005;",
                'tumblr': "&#xe006;",
                'steam': "&#xe007;",
                'stackoverflow': "&#xe008;",
                'soundcloud': "&#xe009;",
                'skype': "&#xe00a;",
                'share': "&#xe00b;",
                'rss': "&#xe00c;",
                'readability': "&#xe00d;",
                'read-it-Later': "&#xe00e;",
                'pocket': "&#xe00f;",
                'pinterest': "&#xe010;",
                'picasa': "&#xe011;",
                'openid': "&#xe012;",
                'myspace': "&#xe013;",
                'moikrug': "&#xe014;",
                'linked-in': "&#xe015;",
                'lifejournal': "&#xe016;",
                'lastfm': "&#xe017;",
                'jabber': "&#xe018;",
                'instapaper': "&#xe019;",
                'habrahabr': "&#xe01a;",
                'google': "&#xe01b;",
                'github-octoface': "&#xe01c;",
                'github-circle': "&#xe01d;",
                'foursquare': "&#xe01e;",
                'flickr': "&#xe01f;",
                'flattr': "&#xe020;",
                'facebook': "&#xe021;",
                'evernote': "&#xe022;",
                'email': "&#xe023;",
                'dropbox': "&#xe024;",
                'blogspot': "&#xe025;",
                'bitbucket': "&#xe026;",
                'youtube-play': "&#xe027;",
            };
            if ($('.social').length) {
                $.each($('.social'), function(){
                    // Get the class name
                    var className = $(this).attr('class').replace(/social\s*/g, '');
                    var title = $(this).html();
                    
                    // Translation available?
                    if (typeof translations[className] !== 'undefined') {
                        $(this).html(translations[className]).css({
                            backgroundColor: options.color
                        }).attr('title', title);
                    }
                });
            }
        };
        
        // Load the options
        this.initOptions = function() {
            var userOptions = {
                duration: $('#page_wrap').attr('data-duration') ? intval($('#page_wrap').attr('data-duration')) : 3000,
            };
            
            // Get the options
            $.extend(options, userOptions);
        };
        
        this.parallax = function(className) {
            $('html').off("mousemove").on('mousemove', function(e){
                // Get the window width
                var windowWidth = $(window).width();
                
                // Get the window height
                var windowHeight = $(window).height();
                
                // Get x percent
                var xPercent = (e.clientX / windowWidth * 100);
                
                // Get y percent
                var yPercent = (e.clientY / windowHeight * 100);
                
                xPercent = 40 + xPercent / 100 * 20;
                yPercent = 80 + yPercent / 100 * 20;
                
                // Get all the items
                var allItems = $('.' + className);
                if (allItems.length) {
                    allItems.css({
                        backgroundPosition: xPercent + '% ' + yPercent + '%'
                    });
                }
            });
        };

        // Form validation
        this.formValidation = function() {
            // Parse forms
            $('.submit.btn').on('click', function(){
                $(this).closest('form').submit();
            });
            $.each($('form.validate'), function(){
                $(this).validate({
                    submitHandler: function(form) {
                        var data = $(form).serializeArray();
                        var action = $(form).attr('action');
                        $.ajax({
                            method: 'post',
                            dataType: 'json',
                            url: action,
                            data: data,
                            success: function(d) {
                                // Prepare the message
                                var message = '';
                                $.each(d, function(k, m){
                                    var messageType = 'boolean' === $.type(m.status) ? (m.status?'success':'error') : m.status;
                                    message += '<div class="alert alert-'+messageType+'">'+m.message+'</div>';
                                });
                                // Replace the form with the message
                                $(form).replaceWith($(message));
                            },
                            error: function() {
                                var error = $('<div class="alert alert-error">Could not contact host. Please try again later.</div>');
                                $(form).replaceWith(error);
                            }
                        });
                    }
                });
            });
        };
    };
    
    // Load the class
    var instance = new Silicate(); instance.init();
});