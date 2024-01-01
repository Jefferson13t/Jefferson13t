const ac = require('asciichart')

const USERNAME = "jefferson_Te_pereira";
const TIME_CLASS = 'rapid'; //daily, rapid, blitz, bullet
const RULES = 'chess';
const NGAMES = 100;
//const headers = {"User-Agent": "ChessRatingRefresh/1.0 aditya.pal.science@gmail.com"};
const ARCHIVES_URL = `https://api.chess.com/pub/player/${USERNAME}/games/archives`;

async function getEndpoints() {
    const response = await fetch(ARCHIVES_URL);
    const endpoints = await response.json();
       
    return endpoints.archives.reverse();
}

async function filteredGames(monthlyArchives){

    let monthlyGames = []
    const data = await fetch(monthlyArchives);
    const result = await data.json();
    monthlyGames.push(...result.games);

    let filteredGames = monthlyGames.filter((game)=>{
        return (game.time_class == TIME_CLASS && game.rules == RULES);
    });
    return filteredGames.reverse();
}

async function getRating(games){
    let ratingList = [];

    for(game of games){
        if(game.white.username == USERNAME){
            ratingList.push(game.white.rating);
        } else{
            ratingList.push(game.black.rating);
        }
    }

    return ratingList;
}

async function main(){
    const archives = await getEndpoints();
    let finalGames = [];
    for(archive of archives){
        const games = await filteredGames(archive);

        finalGames.push(...games);
        if(finalGames.length >= NGAMES){
            break;
        }
    }

    const ratingList = await getRating(finalGames);
    
    console.log(ac.plot(ratingList, {'height': 15}));
} 

main()