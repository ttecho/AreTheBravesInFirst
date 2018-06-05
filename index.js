const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
const app = express();


const standingUrl = `http://www.espn.com/mlb/standings`;
const teamName = 'Atlanta Braves';

const firstPlaceMessage = 'You better believe it!';
const firstPlaceImage = 'http://cdn2.vox-cdn.com/imported_assets/2375150/chopnats.gif';

const notInFirstMessage = 'No :(';
const notInFirstImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ8eKw3SGf4ef9Q-KRPWXWUT_TyDSiDx_zFFRZOnj81EBrOepDSQ';

const options = {
    uri: standingUrl,
    transform: function (body) {
        return cheerio.load(body);
    }
};

const areTheBravesInFirst = rp(options).then(($) => {
    let firstPlaceNLEast = $($('.hide-mobile a')[15]).text();

    if (firstPlaceNLEast === teamName) {
        return {
            message: firstPlaceMessage,
            image: firstPlaceImage
        };
    } else {
        return {
            message: notInFirstMessage,
            image: notInFirstImage
        };;
    }
}).catch((err) => {
    console.log(err);
});

app.engine('html', require('ejs').renderFile);

app.get('/', async (req, res) => {
    const results = await areTheBravesInFirst;
    res.render(__dirname + "/index.html", {message: results.message, image: results.image});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

