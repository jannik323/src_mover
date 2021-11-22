

let sendformHTML =document.getElementById("sendform");
let category = document.getElementById("wcategory").value;
let newcategory = document.getElementById("wncategory").value;
let level = document.getElementById("wlevel").value;
let newlevel = document.getElementById("wnlevel").value;
let apikey = document.getElementById("apikey").value;
let haslevel = false;
sendformHTML.addEventListener("submit",(e)=>{
    e.preventDefault();
    let Url;
    if(level&&newlevel){
         Url=`https://www.speedrun.com/api/v1/runs?category=${category}&max=10&level=${level}`;
         haslevel = true;
    }else{

        Url =`https://www.speedrun.com/api/v1/runs?category=${category}&max=10 `;
    }
    
    fetch(Url)
    .then(data=>{return data.json()})
    .then(res=>{changecatjson(res)})
    .catch(err=>{console.log(err)})

})

function changecatjson(catjson){
    catjson.data.forEach(run => {

        console.log(run)
        for(var name in run.values) {
            run.variables[name].value = run.values[name];
            run.variables[name].type = "pre-defined";
        }

        if(haslevel){
            run.level = newlevel;
        }else{
            run.level = null
        }
        if(run.splits){
            run.splitsio = run.splits.uri;
        }else{
            run.splitsio = null
        }
        run.category = newcategory;
        if(run.videos){
            run.video = run.videos.links[0].uri;
        }
        run.times.realtime =run.times.realtime_t
        run.times.ingame =run.times.ingame_t
        run.times.realtime_noloads =run.times.realtime_noloads_t;
        run.verified=true;
        run.platform = run.system.platform;
        run.emulated = run.system.emulated;
        run.region = run.system.region;
        run.variables = {}
        run.variables[run.values.k]
        delete run.values;
        delete run.id;
        delete run.links;
        delete run.videos;
        delete run.status;
        delete run.system;
        delete run.weblink;
        delete run.splits;
        delete run.times.primary;
        delete run.times.ingame_t;
        delete run.times.realtime_t;
        delete run.times.realtime_noloads_t;
        delete run.game;
        run.players.forEach(p=>{
            delete p.uri;
        })
    

    });
    console.log(catjson.data)

    postnewcategories(catjson.data);

}

function postnewcategories(data){

    const Url = "https://www.speedrun.com/api/v1/runs";
    const Data = JSON.stringify({run:data[0]});
    const para = {
        headers:{
            "Content-Type":"application/json; charset=UTF-8",
            "X-API-Key":apikey,
            "Access-Control-Allow-Headers":"X-API-Key",

        },
        body:Data,
        method:"POST"
    };

    fetch(Url,para)
    .then(data=>{return data.json()})
    .then(res=>{console.log(res)})
    .catch(error=>{console.log(error)});


}