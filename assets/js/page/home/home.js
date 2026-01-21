/* --------------------------------------------------------

Template Name: Edusquad Bootstrap 4 Education Template
Version: 1.0

-----------------------------------------------------------*/

/*counter*/
(function ($) {
    $.fn.countTo = function (options) {
        options = options || {};

        return $(this).each(function () {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof (settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof (settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0, // the number the element should start at
        to: 0, // the number the element should end at
        speed: 1000, // how long it should take to count between the target numbers
        refreshInterval: 100, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        formatter: formatter, // handler for formatting the value before rendering
        onUpdate: null, // callback method for every time the element is updated
        onComplete: null // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
}(jQuery));

jQuery(function ($) {
    // custom formatting example
    $('.count-number').data('countToOptions', {
        formatter: function (value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
});

/*student review slider*/
$(document).ready(function () {
    /* .single-item init moved to fetch logic */
    $('.center').slick({
        centerMode: true,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [{
            breakpoint: 992,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
            }
        },
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: false,
                centerPadding: '40px',
                slidesToShow: 1,
            }
        },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: false,
                centerPadding: '40px',
                slidesToShow: 1
            }
        }
        ]
    });
});

/*event gallery slider*/
$('.autoplay').not('.slick-initialized').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [{
        breakpoint: 992,
        settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 4
        }
    },
    {
        breakpoint: 768,
        settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 3
        }
    },
    {
        breakpoint: 600,
        settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 2
        }
    },
    {
        breakpoint: 480,
        settings: {
            arrows: false,
            centerMode: false,
            centerPadding: '40px',
            slidesToShow: 1
        }
    }
    ]
});

// Send WhatsApp Message Function
function sendToWhatsapp(nameId, emailId, phoneId, courseId) {
    var name = document.getElementById(nameId).value;
    var email = document.getElementById(emailId).value;
    var phone = document.getElementById(phoneId).value;
    var course = document.getElementById(courseId).value;

    if (name === "" || email === "" || phone === "" || course === "") {
        alert("Please fill in all fields.");
        return;
    }

    var message = "Hello, I am " + name + ". My Email is " + email + " and Phone Number is " + phone + ". I am interested in " + course + ". Please contact me.";

    // Using business phone number found in footer.html
    var whatsappUrl = "https://wa.me/919421776347?text=" + encodeURIComponent(message);

    window.open(whatsappUrl, '_blank');
}

// Populate Course Dropdowns from db.json
document.addEventListener("DOMContentLoaded", function () {
    fetch('assets/js/db.json')
        .then(response => response.json())
        .then(data => {
            const courses = [];
            if (data.AllCourseDetails) {
                for (const key in data.AllCourseDetails) {
                    if (data.AllCourseDetails.hasOwnProperty(key)) {
                        const courseName = data.AllCourseDetails[key].CourseName;
                        if (courseName) {
                            courses.push(courseName);
                        }
                    }
                }
            }

            // Sort alphabetically
            courses.sort();

            const dropdownIds = ['exampleFormControlSelect1', 'exampleFormControlSelect3'];

            dropdownIds.forEach(id => {
                const select = document.getElementById(id);
                if (select) {
                    // clear existing options
                    select.innerHTML = '<option value="" disabled selected>Select Course</option>';

                    courses.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course;
                        option.textContent = course;
                        select.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error('Error loading courses for dropdown:', error));
});

// Fetch and Render Testimonials
document.addEventListener("DOMContentLoaded", function () {
    const testimonialContainer = document.getElementById('ShortTestimonials');
    if (testimonialContainer) {
        fetch('assets/js/db.json')
            .then(response => response.json())
            .then(data => {
                const testimonials = data.Testimonials;
                let testimonialHTML = '';

                testimonials.forEach(t => {
                    testimonialHTML += `
                        <div class="text-center py-4">
                            <img src="${t.Image}" class="img-fluid m-auto Testimonial-images d-block" alt="${t.Name}" onerror="this.src='assets/images/Sample_User_Icon.png'">
                            <h5 class="mt-3 fw-bold">${t.Name}</h5>
                            <h6>${t.Text}</h6>
                        </div>
                    `;
                });

                testimonialContainer.innerHTML = testimonialHTML;

                // Initialize Slick Slider AFTER adding content
                $(testimonialContainer).slick({
                    responsive: [{
                        breakpoint: 992,
                        settings: {
                            arrows: true,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: false,
                        }
                    }
                    ]
                });
            })
            .catch(error => console.error('Error loading testimonials:', error));
    }
});