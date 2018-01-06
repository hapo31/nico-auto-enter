'use strict';

(() => {
    // overcapacityページ対策
    if (location.href.indexOf("overcapacity") >= 0) {
        console.log("overcapacity detected.");
        chrome.storage.local.get("liveUrl", (value) => {
            if (value.liveUrl == null) { return; }
            // サーバーに悪いので500ミリ秒待つ
            setTimeout(() => {
                location.href = value.liveUrl;
            }, 500);
        });
    } else {
        init();
    }
})();

function init() {
    try {
        const entry_info = $(".kaijo").find("strong");
        if (entry_info == null || entry_info.length === 0) {
            // 見れたっぽい場合はストレージを消す
            resetStorage();
            return;
        }
        const date = $(entry_info[0]).text().substr(0, 10);
        const openTime = $(entry_info[1]).text();
        const openTImeMatch = openTime.match(/(\d\d):(\d\d)/);
        const streamUrlQuery = location.href.split("/")[4];
        const idQueryIndex = streamUrlQuery.indexOf("?");
        const streamId = streamUrlQuery.substring(0, idQueryIndex >= 0 ? idQueryIndex : undefined);
        const liveUrlQuery = location.href.replace("gate", "watch");
        const queryIndex = liveUrlQuery.indexOf("?");
        const liveUrl = liveUrlQuery.substring(0, queryIndex >= 0 ? queryIndex : undefined);

        const endArea = $("#comment_area" + streamId);
        // おわってたら終わる
        if (endArea && endArea.text().indexOf("終了いたしました") >= 0) {
            resetStorage();
            return;
        }
        let hourInt = parseInt(openTImeMatch[1], 10);
        const minInt = parseInt(openTImeMatch[2], 10);

        const openDate = new Date(`${date}`);
        const now = new Date();

        // 24:30 みたいな24時を超えた時刻表記に対応させる
        if (hourInt >= 24 && minInt !== 0) {
            openDate.setDate(openDate.getDate() + 1);
            hourInt -= 24;
        }
        openDate.setHours(hourInt, minInt);

        const timer = setTimeout(() => {
            location.href = liveUrl;
        }, openDate.getTime() - now.getTime());

        $(".kaijo").append($("<div>").text("時間になったら自動で入場します").css({
            "font-weight": "bold",
            "color": "red"
        }));
        $(".kaijo").append($("<div>").attr("id", "remain").css({
            "font-weight": "bold",
            "color": "red"
        }));
        // ストレージにIDを保存しておく
        storeStrage(streamId, liveUrl, document.title);
    } catch (e) {
        console.error(e);
    }
}

function storeStrage(liveId, liveUrl, pageTitle) {
    console.log("stored:", { liveId, liveUrl, pageTitle });
    chrome.storage.local.set({ liveid: liveId }, () => {
    });
    chrome.storage.local.set({ liveUrl: liveUrl }, () => {
    });
    chrome.storage.local.set({ title: pageTitle }, () => {
    });
}

// ストレージのリセット
function resetStorage() {
    console.log("reset storage");
    chrome.storage.local.clear(() => {
        const error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}