const packageinfo = `api/packageinfo/`;

function load() {
  fetchTweaksList().then((tweaks) => {
    renderTweakData(tweaks);
  });
}

function renderTweakData(tweaks) {
  const listElement = document.createElement("div");

  tweaks.package_ids.forEach((packageId) => {
    fetchPackageControl(packageId).then((controlData) => {
      const link = document.createElement("a");
      link.href = `depictions/index.html?packageId=${packageId}`;

      // Row content
      const tweakRow = document.createElement("div");
      tweakRow.className = "tweak-row";

      // Tweak icon
      const image = document.createElement("img");
      const pkgIconUrl = `${packageinfo}${packageId}/icon.png`;
      fetch(pkgIconUrl)
        .then((response) => {
          if (response.ok) {
            image.src = pkgIconUrl;
          } else {
            image.src = `assets/images/default_icon.png`;
            console.clear();
          }
        })
        .catch((e) => {
          image.src = `assets/images/default_icon.png`;
          console.clear();
        });

      image.className = "tweak-row-img";
      tweakRow.appendChild(image);

      // Tweak description
      const tweakInfo = document.createElement("div");
      tweakInfo.className = "tweak-info";

      const tweakTitle = document.createElement("h3");
      const tweakTitleText = document.createTextNode(`${controlData.Name}`);
      tweakTitle.className = "tweak-title";
      tweakTitle.appendChild(tweakTitleText);
      tweakInfo.appendChild(tweakTitle);

      const tweakSubtitle = document.createElement("p");
      const tweakSubtitleText = document.createTextNode(
        `${controlData.Description}`,
      );
      tweakSubtitle.className = "tweak-subtitle";
      tweakSubtitle.appendChild(tweakSubtitleText);
      tweakInfo.appendChild(tweakSubtitleText);

      const chevronImage = document.createElement("img");
      chevronImage.src = "assets/images/chevron.png";
      chevronImage.alt = "Chevron";
      chevronImage.className = "chevron-icon";

      tweakRow.appendChild(tweakInfo);
      tweakRow.appendChild(chevronImage);
      link.appendChild(tweakRow);
      listElement.appendChild(link);
    });

    document.getElementById("tweak-rows").appendChild(listElement);
  });
}

function isValidResponse(response) {
  return !(response.status >= 400 && response.status < 600);
}

async function fetchPackageControl(packageId) {
  try {
    const response = await fetch(`${packageinfo}${packageId}/control.json`);
    if (isValidResponse(response)) {
      return response.json();
    } else {
      throw new Error("Bad response from server");
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchTweaksList() {
  try {
    const response = await fetch(`api/packages.json`);
    if (isValidResponse(response)) {
      return response.json();
    } else {
      throw new Error("Bad response from server");
    }
  } catch (error) {
    console.log(error);
  }
}
