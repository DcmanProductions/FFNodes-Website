(() => {
    const listElement = $("#versions .list")
    const releaseType = {
        release: "release",
        beta: "beta",
        alpha: "alpha",
        unknown: "unknown",
    }
    
    // getVersions();
    async function getVersions() {
        listElement.html('');

        const releases = await $.get("https://api.github.com/repos/DcmanProductions/ffnodes/releases");
        
        Array.from(releases).forEach(i => {
            let type = releaseType.unknown;
            if (i.tag_name.includes('release')) {
                type = releaseType.release;
            } else if (i.tag_name.includes('beta')) {
                type = releaseType.beta;
            } else if (i.tag_name.includes('alpha')) {
                type = releaseType.alpha;
            }


            let assets = Array.from(i.assets);
            let downloadUrl = "";
            let downloadCount = 0;
            for (let j = 0; j < assets.length; j++) {
                let asset = assets[j];
                if (asset.name.toLowerCase().includes('installer') || asset.name.toLowerCase().endsWith('exe')) {
                    
                    downloadUrl = asset.browser_download_url;
                    downloadCount = asset.download_count;
                    break;
                }
            }

            listElement.append(createVersion(i.name, type, downloadUrl, downloadCount))
        })

    }


    /**
     * Creates a version item and returns the html element
     * @param {string} name the name of the version
     * @param {string} type the release type of the version
     * @param {string} url the direct download url
     * @param {number} downloads the number of downloads
     */
    function createVersion(name, type, url, downloads) {
        const element = $(`<div class="version-item release row center horizontal"></div>`);
        const typeElement = $(`<span class="release-type ${type}" title="${type} release">${type.charAt(0).toUpperCase()}</span>`)
        const nameElement = $(`<span class="name fill">${name}</span>`)
        const downloadElement = $(`
        <a href="${url}" class="download-button button primary" title="Download this version!">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path d="M21.6152 16.7312V20.0645C21.6152 20.5066 21.4045 20.9305 21.0294 21.243C20.6544 21.5556 20.1457 21.7312 19.6152 21.7312H5.61523C5.0848 21.7312 4.57609 21.5556 4.20102 21.243C3.82595 20.9305 3.61523 20.5066 3.61523 20.0645V16.7312M7.61523 10.7312L12.2617 15.3776C12.4569 15.5729 12.7735 15.5729 12.9688 15.3776L17.6152 10.7312M12.6152 14.7312V3.7312" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </a>
    `)
        const downloadCountElement = $(`<span class="download-count" title="${downloads.toLocaleString()} downloads">${shortenNumber(downloads)}</span>`)

        element.append(typeElement)
        element.append(nameElement)
        element.append(downloadElement)
        element.append(downloadCountElement)

        return element;
    }

    /**
     * Formats the number provided to a shortened version.
     * Ex: 5000 -> 5K
     * @param {number} number 
     * @returns 
     */
    function shortenNumber(number) {
        const abbreviations = ["K", "M", "B", "T"];
        let result = number;

        for (let i = abbreviations.length - 1; i >= 0; i--) {
            const factor = Math.pow(10, (i + 1) * 3);
            if (number >= factor) {
                result = (number / factor).toFixed(2) + abbreviations[i];
                break;
            }
        }

        return result;
    }
})()