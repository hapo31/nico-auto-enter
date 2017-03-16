'use strict';

(()=>{
    const entry_info = $(".kaijo").find("strong");
    const date = $(entry_info[0]).text().substr(0, 10);
    const open = $(entry_info[1]).text();
    
    const streamId = location.href.split("/")[4];

    const openDate = new Date(`${date} ${open}:00`);
    const now = new Date();

    const timer = setTimeout(()=>{
        location.href = `http://live.nicovideo.jp/watch/${streamId}`;
    }, openDate.getTime() - now.getTime());
    
    $(".kaijo").append( $("<div>").text("時間になったら自動で入場します").css({
        "font-weight": "bold",
        "color" : "red"
    }));

})();