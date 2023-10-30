// https://api.quran.gading.dev/surah

const ayah = document.querySelector(".ayah"),
  player = document.querySelector(".player"),
  next = document.querySelector(".next"),
  play = document.querySelector(".play"),
  prev = document.querySelector(".prev"),
  surContainer = document.querySelector(".allSur");

playSurah();

function playSurah() {
  fetch("https://api.quran.gading.dev/surah")
    .then((res) => res.json())
    .then((data) => {
      for (const surah in data.data) {
        let div = document.createElement("div"),
          pContainer = document.createElement("div"),
          pAr = document.createElement("p"),
          pEn = document.createElement("p"),
          type = document.createElement("p");

        div.className = "sura";
        pAr.innerHTML = data.data[surah].name.long;
        pEn.innerHTML = data.data[surah].name.transliteration.en;
        pContainer.appendChild(pAr);
        pContainer.appendChild(pEn);

        type.innerHTML = data.data[surah].revelation.arab;

        div.appendChild(pContainer);
        div.appendChild(type);
        surContainer.appendChild(div);
      }
      let sur = document.querySelectorAll(".allSur .sura"),
        allVerses,
        allAudios;

      sur.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          sur.forEach((e) => {
            e.classList.remove("active");
          });
          surah.classList.add("active");
          fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
            .then((res) => res.json())
            .then((data) => {
              surahIndex = 0;
              let verses = data.data.verses;
              allVerses = [];
              allAudios = [];
              for (let i = 0; i < verses.length; i++) {
                allVerses.push(verses[i].text.arab);
                allAudios.push(verses[i].audio.primary);
              }

              let ayahIndex = 0;
              changeAyah(ayahIndex);

              player.addEventListener("ended", () => {
                ayahIndex++;
                if (ayahIndex < allAudios.length) {
                  changeAyah(ayahIndex);
                } else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                  player.pause();
                  isPlaying = true;
                  togglePlay();
                }
              });

              // Handel next and prev buttons
              next.addEventListener("click", () => {
                ayahIndex < allAudios.length - 1
                  ? ayahIndex++
                  : (ayahIndex = 0);
                changeAyah(ayahIndex);
                isPlaying = false;
                togglePlay();
              });
              prev.addEventListener("click", () => {
                ayahIndex == 0
                  ? (ayahIndex = allAudios.length - 1)
                  : ayahIndex--;
                changeAyah(ayahIndex);
                isPlaying = false;
                togglePlay();
              });

              // Handel play and pause button
              let isPlaying = false;
              togglePlay();
              function togglePlay() {
                if (isPlaying) {
                  player.pause();
                  play.innerHTML = `<i class="fa-solid fa-play"></i>`;
                  isPlaying = false;
                } else {
                  player.play();
                  play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                  isPlaying = true;
                }
              }
              play.addEventListener("click", togglePlay);

              player.addEventListener("pause", () => {
                play.innerHTML = `<i class="fa-solid fa-play"></i>`;
              });
              player.addEventListener("play", () => {
                play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
              });

              // function to change ayah
              function changeAyah(index) {
                player.src = allAudios[index];
                ayah.innerHTML = allVerses[index];
              }
            });
        });
      });
    });
}
