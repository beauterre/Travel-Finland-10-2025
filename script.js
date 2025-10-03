const gallery = document.getElementById("gallery");
const player = document.getElementById("player");

document.getElementById("pictureFullScreen").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        player.requestFullscreen().catch(err => {
            console.error(`Fullscreen fout: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

let currentIndex = 0;

function fixPlayerAspect(img) {
    const aspect = img.naturalWidth / img.naturalHeight;
    if (aspect >= 1) {
        player.style.aspectRatio = "16 / 9";
    } else {
        player.style.aspectRatio = "9 / 16";
    }
}

function showItem(index) {
    currentIndex = index;
    player.innerHTML = "";
    const item = items[index];

    if (item.kind === "youtube") {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${item.id}?autoplay=1`;
        iframe.allowFullscreen = true;
        player.appendChild(iframe);
        player.style.aspectRatio = "9 / 16";
    } else if (item.kind === "image") {
        const img = document.createElement("img");
        img.src = photoPath + item.url;
        img.alt = "Foto";
        img.onload = () => fixPlayerAspect(img);
        player.style.aspectRatio = "9 / 16";
        player.appendChild(img);
    }

    player.style.display = "flex";
    player.scrollIntoView({behavior: "smooth"});

    document.querySelectorAll(".thumb").forEach((thumb, i) => {
        if (i === index) {
            thumb.style.border = "3px solid #2a4d69";
            thumb.style.opacity = "1";
        } else {
            thumb.style.border = "none";
            thumb.style.opacity = "0.7";
        }
    });
}

// thumbnails maken
items.forEach((item, index) => {
    const thumb = document.createElement("div");
    thumb.className = "thumb " + (item.kind === "youtube" ? "youtube" : "");
    const src = item.kind === "youtube" 
        ? `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`
        : photoPath + item.url;
    thumb.innerHTML = `<img src="${src}" alt="thumb">`;
    thumb.addEventListener("click", () => showItem(index));
    gallery.appendChild(thumb);

if (item.kind === "image" && item.setAsBackground) {
    document.body.style.backgroundImage = `
        linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.5)),
        url(${photoPath + item.url})
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

});

// nav buttons
document.getElementById("prevBtn").addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(newIndex);
});
document.getElementById("nextBtn").addEventListener("click", () => {
    const newIndex = (currentIndex + 1) % items.length;
    showItem(newIndex);
});

// eerste item tonen
showItem(0);
