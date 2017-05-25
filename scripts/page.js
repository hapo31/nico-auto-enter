console.log("popup");

(() => {
    chrome.storage.local.get(["liveid", "liveUrl", "title"], (value) => {
        update({
            id: value.liveid,
            url: value.liveUrl,
            title: value.title,
        });
    });
    chrome.storage.onChanged.addListener((changes, namespace) => {
        update({
            id: changes["liveid"],
            url: changes["liveUrl"],
            title: changes["title"],
        });
    });
})();

function update(values) {
    console.log(values);
    const { title, url } = values;
    if (title) {
        document.getElementById("targetLiveId").innerText = title;
    }
    if (url) {
        const el = document.getElementById("liveUrl");
        el.setAttribute("htef", url);
        el.innerText = url;
    }
}