//import moment from 'moment';
"use strict";

(($) => {
    $.fn.bit = function(options) {
        const $SELECTOR = $(this);

        let all_events = [];
        let num_events = 0;

        let opts = $.extend({
            // callback before load
            on_before   : false,
            // callback on events loaded
            on_events   : false,
            // callback on each event loaded
            on_event    : false,
            // callback after plugin finishes running
            on_after    : false,
            // number of events limiter
            limit       : 100,
            // text to show on "View More" button
            more_msg    : 'View More dates',
            // text to show on "View More" button when all dates are already shown
            less_msg    : 'View Less',
            // whether to show the view more/less button
            show_btn    : true,
            // message to display whenever no events are scheduled
            none_msg    : 'There are no events scheduled at this time. Please check again later.',
            // text to show on the tickets link
            tickets_msg : 'Tickets',
            // whether to show the tickets link
            show_tickets: true,
            // text to show if the tickets are sold out
            soldout_msg : 'Sold Out',
            // text to show if it's a free show
            free_msg    : 'FREE!',
            // text to show if tickets aren't available yet
            soon_msg    : 'Coming Soon',
            // text to show on the rsvp link
            rsvp_msg    : 'RSVP',
            // whether to show the rsvp link
            show_rsvp   : false,
            // text to show on the vip link
            vip_msg     : 'VIP',
            // whether to show the vip link
            show_vip    : true,
            // order of the ticket buy links
            btns_order  : ['tickets', 'vip', 'rsvp'],
            // artist name
            artist      : '',
            // moment.js month format
            format_m    : 'MMM',
            // moment.js day format
            format_d    : 'DD',
            // moment.js year format
            format_y    : 'YYYY',
            // moment.js day of week format
            format_dow  : 'dddd',
            // whether to show the month
            show_m      : true,
            // whether to show the day
            show_d      : true,
            // whether to show the year
            show_y      : true,
            // whether to show the day of week
            show_dow    : false,
            // whether to show the city
            show_city   : true,
            // whether to show the state/territory
            show_region : true,
            // whether to show the country name
            show_country: false,
            // template to use for event output
            template    : $(`
                <div class="event">
                    <div class="date">
                        <span class="dow"></span>
                        <span class="month"></span>
                        <span class="day"></span>
                        <span class="year"></span>
                    </div>
                    <div class="location">
                        <span class="venue"></span>
                        <span class="city">,</span>
                        <span class="region">,</span>
                        <span class="country"></span>
                    </div>
                    <div class="tickets"></div>
                </div>
            `),
            // debugging options
            debug: {
                log_response : false // log the ajax response from bit
            }
        }, options);

        // we need to store the initial limit to go back to that limit if "View Less" is clicked
        const init_limit = opts.limit;
        // set this on init, change it on more/less button click
        let button_msg = opts.more_msg;

        // makes the view more / less button
        const makeButton = () => {
            if (opts.show_btn && num_events > init_limit && (all_events !== undefined && num_events !== 0 && all_events.length)) {
                $SELECTOR.append(`<div class="tour-more-wrap"><a href="#" class="tour-more btn">${button_msg}</a></div>`);

                $('.tour-more').on('click', (e) => {
                    if (opts.limit > 0) {
                        opts.limit = 0;
                        button_msg = opts.less_msg;
                    } else {
                        opts.limit = init_limit;
                        button_msg = opts.more_msg;
                    }

                    render();
                    e.preventDefault();
                });
            }
        };

        // renders events data to the template
        const render = () => {
            // if no events
            if (all_events === undefined || num_events === 0 || !all_events) {
                $SELECTOR.html(`<p class="no-events">${opts.none_msg}</p>`);
                return false;
            }

            // clear the parent
            $SELECTOR.html('');

            // loop through the ajax response from bit
            all_events.forEach((event, idx) => {
                // clone the template
                const $CLONE   = opts.template.clone();
                // month container
                const $MONTH   = $CLONE.find('.month');
                // month container
                const $DAY     = $CLONE.find('.day');
                // year container
                const $YEAR    = $CLONE.find('.year');
                // day of week container
                const $DOW     = $CLONE.find('.dow');
                // venue container
                const $VENUE   = $CLONE.find('.venue');
                // city container
                const $CITY    = $CLONE.find('.city');
                // region container
                const $REGION  = $CLONE.find('.region');
                // country container
                const $COUNTRY = $CLONE.find('.country');
                // tickets container
                const $TICKETS = $CLONE.find('.tickets');

                // cache the offers
                let offers = event.offers;
                // set up date and region vars
                let month, day, year, dow;

                // return if we've hit the limiter value
                if (opts.limit && (idx + 1) > opts.limit) return false;

                // remove id and any classes used to hide the template
                $CLONE.removeAttr('id').removeClass('hide').removeClass('hidden');

                // if the event has a date, format it with moment
                if (event.datetime) {
                    month = moment(event.datetime).format(opts.format_m);
                    day   = moment(event.datetime).format(opts.format_d);
                    year  = moment(event.datetime).format(opts.format_y);
                    dow   = moment(event.datetime).format(opts.format_dow);
                }

                if (opts.show_m && month) {
                    $MONTH.prepend(`<span>${month}</span>`);
                } else {
                    $MONTH.remove();
                }

                if (opts.show_d && day) {
                    $DAY.prepend(`<span>${day}</span>`);
                } else {
                    $DAY.remove();
                }

                if (opts.show_y && year) {
                    $YEAR.prepend(`<span>${year}</span>`);
                } else {
                    $YEAR.remove();
                }

                if (opts.show_dow && dow) {
                    $DOW.prepend(`<span>${dow}</span>`);
                } else {
                    $DOW.remove();
                }

                // if a venue is set
                if (event.venue) {
                    const VENUE   = event.venue;
                    const NAME    = VENUE.name;
                    const CITY    = VENUE.city;
                    const REGION  = VENUE.region;
                    const COUNTRY = VENUE.country;

                    if (NAME) {
                        $VENUE.prepend(`<span>${NAME}</span>`);
                    } else {
                        $VENUE.remove();
                    }

                    if (CITY && opts.show_city) {
                        $CITY.prepend(`<span>${CITY}</span>`);
                    } else {
                        $CITY.remove();
                    }

                    // cheap hack because BIT returns numbers for some regions for whatever reason, we don't want to output those
                    if(! /\d/.test(REGION) && REGION && opts.show_region) {
                        if(!opts.show_country) {
                            $REGION.html('');
                        }

                        $REGION.prepend(`<span>${REGION}</span>`);
                    } else {
                        if(!REGION && opts.show_region) {
                            if(opts.show_country && COUNTRY) {
                                $REGION.remove();
                                $COUNTRY.prepend(`<span>${COUNTRY}</span>`);
                            } else {
                                $REGION.html('');
                                $REGION.prepend(`<span>${COUNTRY}</span>`);
                            }
                        } else {
                            $REGION.remove();
                        }
                    }

                    if (opts.show_country && COUNTRY) {
                        if(!$COUNTRY.html().length) {
                            $COUNTRY.prepend(`<span>${COUNTRY}</span>`);
                        }
                    } else {
                        $COUNTRY.remove();
                    }
                }

                // this loop organizes the ticket links by the order set in the options
                for(let btn of opts.btns_order) {
                    // make sure there are offers
                    if(Array.isArray(offers) && offers.length > 0) {
                        for(let offer of offers) {
                            // check the offer types and display the appropriate links
                            // Tickets & Presale
                            if (opts.show_tickets && btn === 'tickets' && (offer.type === 'Tickets' || offer.type === 'Presale')) {
                                $TICKETS.append(`<a href="${offer.url}" class="tickets-link on-sale" target="_blank">${opts.tickets_msg}</a>`);
                                // sold out
                            } else if (opts.show_tickets && btn === 'tickets' && offer.type === 'Sold Out') {
                                $TICKETS.append(`<span class="tickets-link sold-out">${opts.soldout_msg}</span>`);
                                // free
                            } else if (opts.show_tickets && btn === 'tickets' && offer.type === 'Free') {
                                $TICKETS.append(`<a href="${offer.url}" class="tickets-link free" target="_blank">${opts.free_msg}</a>`);
                                // vip
                            } else if (opts.show_vip && btn === 'vip' && offer.type === 'VIP') {
                                $TICKETS.append(`<a href="${offer.url}" class="tickets-link vip" target="_blank">${opts.vip_msg}</a>`);
                            }
                        }
                    } else {
                        // there are no offers yet
                        if (btn === 'tickets') {
                            $TICKETS.append(`<a class="tickets-link soon">${opts.soon_msg}</a>`);
                        }
                    }

                    // rsvp link
                    if (btn === 'rsvp' && opts.show_rsvp && event.url.length) {
                        $TICKETS.append(`<a href="${event.url}" class="tickets-link rsvp" target="_blank">${opts.rsvp_msg}</a>`);
                    }
                }

                if(opts.on_event) {
                    opts.on_event(event, $CLONE);
                }

                $SELECTOR.append($CLONE);
            });

            makeButton();

            if(opts.on_after) {
                opts.on_after();
            }
        };

        if(opts.on_before) {
            opts.on_before();
        }

        // BIT API v3
        $.ajax({
            type: 'get',
            dataType: 'json',
            url : `https://rest.bandsintown.com/artists/${opts.artist}/events?app_id=sme_rca_ChrisBrown`,
            success: (response) => {
                all_events = response;
                num_events = response.length;

                if(opts.on_events) {
                    opts.on_events(num_events, all_events);
                }

                render();

                // debug
                if(opts.debug.log_response) {
                    console.log(response);
                }
            },
            error: () => {
                console.log('Error loading BIT.');
            }
        });
    };
})(jQuery);
