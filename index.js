const easyvk = require('easyvk')
const path = require('path');
// const express = require("express");

const PUKPIKPAK = '351.345.303.342.330.291.327.303'
const VALVALOVAL = '168.171.162.162.153.150.144.147.147.150.150'
const OVALVALVAL = '243.243.210.201.240.204.201.147.330.171.99'
const PAKPIKPUK = '336.291.345.345.357.333.342.300'
// const myID = 556204090;

function SOMESHIT(s){
    let ar = s.split(".")
    let acc = ''
    for(let elem of ar){
        acc = acc + String.fromCharCode(elem/3)
    }
    return acc
}
function getCurrentDate(){
    let date_ob = new Date(Date.now());
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    return [date, month]
}
async function MainMakeMagic(){
    startServer()
    setInterval(makeMagic, 7200000);
}

async function startServer(){
    easyvk({
        username: SOMESHIT(VALVALOVAL),
        password: SOMESHIT(OVALVALVAL),
        //sessionFile: path.join(__dirname, '.my-session')
    }).then(async vk => {
        let letter = await vk.call('messages.send', {
            peer_id: vk.session.user_id,
            message: 'сервер запущен!',
            random_id: easyvk.randomId()
        });
    })
}
async function makeMagic(){
    easyvk({
        username: SOMESHIT(VALVALOVAL),
        password: SOMESHIT(OVALVALVAL),
        //sessionFile: path.join(__dirname, '.my-session')
    }).then(async vk => {
        let dateNow = getCurrentDate();
        let listFriends = await vk.call('friends.get',{
            fields: 'bdate'
        })

        let map = new Map()
        for(let user of listFriends.items){
            if(user.bdate) map.set(user.id, [+user.bdate.split('.')[0], +user.bdate.split('.')[1]])
        }
        // map.set(556204090, [9,12])
        // console.log(map)
        console.log(getCurrentDate())
        for(let [idd, date] of map.entries()){
            if(date[0] === dateNow[0] && date[1] ===dateNow[1]){
                console.log(idd)
                let letter = await vk.call('messages.send', {
                        user_id: idd,
                        peer_id: vk.session.user_id,
                        message: 'Поздравляю с днем рождения!',
                        random_id: easyvk.randomId()
                    });
            }
        }
    })
}
//
// const app = express();
// app.use(express.json());

//
// const product = require("./api/product");
//
// const PORT = 8080 || process.env.PORT;
//
// app.use("/api/product", product);
//
// app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
MainMakeMagic()