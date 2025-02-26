

let sendformHTML =document.getElementById("sendform");
let consoleOutputEle =document.getElementById("consoleOutputEle");
let category = document.getElementById("wcategory").value;
let newcategory = document.getElementById("wncategory").value;
let level = document.getElementById("wlevel").value;
let newlevel = document.getElementById("wnlevel").value;
let apikey = document.getElementById("apikey").value;
let haslevel = false;
let runcount = 1;


function log(text){
    consoleOutputEle.value+=text+'\n';
    consoleOutputEle.scrollTop=consoleOutputEle.scrollHeight;
}

sendformHTML.addEventListener("submit",(e)=>{
    e.preventDefault();


    if(category.value==""||newcategory.value==""){
        log("missing input values...");
        return;
    }

    log("");
    log("starting to move runs!");

    let Url;
    if(level&&newlevel){
        Url=`https://www.speedrun.com/api/v1/runs?category=${category}&level=${level}&max=${runcount}&status=verified`;
        haslevel = true;
        log("moving runs with levels...");
    }else{
        Url =`https://www.speedrun.com/api/v1/runs?category=${category}&max=${runcount}&status=verified `;
    }
    
    fetch(Url)
    .then(data=>{return data.json()})
    .then(res=>{
        log("recieved old runs...");
        changecatjson(res);
    })
    .catch(error=>{
        console.log(error);
        log(error);
    })

})

function changecatjson(catjson){

    let i = 0;
    catjson.data.forEach(run => {
        log("transforming run: "+i);
        
        run.category = newcategory;
        
        if(haslevel){
            run.level = newlevel;
        }else{
            delete run.level;
        }
        if(!run.data){
            delete run.data;
        }
        if(run.region){
            run.region = run.system.region;
        }
        if(run.system.platform){
            run.platform = run.system.platform;
        }

        run.verified=true;
        
        run.times.realtime =run.times.realtime_t
        run.times.ingame =run.times.ingame_t
        run.times.realtime_noloads =run.times.realtime_noloads_t;

        run.players.forEach(p=>{
            delete p.uri;
        })
        run.emulated = run.system.emulated;
        
        if(run.videos){
            run.video = run.videos.links[0].uri;
        }
        if(!run.comment){
            delete run.comment;
        }
        if(run.splits){
            run.splitsio = run.splits.uri;
        }
        for(var name in run.values) {
            run.variables[name].value = run.values[name];
            run.variables[name].type = "pre-defined";
        }

        delete run.values;
        delete run.submitted;
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
        
        i++;
    });

    log("transformed all runs...");

    
    i = 0;
    let postint = setInterval(()=>{
        console.log("posting request "+ i);
        log("posting new run request with index"+ i);
        postnewcategories(catjson.data[i]);
        if(i>=catjson.pagination.size-1){
            console.log("reached end at "+ i);
            log("reached end at run index:"+ i);
            clearInterval(postint);
        }
        i++;
    },Math.round((catjson.pagination.size*1000)/50))

}



function postnewcategories(data){

    const Url = "https://www.speedrun.com/api/v1/runs";
    const Data = JSON.stringify({run:data});
    const para = {
        headers:{
            "Content-Type":"application/json",
            "X-API-Key":apikey,
        },
        body:Data,
        method:"POST"
    };

    fetch(Url,para)
    .then(res=>{
        log("response: "+res.status);
        console.log(res)
    })
    .catch(error=>{
        console.log(error);
        log(error);
    });


}

