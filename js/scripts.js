(function ($, root, undefined) {
	$(function () {
		'use strict';
        //startTime();
        setDarkMode();
        $(document).on('click', '.btn-close', function () {
            $(this).parent().toggleClass('hidden');
            $('body').toggleClass('open-modal');
        });

        $(document).on('click', '#join-trigger', function () {
            $('body').toggleClass('open-modal');
            $('.join-modal').removeClass('hidden');
        });
    });
})(jQuery, this);

/*-- year --*/
const y = new Date();
let year = y.getFullYear();
document.getElementById("current_year").innerHTML = year;
/*-- end year --*/

function setDarkMode() {
    var currentTime = new Date();
    var startTime = new Date();
    startTime.setHours(23, 11, 0); // 23:11:00
    
    var endTime = new Date();
    endTime.setHours(11, 11, 0); // 11:11:00
    
    if ((currentTime >= startTime) || (currentTime >= new Date(0, 0, 0, 0, 0) && currentTime <= endTime)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    //console.log(currentTime);
}
setInterval(setDarkMode, 1000); 

/*-- End Current time --*/


/*-- Video Modal --*/
var modal = document.getElementById("videoModal");
var modalBtns = document.querySelectorAll(".openModalBtn");

// When any of the buttons are clicked, open the modal with the corresponding video
modalBtns.forEach(function(btn) {
    btn.onclick = function() {
        var videoId = btn.getAttribute("data-video-id");
        var videoUrl = "https://www.youtube.com/embed/" + videoId;
        document.getElementById("videoFrame").src = videoUrl;
        document.body.classList.add('open-modal');
        modal.classList.remove('hidden');
        // modal.style.display = "block";
    };
});
/*-- End Video Modal --*/
