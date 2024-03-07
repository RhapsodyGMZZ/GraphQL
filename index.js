import { Login } from "./class/login.js";
import { Profile } from "./class/profile.js";
import { Domain, fetchData, queryLevel, queryProjects, queryRatio, queryUser, queryXP } from "./internal/requestHandler.js";


const welcome = () => {
    const jwt = window.localStorage.getItem('jwt');
    if (jwt) {
        Home(jwt);
    } else {
        new Login();
    }
}


const Home = async (jwt) => {
    let container = document.getElementById('container');
    container.style.backgroundImage = 'url(\'./static/img/background.jpg\')';

    let btn = document.createElement('button');
    btn.id = 'logout';
    btn.textContent = 'Logout';
    btn.addEventListener('click', () => {
        window.localStorage.removeItem("jwt");
        location.reload();
    });

    let xpGraph;
    let activity = await fetchData(jwt, queryProjects)
        .then(json => {
            let lastActivity = [];
            let count = 0;
            xpGraph = json.data.transaction;
            xpGraph.forEach(path => {
                if (count < 4) {
                    lastActivity.push(path);
                }
                count++;
            });
            return lastActivity;
            //REMIND: last activity here
        });
    console.log('activity :', activity);
    let level = await fetchData(jwt, queryLevel)
        .then(json => {
            const level = json.data.user[0].events[0].level;
            return level
            //REMIND: level here
        });
    console.log('level : ', level);

    await fetchData(jwt, queryUser)
        .then(json => {
            const user = json.data.user[0];
            let titleHead = document.createElement('a');
            titleHead.id = 'navTitle';
            titleHead.href = `${Domain}/intra/rouen/profile?event=106`;
            titleHead.textContent = `Hello ${user.firstName} ${user.lastName} !`;

            let levelHeader = document.createElement('div');
            levelHeader.id = 'levelHeader';
            levelHeader.textContent = level;

            document.getElementById('navbar').appendChild(titleHead);
            document.getElementById('navbar').appendChild(levelHeader);
            document.getElementById('navbar').appendChild(btn);
        });

    let ratioData = await fetchData(jwt, queryRatio)
        .then(json => {
            const data = json.data.user[0];
            const ratio = data.auditRatio.toFixed(1);
            return { ratio: ratio, done: data.totalUp, received: data.totalDown }
            //REMIND: Ratio data here 

        })
    console.log('ratioData :', ratioData);
    let xp = await fetchData(jwt, queryXP)
        .then(json => {
            const xp = json.data.transaction_aggregate.aggregate.sum.amount;
            return formatXPSize(xp)
            //REMIND: queryXP here
        })
    console.log('xp :', xp);
    console.log(formatXPSize(19100))

    new Profile(level, activity, ratioData, xp, xpGraph);
    let modal = document.getElementById('card-xp');
    document.getElementById('levelHeader').addEventListener('mouseenter', () => {
        modal.style.display = 'flex';
        container.style.backgroundImage = '';
        document.getElementsByTagName('main')[0].style.backgroundImage = 'url(\'./static/img/background.jpg\')';
        modalHandle(modal, 'none', 'hidden');

    })
    window.addEventListener('click', (e) => {
        if (e.target != document.getElementById('card-xp')) {
            modal.style.display = "none";
            container.style.backgroundImage = 'url(\'./static/img/background.jpg\')';
            document.getElementsByTagName('main')[0].style.backgroundImage = '';
            modalHandle(modal, 'flex', '');
        }
    })
}

export const formatXPSize = (xp) => {

    const formatMB = (xp) => {
        let sizeInMB = (xp / (1000 * 1000)).toFixed(2);
        return `${sizeInMB} MB`;
    };

    const formatKB = (xp) => {
        let sizeInKB;
        if (xp < 100000) {
            sizeInKB = xp / 1000;
            return `${sizeInKB.toFixed(1).toString()} kB`;
        } else {
            sizeInKB = Math.round(xp / 1000);
            return `${sizeInKB.toString()} kB`;
        }
    };

    if (xp < 1000000) {
        return formatKB(xp);
    } else {
        return formatMB(xp);
    }
}

const modalHandle = (modal, opt, overflow) => {
    container.childNodes.forEach(node => {
        if (node != modal) {
            document.body.style.overflow = overflow;
            node.style.display = opt;
        }
    })
}

welcome();
