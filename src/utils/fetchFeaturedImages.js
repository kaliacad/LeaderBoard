const fetchFeaturedImages = async () => {
  try {
    const response = await fetch(
      "https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Featured_pictures_on_Wikimedia_Commons&gcmtype=file&gcmlimit=10&prop=imageinfo&iiprop=url|thumbnail&iiurlwidth=1366&format=json&origin=*"
    );
    const data = await response.json();
    const pages = data.query.pages;
    const images = Object.keys(pages).map(
      (key) => pages[key].imageinfo[0].thumburl
    );
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return randomImage;
  } catch (error) {
    console.error("Error fetching the featured images:", error);
  }
};

export default fetchFeaturedImages;
